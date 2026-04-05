import { marked } from 'marked'
import Markdown from 'react-markdown'
import type { Options } from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
import remend from 'remend'

interface MemoizedMarkdownProps {
    content: string
}

const rehypePlugins: Options['rehypePlugins'] = [
    [rehypeExternalLinks, { rel: 'noopener noreferrer', target: '_blank' }],
    remarkGfm,
]

const MemoizedMarkdownBlock = ({ content }: MemoizedMarkdownProps) => (
    <Markdown rehypePlugins={rehypePlugins}>{content}</Markdown>
)

const MemoizedMarkdown = ({ content }: MemoizedMarkdownProps) => {
    const tokens = marked.lexer(remend(content))

    return (
        <>
            {tokens.map((token, index) => (
                // oxlint-disable-next-line react/no-array-index-key
                <MemoizedMarkdownBlock content={token.raw} key={`${token.type}:${index}`} />
            ))}
        </>
    )
}

export default MemoizedMarkdown
