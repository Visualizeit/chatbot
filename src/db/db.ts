import { drizzle } from 'drizzle-orm/libsql'

import env from '../env'
import * as schema from './schema'

const db = drizzle(env.DB_FILE_NAME, { casing: 'snake_case', schema })

export default db
