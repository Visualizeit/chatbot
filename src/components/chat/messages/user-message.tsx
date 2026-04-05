import { Group, Paper, Stack } from '@mantine/core'
import { Fragment } from 'react'
import { match } from 'ts-pattern'

import type { ConversationMessage } from '@/apis/conversation-message'

import TextPart from './text-part'

interface UserMessageProps {
    message: ConversationMessage
}

const UserMessage = ({ message }: UserMessageProps) => (
    <Group align="start" className="max-w-4/5 self-end">
        <Paper className="min-w-0 flex-1 bg-(--mantine-color-brand-light)" px="md" py="xs">
            <Stack>
                {message.parts.map((part, index) => (
                    // oxlint-disable-next-line react/no-array-index-key
                    <Fragment key={`${message.id}:${part.type}:${index}`}>
                        {match(part)
                            .with({ type: 'text' }, (_part) => <TextPart part={_part} />)
                            .otherwise(() => null)}
                    </Fragment>
                ))}
            </Stack>
        </Paper>
    </Group>
)

export default UserMessage
