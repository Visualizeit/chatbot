import { useChat } from '@ai-sdk/react'
import { ActionIcon, Tooltip } from '@mantine/core'
import { invariant } from 'es-toolkit/util'
import { RotateCcwIcon } from 'lucide-react'
import { use } from 'react'

import type { ConversationMessage } from '@/apis/conversation-message'

import ChatContext from '../context/chat-context'

interface RetryAssistantMessageButtonProps {
    message: ConversationMessage
}

const RetryAssistantMessageButton = ({ message }: RetryAssistantMessageButtonProps) => {
    const chat = use(ChatContext)

    invariant(chat, 'ChatContext is required')

    const { status } = useChat({ chat })

    const disabled = status === 'submitted' || status === 'streaming'

    return (
        <Tooltip label="Retry">
            <ActionIcon
                aria-label="Retry message"
                color="gray"
                disabled={disabled}
                onClick={() => {
                    void chat.regenerate({ messageId: message.id })
                }}
                type="button"
                variant="subtle"
            >
                <RotateCcwIcon className="size-4" />
            </ActionIcon>
        </Tooltip>
    )
}

export default RetryAssistantMessageButton
