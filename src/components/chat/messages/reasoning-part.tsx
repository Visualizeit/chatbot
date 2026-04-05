import { Button, Collapse, Stack, Typography } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import type { ReasoningUIPart } from 'ai'
import { invariant } from 'es-toolkit'
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react'
import { use } from 'react'

import ChatContext from '../context/chat-context'
import MemoizedMarkdown from '../shared/memoized-markdown'

interface ReasoningPartProps {
    part: ReasoningUIPart
}

const ReasoningPart = ({ part }: ReasoningPartProps) => {
    const chat = use(ChatContext)

    invariant(chat, 'ChatContext is required')

    const [isOpened, { toggle }] = useDisclosure(
        chat.status === 'submitted' || chat.status === 'streaming',
    )

    return (
        <Stack align="start" gap="xs">
            <Button
                className="border-none"
                onClick={toggle}
                rightSection={
                    isOpened ? (
                        <ChevronDownIcon className="size-4" />
                    ) : (
                        <ChevronRightIcon className="size-4" />
                    )
                }
                size="compact-sm"
                variant="default"
            >
                Thinking
            </Button>
            <Collapse className="max-w-full" expanded={isOpened}>
                <Typography c="dimmed">
                    <MemoizedMarkdown content={part.text} />
                </Typography>
            </Collapse>
        </Stack>
    )
}

export default ReasoningPart
