import { Group, Paper, Stack, Text } from '@mantine/core'
import { Fragment } from 'react'
import { match } from 'ts-pattern'

import type { ChatUIMessage } from '@/apis/chat-ui-message'

interface UserMessageProps {
    message: ChatUIMessage
}

const getMessagePartKey = (part: ChatUIMessage['parts'][number]) => JSON.stringify(part)

const UserMessage = ({ message }: UserMessageProps) => (
    <Group align="start" className="max-w-4/5 self-end">
        <Paper className="min-w-0 flex-1 bg-(--mantine-color-brand-light)" px="md" py="xs">
            <Stack>
                {message.parts.map((part) => (
                    <Fragment key={getMessagePartKey(part)}>
                        {match(part)
                            .with({ type: 'text' }, (_part) => (
                                <Text className="wrap-break-word whitespace-pre-wrap">
                                    {_part.text}
                                </Text>
                            ))
                            .otherwise(() => null)}
                    </Fragment>
                ))}
            </Stack>
        </Paper>
    </Group>
)

export default UserMessage
