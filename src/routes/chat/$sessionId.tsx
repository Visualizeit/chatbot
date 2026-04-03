import { Chat } from '@ai-sdk/react'
import { Container, Stack } from '@mantine/core'
import { eventIteratorToUnproxiedDataStream } from '@orpc/client'
import { createFileRoute, useLoaderData, useParams } from '@tanstack/react-router'
import { useState } from 'react'

import orpc from '@/apis/orpc'
import ChatMessageList from '@/components/chat/ChatMessageList/chat-message-list'
import ChatScrollArea from '@/components/chat/ChatMessageList/chat-scroll-area'
import ChatContext from '@/components/chat/ChatProvider/chat-context'
import PromptInput from '@/components/chat/PromptInput/prompt-input'

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
                            await orpc.chat.chat(
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
                    <PromptInput />
                </Container>
            </Stack>
        </ChatContext>
    )
}

export const Route = createFileRoute('/chat/$sessionid')({
    component: Component,
    loader: async ({ params }) => {
        const messages = await orpc.chat.getMessages({
            sessionId: params['sessionid'],
        })

        return { messages }
    },
    ssr: false,
})
