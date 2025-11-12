import { useChat } from '@ai-sdk/react'
import { Stack } from '@mantine/core'
import { Fragment, use } from 'react'
import { match } from 'ts-pattern'
import ChatContext from '../ChatProvider/ChatContext'
import AssistantMessage from './AssistantMessage'
import UserMessage from './UserMessage'

const ChatMessageList = () => {
    const { messages } = useChat({ chat: use(ChatContext) })

    return (
        <Stack className="*:last:min-h-96">
            {messages.map((message) => (
                <Fragment key={message.id}>
                    {match(message)
                        .with({ role: 'user' }, () => (
                            <UserMessage message={message} />
                        ))
                        .with({ role: 'assistant' }, () => (
                            <AssistantMessage message={message} />
                        ))
                        .otherwise(() => null)}
                </Fragment>
            ))}
        </Stack>
    )
}

export default ChatMessageList
