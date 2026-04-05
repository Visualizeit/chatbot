import { Stack } from '@mantine/core'
import { Fragment } from 'react'
import { match } from 'ts-pattern'

import type { ConversationMessage } from '@/apis/conversation-message'

import ReasoningPart from './reasoning-part'
import TextPart from './text-part'

export interface AssistantMessageProps {
    message: ConversationMessage
}

const getMessagePartKey = (part: ConversationMessage['parts'][number]) => JSON.stringify(part)

const AssistantMessage = ({ message }: AssistantMessageProps) => (
    <Stack>
        {message.parts.map((part) => (
            <Fragment key={getMessagePartKey(part)}>
                {match(part)
                    .with({ type: 'reasoning' }, (_part) => <ReasoningPart part={_part} />)
                    .with({ type: 'text' }, (_part) => <TextPart part={_part} />)
                    .otherwise(() => null)}
            </Fragment>
        ))}
    </Stack>
)

export default AssistantMessage
