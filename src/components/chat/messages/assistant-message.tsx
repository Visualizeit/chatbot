import { Group, Stack } from '@mantine/core'
import { Fragment } from 'react'
import { match } from 'ts-pattern'

import type { ConversationMessage } from '@/apis/conversation-message'

import CopyAssistantMessageButton from './copy-assistant-message-button'
import ReasoningPart from './reasoning-part'
import RetryAssistantMessageButton from './retry-assistant-message-button'
import TextPart from './text-part'

export interface AssistantMessageProps {
    message: ConversationMessage
}

const AssistantMessage = ({ message }: AssistantMessageProps) => {
    return (
        <Stack gap="xs">
            <Stack>
                {message.parts.map((part, index) => (
                    // oxlint-disable-next-line react/no-array-index-key
                    <Fragment key={`${message.id}:${part.type}:${index}`}>
                        {match(part)
                            .with({ type: 'reasoning' }, (_part) => <ReasoningPart part={_part} />)
                            .with({ type: 'text' }, (_part) => <TextPart part={_part} />)
                            .otherwise(() => null)}
                    </Fragment>
                ))}
            </Stack>
            <Group gap="xs">
                <CopyAssistantMessageButton message={message} />
                <RetryAssistantMessageButton message={message} />
            </Group>
        </Stack>
    )
}

export default AssistantMessage
