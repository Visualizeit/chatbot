import { sqliteTable } from 'drizzle-orm/sqlite-core'
import { nanoid } from 'nanoid'

import type { ChatUIMessage } from '@/apis/chat-ui-message'

export const chatSessionTable = sqliteTable('chat_session', (t) => ({
    id: t
        .text()
        .primaryKey()
        .$defaultFn(() => nanoid()),
    messages: t.text({ mode: 'json' }).$type<ChatUIMessage[]>().notNull().default([]),
    title: t.text().notNull().default(''),
}))
