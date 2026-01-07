import { useChat } from '@ai-sdk/react'
import { FocusTrap, Textarea } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { type FormEventHandler, use, useEffect } from 'react'
import { useChatSubmit } from 'use-chat-submit'
import ChatContext from '../ChatProvider/ChatContext'

const PromptInput = () => {
    const chat = use(ChatContext)

    const { sendMessage } = useChat({ chat })

    const [input, setInput] = useInputState('')

    const { textareaRef, getTextareaProps } = useChatSubmit({
        mode: 'enter',
        onSubmit: (_value, { target }) => {
            target.form && target.form.requestSubmit()
        },
    })

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()

        setInput('')

        await sendMessage({ text: input })
    }

    useEffect(() => {
        if (
            chat.status === 'ready' &&
            chat.lastMessage &&
            chat.lastMessage.role === 'user'
        ) {
            chat.regenerate()
        }
    }, [chat])

    return (
        <form className="cursor-text" onSubmit={handleSubmit}>
            <FocusTrap innerRef={textareaRef}>
                <Textarea
                    autosize
                    maxRows={10}
                    onChange={setInput}
                    placeholder="Ask anything..."
                    rows={1}
                    size="md"
                    styles={{
                        input: {
                            '--input-padding-y': 'var(--mantine-spacing-xs)',
                        },
                    }}
                    value={input}
                    {...getTextareaProps()}
                />
            </FocusTrap>
        </form>
    )
}

export default PromptInput
