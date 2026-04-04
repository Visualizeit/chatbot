import { os } from '@orpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod/v4'

import db from '@/db/db'
import { conversationTable } from '@/db/schema'

const conversationRouter = {
    findById: os
        .input(
            z.object({
                conversationId: z.string(),
            }),
        )
        .handler(async ({ input }) => {
            const conversation = await db.query.conversationTable.findFirst({
                where: eq(conversationTable.id, input.conversationId),
            })

            return conversation ? conversation.messages : []
        }),
    list: os.handler(
        async () =>
            await db.query.conversationTable.findMany({
                columns: {
                    messages: false,
                },
            }),
    ),
    remove: os
        .input(
            z.object({
                conversationId: z.string(),
            }),
        )
        .handler(async ({ input }) => {
            await db
                .delete(conversationTable)
                .where(eq(conversationTable.id, input.conversationId))
                .returning()

            return { success: true }
        }),
}

export default conversationRouter
