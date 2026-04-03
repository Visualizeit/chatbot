import { generateId } from 'ai'
import { sqliteTable } from 'drizzle-orm/sqlite-core'

import type { ChatUIMessage } from '@/apis/chat-ui-message'

export const chatSessionTable = sqliteTable('chat_session', (t) => ({
    id: t
        .text()
        .primaryKey()
        .$defaultFn(() => generateId()),
    messages: t.text({ mode: 'json' }).$type<ChatUIMessage[]>().notNull().default([]),
    title: t.text().notNull().default(''),
}))
