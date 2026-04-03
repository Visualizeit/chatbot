import { integer } from 'drizzle-orm/sqlite-core'

const timestamps = {
    created_at: integer({ mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date()),
    updated_at: integer({ mode: 'timestamp' })
        .notNull()
        .$onUpdateFn(() => new Date()),
}

export default timestamps
