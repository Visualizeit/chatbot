import { generateId } from 'ai'
import { sqliteTable } from 'drizzle-orm/sqlite-core'
import type { ChatUIMessage } from '@/apis/ChatUIMessage'

export const chatSessionTable = sqliteTable('chat_session', (t) => ({
    id: t
        .text()
        .primaryKey()
        .$defaultFn(() => generateId()),
    title: t.text().notNull().default(''),
    messages: t
        .text({ mode: 'json' })
        .$type<ChatUIMessage[]>()
        .notNull()
        .default([]),
}))
