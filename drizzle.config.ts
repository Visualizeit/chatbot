import '@dotenvx/dotenvx/config'

import { defineConfig } from 'drizzle-kit'
import env from './src/env'

export default defineConfig({
    out: './drizzle',
    schema: 'src/db/schema.ts',
    casing: 'snake_case',
    dialect: 'sqlite',
    dbCredentials: {
        url: env.DB_FILE_NAME,
    },
})
