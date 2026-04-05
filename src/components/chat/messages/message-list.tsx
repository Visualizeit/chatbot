import { useChat } from '@ai-sdk/react'
import { Stack } from '@mantine/core'
import { invariant } from 'es-toolkit/util'
import { Fragment, use } from 'react'
import { match } from 'ts-pattern'

import ConversationContext from '../context/conversation-context'
import AssistantMessage from './assistant-message'
import UserMessage from './user-message'

const MessageList = () => {
    const chat = use(ConversationContext)

    invariant(chat, 'Conversation context is required')

    const { messages } = useChat({ chat })

    return (
        <Stack className="*:last:min-h-96">
            {messages.map((message) => (
                <Fragment key={message.id}>
                    {match(message)
                        .with({ role: 'user' }, () => <UserMessage message={message} />)
                        .with({ role: 'assistant' }, () => <AssistantMessage message={message} />)
                        .otherwise(() => null)}
                </Fragment>
            ))}
        </Stack>
    )
}

export default MessageList
