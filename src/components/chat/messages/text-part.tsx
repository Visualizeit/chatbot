import { Typography } from '@mantine/core'
import type { TextUIPart } from 'ai'

import MemoizedMarkdown from '../shared/memoized-markdown'

interface TextPartProps {
    part: TextUIPart
}

const TextPart = ({ part }: TextPartProps) => (
    <Typography>
        <MemoizedMarkdown content={part.text} />
    </Typography>
)

export default TextPart
