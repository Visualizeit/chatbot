import { marked } from 'marked'
import { memo, useMemo } from 'react'
import Markdown, { type Options } from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'

interface MemoizedMarkdownProps {
    content: string
}

const rehypePlugins: Options['rehypePlugins'] = [
    [rehypeExternalLinks, { target: '_blank', rel: 'noopener noreferrer' }],
    remarkGfm,
]

const MemoizedMarkdownBlock = memo(({ content }: MemoizedMarkdownProps) => (
    <Markdown rehypePlugins={rehypePlugins}>{content}</Markdown>
))

const MemoizedMarkdown = memo(({ content }: MemoizedMarkdownProps) => {
    const tokens = useMemo(() => marked.lexer(content), [content])

    return (
        <>
            {tokens.map((token, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: marked tokens lack stable IDs; index used as fallback
                <MemoizedMarkdownBlock content={token.raw} key={index} />
            ))}
        </>
    )
})

export default MemoizedMarkdown
