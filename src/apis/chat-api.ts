import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { os, streamToEventIterator, type } from '@orpc/server'
import { notFound } from '@tanstack/react-router'
import { convertToModelMessages, generateId, streamText } from 'ai'
import { eq } from 'drizzle-orm'
import { isNil } from 'es-toolkit'
import { invariant } from 'es-toolkit/util'
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

const chatAPI = {
    chat: os
        .input(type<{ sessionId: string; messages: ChatUIMessage[] }>())
        .handler(async ({ input }) => {
            const result = streamText({
                messages: await convertToModelMessages(input.messages),
                model,
            })

            return streamToEventIterator(
                result.toUIMessageStream({
                    onFinish: async ({ messages }) => {
                        await db
                            .update(chatSessionTable)
                            .set({ messages })
                            .where(eq(chatSessionTable.id, input.sessionId))
                    },
                    originalMessages: input.messages,
                }),
            )
        }),
    createSession: os.input(z.object({ text: z.string() })).handler(async ({ input }) => {
        const [session] = await db
            .insert(chatSessionTable)
            .values({
                messages: [
                    {
                        id: generateId(),
                        parts: [
                            {
                                text: input.text,
                                type: 'text',
                            },
                        ],
                        role: 'user',
                    },
                ],
                title: input.text.slice(0, 52),
            })
            .returning()

        invariant(session, 'Failed to create session')

        return session
    }),
    deleteSession: os
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
    getMessages: os
        .input(
            z.object({
                sessionId: z.string(),
            }),
        )
        .handler(async ({ input }) => {
            const session = await db.query.chatSessionTable.findFirst({
                where: eq(chatSessionTable.id, input.sessionId),
            })

            if (isNil(session)) {
                throw notFound()
            }

            return session.messages
        }),
    getSessions: os.handler(
        async () =>
            await db.query.chatSessionTable.findMany({
                columns: {
                    messages: false,
                },
            }),
    ),
}

export default chatAPI
