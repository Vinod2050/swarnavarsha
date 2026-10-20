import {
  addDataAndFileToRequest,
  Forbidden,
  ValidationError,
  type CollectionAfterOperationHook,
  type CollectionBeforeLoginHook,
  type CollectionBeforeOperationHook,
  type CollectionBeforeValidateHook,
  type CollectionConfig,
  type Payload,
  type PayloadHandler,
} from 'payload'

import { isSuperAdmin, isSuperAdminField, nobodyField } from '@/access'
import { auditChange, auditDelete, auditLogin, recordAudit } from '@/hooks/audit'

const MIN_PASSWORD_LENGTH = 11

/**
 * Five wrong passwords lock an account until the super admin unlocks it, so the lock is set
 * far in the future instead of timing out. The owner asks for the unlock from the
 * "Forgot password?" page.
 */
const LOCK_TIME = 10 * 365 * 24 * 60 * 60 * 1000
/** A super admin has nobody to ask, so that lock still opens by itself after 15 minutes */
const SUPERADMIN_LOCK_TIME = 15 * 60 * 1000

/** Returns what is wrong with a password, or null when it is strong enough. */
export function passwordProblem(
  password: string,
  email?: string | null,
  username?: string | null,
): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`
  }
  if (
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/\d/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  ) {
    return 'Use a capital letter, a small letter, a number and a symbol.'
  }
  // The part before any @ of the email or username must not be inside the password
  for (const identity of [email, username]) {
    const localPart = identity?.split('@')[0]?.toLowerCase()
    if (localPart && localPart.length >= 4 && password.toLowerCase().includes(localPart)) {
      return 'Do not use your username or email address in the password.'
    }
  }
  return null
}

/** Runs when an account is created and whenever a password is changed or reset. */
const enforceStrongPassword: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  if (typeof data?.password !== 'string') return data
  const problem = passwordProblem(
    data.password,
    data.email ?? originalDoc?.email,
    data.username ?? originalDoc?.username,
  )
  if (problem) {
    throw new ValidationError({
      collection: 'users',
      errors: [{ path: 'password', message: problem }],
    })
  }
  return data
}

type Identity = { data?: { username?: unknown; email?: unknown } }

/** The account behind a username (or email) typed into the sign-in or forgot-password box. */
async function findAccount(payload: Payload, identifier: unknown) {
  const value = typeof identifier === 'string' ? identifier.toLowerCase().trim() : ''
  if (!value) return null
  const { docs } = await payload.find({
    collection: 'users',
    where: { or: [{ username: { equals: value } }, { email: { equals: value } }] },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    // lockUntil is a hidden field
    showHiddenFields: true,
  })
  return docs[0] ?? null
}

const isLocked = (account: { lockUntil?: string | null }) =>
  Boolean(account.lockUntil && new Date(account.lockUntil) > new Date())

/** Before a sign-in attempt: reopen a super admin account whose 15 minutes are over. */
const releaseSuperAdminLock: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  if (operation !== 'login') return args
  const { data } = args as Identity
  const account = await findAccount(req.payload, data?.username ?? data?.email)
  if (account?.role === 'superadmin' && account.lockUntil && isLocked(account)) {
    const lockedAt = new Date(account.lockUntil).getTime() - LOCK_TIME
    if (Date.now() - lockedAt >= SUPERADMIN_LOCK_TIME) {
      await req.payload.unlock({
        collection: 'users',
        data: account.username ? { username: account.username } : { email: account.email ?? '' },
        overrideAccess: true,
      })
    }
  }
  return args
}

/** A new password answers the request, and lets a locked account sign in again. */
const settleRequestOnPasswordChange: CollectionBeforeValidateHook = ({ data, operation }) => {
  if (operation === 'update' && data && typeof data.password === 'string' && data.password) {
    data.accessRequest = null
    data.accessRequestedAt = null
    data.loginAttempts = 0
    data.lockUntil = null
  }
  return data
}

/** "Force unlock" in the panel answers the request too. */
const settleRequestOnUnlock: CollectionAfterOperationHook = async ({
  args,
  operation,
  req,
  result,
}) => {
  if (operation !== 'unlock') return result
  const { data } = args as Identity
  const account = await findAccount(req.payload, data?.username ?? data?.email)
  if (!account) return result
  if (account.accessRequest) {
    await req.payload.update({
      collection: 'users',
      id: account.id,
      data: { accessRequest: null, accessRequestedAt: null },
      overrideAccess: true,
      context: { skipAudit: true },
    })
  }
  // Not logged when the system reopens a super admin account by itself
  if (req.user) {
    await recordAudit(req, 'update', `Unlocked account ${account.username ?? account.email}`)
  }
  return result
}

/**
 * POST /api/users/forgot-password, in place of Payload's emailed reset link. The request is
 * stored on the account and shown on the super admin's dashboard, who then sets a new
 * password or unlocks the account. The answer is the same whether or not the username
 * exists, so the page cannot be used to find out which usernames are real.
 */
const requestAccess: PayloadHandler = async (req) => {
  await addDataAndFileToRequest(req)
  const data = req.data as Identity['data']
  const account = await findAccount(req.payload, data?.username ?? data?.email)

  if (account && !account.blocked) {
    const kind = isLocked(account) ? 'unlock' : 'reset'
    // Asking again does not add another row to the activity log
    if (account.accessRequest !== kind) {
      await req.payload.update({
        collection: 'users',
        id: account.id,
        data: { accessRequest: kind, accessRequestedAt: new Date().toISOString() },
        overrideAccess: true,
        context: { skipAudit: true },
      })
      const who = account.username ?? account.email ?? 'unknown'
      await recordAudit(
        req,
        'request',
        kind === 'unlock' ? `Asked to unlock account ${who}` : `Asked for a new password: ${who}`,
        who,
      )
    }
  }

  return Response.json({ message: 'Request sent.' })
}

/** A blocked account cannot sign in, even with the right password. */
const refuseBlocked: CollectionBeforeLoginHook = ({ user }) => {
  if (user.blocked) throw new Forbidden()
  return user
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Settings',
    // Only the super admin manages accounts. Admins reach their own account from the profile menu.
    hidden: ({ user }) => user?.role !== 'superadmin',
    useAsTitle: 'name',
    defaultColumns: ['name', 'username', 'role', 'blocked'],
    description:
      'Add or remove admins. Open an account to set a new password, block or unblock it, or unlock it after 5 wrong passwords.',
  },
  auth: {
    // Staff sign in with a username. An account that only has an email (the first super
    // admin from the seed) can still sign in with it.
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: false,
      requireUsername: false,
    },
    maxLoginAttempts: 5,
    lockTime: LOCK_TIME,
    // Signed out after 4 hours; a password change signs out every other device
    tokenExpiration: 4 * 60 * 60,
    useSessions: true,
    removeTokenFromResponses: true,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    },
  },
  access: {
    // Admins see and edit only their own account (name and password)
    read: ({ req: { user } }) =>
      user?.role === 'superadmin' ? true : user ? { id: { equals: user.id } } : false,
    create: isSuperAdmin,
    update: ({ req: { user } }) =>
      user?.role === 'superadmin' ? true : user ? { id: { equals: user.id } } : false,
    // A super admin cannot delete their own account, so one always remains
    delete: ({ req: { user } }) =>
      user?.role === 'superadmin' ? { id: { not_equals: user.id } } : false,
    unlock: isSuperAdmin,
    admin: ({ req: { user } }) =>
      (user?.role === 'superadmin' || user?.role === 'admin') && !user.blocked,
  },
  endpoints: [{ path: '/forgot-password', method: 'post', handler: requestAccess }],
  hooks: {
    beforeOperation: [releaseSuperAdminLock],
    afterOperation: [settleRequestOnUnlock],
    beforeValidate: [enforceStrongPassword, settleRequestOnPasswordChange],
    beforeLogin: [refuseBlocked],
    beforeChange: [
      // On an empty database the very first account becomes the super admin
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.role = 'superadmin'
        }
        return data
      },
    ],
    afterChange: [auditChange((doc) => `Account ${doc.username ?? doc.email} (${doc.role})`)],
    afterDelete: [auditDelete((doc) => `Account ${doc.username ?? doc.email}`)],
    afterLogin: [auditLogin],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Super admin (everything, including accounts)', value: 'superadmin' },
        { label: 'Admin (rates and videos only)', value: 'admin' },
      ],
      access: {
        create: isSuperAdminField,
        // Nobody changes their own role, so a super admin cannot lock everyone out by mistake
        update: ({ req: { user }, id }) =>
          user?.role === 'superadmin' && String(id) !== String(user.id),
      },
    },
    {
      name: 'blocked',
      label: 'Block this account',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'A blocked account cannot sign in or use the panel. Untick to let it back in.',
      },
      access: {
        create: isSuperAdminField,
        // Nobody blocks their own account, so the super admin cannot lock themselves out
        update: ({ req: { user }, id }) =>
          user?.role === 'superadmin' && !user.blocked && String(id) !== String(user.id),
      },
    },
    {
      name: 'accessRequest',
      label: 'Request from this admin',
      type: 'select',
      options: [
        { label: 'Forgot password: needs a new one', value: 'reset' },
        { label: 'Locked after 5 wrong passwords: needs unlocking', value: 'unlock' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Sent from the "Forgot password?" page. It clears itself when you set a new password or unlock the account. Empty it to dismiss the request.',
      },
      access: {
        read: isSuperAdminField,
        create: nobodyField,
        update: isSuperAdminField,
      },
    },
    {
      name: 'accessRequestedAt',
      label: 'Request sent',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
        condition: (data) => Boolean(data?.accessRequest),
      },
      access: {
        read: isSuperAdminField,
        create: nobodyField,
        update: nobodyField,
      },
    },
  ],
}
