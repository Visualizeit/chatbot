import { sqliteTable } from 'drizzle-orm/sqlite-core'
import { nanoid } from 'nanoid'

import type { ConversationMessage } from '@/apis/conversation-message'

export const conversationTable = sqliteTable('conversation', (t) => ({
    id: t
        .text()
        .primaryKey()
        .$defaultFn(() => nanoid()),
    messages: t.text({ mode: 'json' }).$type<ConversationMessage[]>().notNull().default([]),
    title: t.text().notNull().default(''),
}))
