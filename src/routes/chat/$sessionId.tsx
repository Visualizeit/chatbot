import { Chat } from '@ai-sdk/react'
import { Container, Stack } from '@mantine/core'
import { eventIteratorToUnproxiedDataStream } from '@orpc/client'
import { createFileRoute, useLoaderData, useParams } from '@tanstack/react-router'
import { useState } from 'react'

import orpc from '@/apis/orpc'
import ChatContext from '@/components/chat/context/chat-context'
import ChatPromptInput from '@/components/chat/inputs/chat-prompt-input'
import ChatMessageList from '@/components/chat/messages/chat-message-list'
import ChatScrollArea from '@/components/chat/messages/chat-scroll-area'

const Component = () => {
    const { messages } = useLoaderData({ from: '/chat/$sessionid' })

    const { sessionid: sessionId } = useParams({ from: '/chat/$sessionid' })

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
                            await orpc.chat.create(
                                {
                                    messages: options.messages,
                                    sessionId,
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

export const Route = createFileRoute('/chat/$sessionid')({
    component: Component,
    loader: async ({ params }) => {
        const messages = await orpc.chat.find({
            sessionId: params['sessionid'],
        })

        return { messages }
    },
    ssr: false,
})
