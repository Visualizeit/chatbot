import { Stack, Typography } from '@mantine/core'
import { Fragment } from 'react'
import { match } from 'ts-pattern'

import type { ChatUIMessage } from '@/apis/chat-ui-message'

import MemoizedMarkdown from './memoized-markdown'
import Reasoning from './reasoning'

export interface AssistantMessageProps {
    message: ChatUIMessage
}

const getMessagePartKey = (part: ChatUIMessage['parts'][number]) => JSON.stringify(part)

const AssistantMessage = ({ message }: AssistantMessageProps) => (
    <Stack>
        {message.parts.map((part) => (
            <Fragment key={getMessagePartKey(part)}>
                {match(part)
                    .with({ type: 'reasoning' }, (_part) => <Reasoning reasoning={_part.text} />)
                    .with({ type: 'text' }, (_part) => (
                        <Typography>
                            <MemoizedMarkdown content={_part.text} />
                        </Typography>
                    ))
                    .otherwise(() => null)}
            </Fragment>
        ))}
    </Stack>
)

export default AssistantMessage
