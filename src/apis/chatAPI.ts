import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { os, streamToEventIterator, type } from '@orpc/server'
import { notFound } from '@tanstack/react-router'
import { convertToModelMessages, generateId, streamText } from 'ai'
import { eq } from 'drizzle-orm'
import { isNil } from 'es-toolkit'
import invariant from 'tiny-invariant'
import { z } from 'zod/v4'
import db from '@/db/db'
import { chatSessionTable } from '@/db/schema'
import type { ChatUIMessage } from './ChatUIMessage'

const zenProvider = createOpenAICompatible({
    baseURL: 'https://opencode.ai/zen/v1',
    name: 'Zen',
})

const chatAPI = {
    getMessages: os
        .input(
            z.object({
                sessionId: z.string(),
            })
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
            })
    ),
    deleteSession: os
        .input(
            z.object({
                sessionId: z.string(),
            })
        )
        .handler(async ({ input }) => {
            await db
                .delete(chatSessionTable)
                .where(eq(chatSessionTable.id, input.sessionId))
                .returning()

            return { success: true }
        }),
    createSession: os
        .input(z.object({ text: z.string() }))
        .handler(async ({ input }) => {
            const [session] = await db
                .insert(chatSessionTable)
                .values({
                    title: input.text.slice(0, 52),
                    messages: [
                        {
                            id: generateId(),
                            role: 'user',
                            parts: [
                                {
                                    type: 'text',
                                    text: input.text,
                                },
                            ],
                        },
                    ],
                })
                .returning()

            invariant(session, 'Failed to create session')

            return session
        }),
    chat: os
        .input(type<{ sessionId: string; messages: ChatUIMessage[] }>())
        .handler(async ({ input }) => {
            const result = streamText({
                model: zenProvider('big-pickle'),
                messages: await convertToModelMessages(input.messages),
            })

            return streamToEventIterator(
                result.toUIMessageStream({
                    originalMessages: input.messages,
                    onFinish: async ({ messages }) => {
                        await db
                            .update(chatSessionTable)
                            .set({ messages })
                            .where(eq(chatSessionTable.id, input.sessionId))
                    },
                })
            )
        }),
}

export default chatAPI
