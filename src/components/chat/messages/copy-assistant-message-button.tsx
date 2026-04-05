import { ActionIcon, CopyButton, Tooltip } from '@mantine/core'
import { CheckIcon, CopyIcon } from 'lucide-react'

import type { ConversationMessage } from '@/apis/conversation-message'

interface CopyAssistantMessageButtonProps {
    message: ConversationMessage
}

const CopyAssistantMessageButton = ({ message }: CopyAssistantMessageButtonProps) => {
    let messageText = ''

    for (const part of message.parts) {
        if (part.type === 'text') {
            messageText += part.text
        }
    }

    return (
        <CopyButton value={messageText}>
            {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : 'Copy'}>
                    <ActionIcon
                        aria-label={copied ? 'Copied message' : 'Copy message'}
                        color="gray"
                        disabled={messageText.length === 0}
                        onClick={copy}
                        type="button"
                        variant="subtle"
                    >
                        {copied ? (
                            <CheckIcon className="size-4" />
                        ) : (
                            <CopyIcon className="size-4" />
                        )}
                    </ActionIcon>
                </Tooltip>
            )}
        </CopyButton>
    )
}

export default CopyAssistantMessageButton
