import config from '@payload-config'
import { getPayload } from 'payload'

import { passwordProblem } from '@/collections/Users'

/**
 * Adds one panel account from the command line, for when nobody can sign in to add it in
 * /admin. The details come from environment variables so that no password is ever written
 * into a file:
 *
 *   NEW_USER_NAME, NEW_USER_USERNAME, NEW_USER_PASSWORD, NEW_USER_ROLE (admin | superadmin)
 *
 * Run with `pnpm payload run src/seed/add-user.ts`. An existing username is left alone.
 */
const payload = await getPayload({ config })

const {
  NEW_USER_NAME: name,
  NEW_USER_USERNAME: username,
  NEW_USER_PASSWORD: password,
  NEW_USER_ROLE: role = 'admin',
} = process.env

if (!name || !username || !password) {
  payload.logger.error('Set NEW_USER_NAME, NEW_USER_USERNAME and NEW_USER_PASSWORD')
} else if (role !== 'admin' && role !== 'superadmin') {
  payload.logger.error('NEW_USER_ROLE must be admin or superadmin')
} else if (passwordProblem(password, null, username)) {
  payload.logger.error(`Password is too weak. ${passwordProblem(password, null, username)}`)
} else {
  const existing = await payload.find({
    collection: 'users',
    where: { username: { equals: username } },
    limit: 1,
    depth: 0,
  })
  if (existing.totalDocs > 0) {
    payload.logger.warn(`Users: ${username} already exists, nothing changed`)
  } else {
    await payload.create({ collection: 'users', data: { name, username, password, role } })
    payload.logger.info(`Users: ${role} ${username} created`)
  }
}

process.exit(0)
