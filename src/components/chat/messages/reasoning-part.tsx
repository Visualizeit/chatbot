import { Button, Collapse, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import type { ReasoningUIPart } from 'ai'
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react'

import MemoizedMarkdown from '../shared/memoized-markdown'

interface ReasoningPartProps {
    part: ReasoningUIPart
}

const ReasoningPart = ({ part }: ReasoningPartProps) => {
    const [isOpened, { toggle }] = useDisclosure(true)

    return (
        <Stack align="start" gap="xs">
            <Button
                color={isOpened ? undefined : 'gray'}
                onClick={toggle}
                rightSection={
                    isOpened ? (
                        <ChevronDownIcon className="size-4" />
                    ) : (
                        <ChevronRightIcon className="size-4" />
                    )
                }
                size="compact-sm"
                variant="subtle"
            >
                Thought process
            </Button>
            <Collapse className="max-w-full" expanded={isOpened}>
                <Stack c="gray" className="wrap-break-word min-w-0 flex-1">
                    <MemoizedMarkdown content={part.text} />
                </Stack>
            </Collapse>
        </Stack>
    )
}

export default ReasoningPart
