import { useChat } from '@ai-sdk/react'
import { ActionIcon, Tooltip } from '@mantine/core'
import { invariant } from 'es-toolkit/util'
import { ArrowUpIcon, SquareIcon } from 'lucide-react'
import { use } from 'react'

import ConversationContext from '../context/conversation-context'

interface PromptInputSubmitProps {
    disabled: boolean
}

const PromptInputSubmit = ({ disabled }: PromptInputSubmitProps) => {
    const chat = use(ConversationContext)

    invariant(chat, 'Conversation context is required')

    const { status } = useChat({ chat })

    if (status === 'submitted' || status === 'streaming') {
        return (
            <Tooltip label="Stop">
                <ActionIcon
                    aria-label="Stop message"
                    onClick={() => {
                        chat.stop()
                    }}
                    radius="xl"
                    size="lg"
                    type="button"
                    variant="light"
                >
                    <SquareIcon className="size-4" />
                </ActionIcon>
            </Tooltip>
        )
    }

    return (
        <Tooltip label={disabled ? 'Enter a message' : 'Send'}>
            <ActionIcon
                aria-label="Send message"
                disabled={disabled}
                radius="xl"
                size="lg"
                type="submit"
            >
                <ArrowUpIcon className="size-4" />
            </ActionIcon>
        </Tooltip>
    )
}

export default PromptInputSubmit
