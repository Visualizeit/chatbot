import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { os, streamToEventIterator, type } from '@orpc/server'
import { convertToModelMessages, streamText, validateUIMessages } from 'ai'
import { eq } from 'drizzle-orm'
import { isNil } from 'es-toolkit'

import db from '@/db/db'
import { conversationTable } from '@/db/schema'
import env from '@/env'

import type { ChatUIMessage } from '../chat-ui-message'

const languageModelProvider = createOpenAICompatible({
    apiKey: env.OPENAI_API_KEY,
    baseURL: env.OPENAI_BASE_URL,
    name: 'LanguageModel',
})

const model = languageModelProvider(env.OPENAI_MODEL_ID)

const getConversationTitle = (messages: ChatUIMessage[]) => {
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
    send: os
        .input(type<{ conversationId: string; messages: ChatUIMessage[] }>())
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
}

export default chatRouter
