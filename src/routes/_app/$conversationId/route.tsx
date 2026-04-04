import { Chat } from '@ai-sdk/react'
import { Container, Stack } from '@mantine/core'
import { eventIteratorToUnproxiedDataStream } from '@orpc/client'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { useState } from 'react'

import orpc from '@/apis/orpc'
import ChatContext from '@/components/chat/context/chat-context'
import ChatPromptInput from '@/components/chat/inputs/chat-prompt-input'
import ChatMessageList from '@/components/chat/messages/chat-message-list'
import ChatScrollArea from '@/components/chat/messages/chat-scroll-area'

const conversationRouteApi = getRouteApi('/_app/$conversationId')

const Component = () => {
    const { messages } = conversationRouteApi.useLoaderData()

    const { conversationId } = conversationRouteApi.useParams()

    const [chat] = useState(
        () =>
            new Chat({
                messages,
                transport: {
                    reconnectToStream: () => {
                        throw new Error('Unsupported')
                    },
                    sendMessages: async (options) =>
                        eventIteratorToUnproxiedDataStream(
                            await orpc.chat.send(
                                {
                                    conversationId,
                                    messages: options.messages,
                                },
                                { signal: options.abortSignal },
                            ),
                        ),
                },
            }),
    )

    return (
        <ChatContext value={chat}>
            <Stack className="size-full *:first:flex-1" gap={0}>
                <ChatScrollArea>
                    <Container pb="xl" size="sm">
                        <ChatMessageList />
                    </Container>
                </ChatScrollArea>
                <Container className="w-full" size="sm">
                    <ChatPromptInput />
                </Container>
            </Stack>
        </ChatContext>
    )
}

export const Route = createFileRoute('/_app/$conversationId')({
    component: Component,
    loader: async ({ params }) => {
        const messages = await orpc.conversation.findById({
            conversationId: params.conversationId,
        })

        return { messages }
    },
})
