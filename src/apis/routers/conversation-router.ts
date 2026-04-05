import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { streamToEventIterator } from '@orpc/server'
import { convertToModelMessages, ToolLoopAgent, validateUIMessages } from 'ai'
import { os } from '@orpc/server'
import { eq } from 'drizzle-orm'
import { isNil } from 'es-toolkit'
import { z } from 'zod/v4'

import db from '@/db/db'
import { conversationTable } from '@/db/schema'
import env from '@/env'

import type { ConversationMessage } from '../conversation-message'

const languageModelProvider = createOpenAICompatible({
    apiKey: env.OPENAI_API_KEY,
    baseURL: env.OPENAI_BASE_URL,
    name: 'LanguageModel',
})

const model = languageModelProvider(env.OPENAI_MODEL_ID)

const getConversationTitle = (messages: ConversationMessage[]) => {
    const firstUserMessage = messages.find((message) => message.role === 'user')

    if (isNil(firstUserMessage)) {
        return ''
    }

    const firstTextPart = firstUserMessage.parts.find((part) => part.type === 'text')

    if (isNil(firstTextPart)) {
        return ''
    }

    return firstTextPart.text.slice(0, 52)
}

const agent = new ToolLoopAgent({
    model,
})

const sendConversationInputSchema = z.object({
    conversationId: z.string(),
    messages: z.custom<ConversationMessage[]>(),
})

const conversationRouter = {
    send: os.input(sendConversationInputSchema).handler(async ({ input }) => {
        const validatedMessages = await validateUIMessages({
            messages: input.messages,
        })

        const result = await agent.stream({
            messages: await convertToModelMessages(validatedMessages),
        })

        return streamToEventIterator(
            result.toUIMessageStream({
                onFinish: async ({ messages }) => {
                    const conversation = await db.query.conversationTable.findFirst({
                        where: eq(conversationTable.id, input.conversationId),
                    })

                    if (isNil(conversation)) {
                        await db.insert(conversationTable).values({
                            id: input.conversationId,
                            messages,
                            title: getConversationTitle(validatedMessages),
                        })

                        return
                    }

                    await db
                        .update(conversationTable)
                        .set({ messages })
                        .where(eq(conversationTable.id, input.conversationId))
                },
                originalMessages: validatedMessages,
            }),
        )
    }),
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
