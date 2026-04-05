import { Chat } from '@ai-sdk/react'
import { Container, Stack } from '@mantine/core'
import { eventIteratorToUnproxiedDataStream } from '@orpc/client'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { useMemo } from 'react'

import orpc from '@/apis/orpc'
import ChatContext from '@/components/chat/context/chat-context'
import PromptInput from '@/components/chat/inputs/prompt-input'
import ConversationScrollArea from '@/components/chat/messages/conversation-scroll-area'
import MessageList from '@/components/chat/messages/message-list'

const conversationRouteApi = getRouteApi('/_app/$conversationId')

const Component = () => {
    const { messages } = conversationRouteApi.useLoaderData()

    const { conversationId } = conversationRouteApi.useParams()

    const chat = useMemo(
        () =>
            new Chat({
                id: conversationId,
                messages,
                transport: {
                    reconnectToStream: () => {
                        throw new Error('Unsupported')
                    },
                    sendMessages: async (options) =>
                        eventIteratorToUnproxiedDataStream(
                            await orpc.conversation.send(
                                {
                                    conversationId,
                                    messages: options.messages,
                                },
                                { signal: options.abortSignal },
                            ),
                        ),
                },
            }),
        [conversationId, messages],
    )

    return (
        <ChatContext.Provider value={chat}>
            <Stack className="size-full *:first:flex-1" gap={0}>
                <ConversationScrollArea>
                    <Container pb="xl" size="sm">
                        <MessageList />
                    </Container>
                </ConversationScrollArea>
                <Container className="w-full" size="sm">
                    <PromptInput />
                </Container>
            </Stack>
        </ChatContext.Provider>
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
