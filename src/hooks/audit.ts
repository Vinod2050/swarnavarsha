import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionAfterLoginHook,
  PayloadRequest,
} from 'payload'

export type AuditAction = 'login' | 'create' | 'update' | 'delete' | 'export' | 'request'

/**
 * Writes one row to the activity log (super admin only, see collections/AuditLogs.ts).
 * A failure to log never blocks the action itself.
 */
export async function recordAudit(
  req: PayloadRequest,
  action: AuditAction,
  target: string,
  actorEmail = req.user?.username ?? req.user?.email,
): Promise<void> {
  try {
    await req.payload.create({
      collection: 'audit-logs',
      data: { action, target, actor: actorEmail ?? 'system' },
      overrideAccess: true,
      req,
    })
  } catch (error) {
    req.payload.logger.error({ err: error }, 'Could not write to the activity log')
  }
}

type Describe = (doc: Record<string, unknown>) => string

export const auditChange =
  (describe: Describe): CollectionAfterChangeHook =>
  async ({ context, doc, operation, req }) => {
    // A hook that writes its own, clearer log line asks for this one to be left out
    if (!context.skipAudit) await recordAudit(req, operation, describe(doc))
    return doc
  }

export const auditDelete =
  (describe: Describe): CollectionAfterDeleteHook =>
  async ({ doc, req }) => {
    await recordAudit(req, 'delete', describe(doc))
    return doc
  }

export const auditLogin: CollectionAfterLoginHook = async ({ req, user }) => {
  const who = user.username ?? user.email
  await recordAudit(req, 'login', `Signed in: ${who}`, who)
  return user
}
