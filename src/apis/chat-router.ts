import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { os, streamToEventIterator, type } from '@orpc/server'
import { convertToModelMessages, streamText, validateUIMessages } from 'ai'
import { eq } from 'drizzle-orm'
import { isNil } from 'es-toolkit'
import { z } from 'zod/v4'

import db from '@/db/db'
import { chatSessionTable } from '@/db/schema'
import env from '@/env'

import type { ChatUIMessage } from './chat-ui-message'

const languageModelProvider = createOpenAICompatible({
    apiKey: env.OPENAI_API_KEY,
    baseURL: env.OPENAI_BASE_URL,
    name: 'LanguageModel',
})

const model = languageModelProvider(env.OPENAI_MODEL_ID)

const getSessionTitle = (messages: ChatUIMessage[]) => {
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

const chatRouter = {
    create: os
        .input(type<{ sessionId: string; messages: ChatUIMessage[] }>())
        .handler(async ({ input }) => {
            const validatedMessages = await validateUIMessages({
                messages: input.messages,
            })

            const result = streamText({
                messages: await convertToModelMessages(validatedMessages),
                model,
            })

            return streamToEventIterator(
                result.toUIMessageStream({
                    onFinish: async ({ messages }) => {
                        const session = await db.query.chatSessionTable.findFirst({
                            where: eq(chatSessionTable.id, input.sessionId),
                        })

                        if (isNil(session)) {
                            await db.insert(chatSessionTable).values({
                                id: input.sessionId,
                                messages,
                                title: getSessionTitle(validatedMessages),
                            })

                            return
                        }

                        await db
                            .update(chatSessionTable)
                            .set({ messages })
                            .where(eq(chatSessionTable.id, input.sessionId))
                    },
                    originalMessages: validatedMessages,
                }),
            )
        }),
    find: os
        .input(
            z.object({
                sessionId: z.string(),
            }),
        )
        .handler(async ({ input }) => {
            const session = await db.query.chatSessionTable.findFirst({
                where: eq(chatSessionTable.id, input.sessionId),
            })

            return session ? session.messages : []
        }),
    list: os.handler(
        async () =>
            await db.query.chatSessionTable.findMany({
                columns: {
                    messages: false,
                },
            }),
    ),
    remove: os
        .input(
            z.object({
                sessionId: z.string(),
            }),
        )
        .handler(async ({ input }) => {
            await db
                .delete(chatSessionTable)
                .where(eq(chatSessionTable.id, input.sessionId))
                .returning()

            return { success: true }
        }),
}

export default chatRouter
