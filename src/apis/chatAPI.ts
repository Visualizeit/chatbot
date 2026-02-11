import { createMCPClient, type MCPClient } from '@ai-sdk/mcp'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { os, streamToEventIterator, type } from '@orpc/server'
import { notFound } from '@tanstack/react-router'
import {
    convertToModelMessages,
    extractReasoningMiddleware,
    generateId,
    ToolLoopAgent,
    wrapLanguageModel,
} from 'ai'
import { eq } from 'drizzle-orm'
import { isNil, isNull } from 'es-toolkit'
import invariant from 'tiny-invariant'
import { z } from 'zod/v4'
import db from '@/db/db'
import { chatSessionTable } from '@/db/schema'
import type { ChatUIMessage } from './ChatUIMessage'

const nvidiaProvider = createOpenAICompatible({
    name: 'Nvidia',
    baseURL: 'https://integrate.api.nvidia.com/v1',
    apiKey: process.env.NVIDIA_AI_API_KEY,
})

const model = wrapLanguageModel({
    model: nvidiaProvider('minimaxai/minimax-m2.1'),
    middleware: extractReasoningMiddleware({ tagName: 'think' }),
})

let mcpClient: MCPClient | null = null

const getExaMCPClient = async () => {
    if (isNull(mcpClient)) {
        mcpClient = await createMCPClient({
            transport: {
                type: 'http',
                url: 'https://mcp.exa.ai/mcp',
            },
        })
    }

    return mcpClient
}

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
            const exaClient = await getExaMCPClient()

            const tools = await exaClient.tools()

            const agent = new ToolLoopAgent({
                model,
                tools,
            })

            const result = await agent.stream({
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
