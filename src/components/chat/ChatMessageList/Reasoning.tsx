import { Button, Collapse, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react'

import MemoizedMarkdown from './memoized-markdown'

interface ReasoningProps {
    reasoning: string
}

const Reasoning = ({ reasoning }: ReasoningProps) => {
    const [isOpened, { toggle }] = useDisclosure(true)

    return (
        <Stack align="start" gap="xs">
            <Button
                color={isOpened ? undefined : 'gray'}
                onClick={toggle}
                rightSection={
                    isOpened ? (
                        <IconChevronDown className="size-5" />
                    ) : (
                        <IconChevronRight className="size-5" />
                    )
                }
                size="compact-sm"
                variant="subtle"
            >
                Thought process
            </Button>
            <Collapse className="max-w-full" in={isOpened}>
                <Stack c="gray" className="wrap-break-word min-w-0 flex-1">
                    <MemoizedMarkdown content={reasoning} />
                </Stack>
            </Collapse>
        </Stack>
    )
}

export default Reasoning
