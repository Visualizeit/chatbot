import { Box, ScrollArea } from '@mantine/core'
import type { PropsWithChildren } from 'react'
import { useStickToBottom } from 'use-stick-to-bottom'

const ConversationScrollArea = ({ children }: PropsWithChildren) => {
    const { scrollRef, contentRef } = useStickToBottom()

    return (
        <Box className="relative size-full">
            <ScrollArea.Autosize
                className="absolute size-full"
                classNames={{ content: 'min-w-full' }}
                viewportRef={scrollRef}
            >
                <Box ref={contentRef}>{children}</Box>
            </ScrollArea.Autosize>
        </Box>
    )
}

export default ConversationScrollArea
