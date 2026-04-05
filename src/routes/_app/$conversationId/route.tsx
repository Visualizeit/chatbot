import { Chat } from '@ai-sdk/react'
import { Container, Stack } from '@mantine/core'
import { eventIteratorToUnproxiedDataStream } from '@orpc/client'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { useState } from 'react'

import orpc from '@/apis/orpc'
import ConversationContext from '@/components/chat/context/conversation-context'
import PromptInput from '@/components/chat/inputs/prompt-input'
import ConversationScrollArea from '@/components/chat/messages/conversation-scroll-area'
import MessageList from '@/components/chat/messages/message-list'

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
    )

    return (
        <ConversationContext value={chat}>
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
        </ConversationContext>
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
