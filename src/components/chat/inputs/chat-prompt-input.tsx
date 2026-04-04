import { useChat } from '@ai-sdk/react'
import { FocusTrap, Textarea } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { invariant } from 'es-toolkit/util'
import { use } from 'react'
import { useChatSubmit } from 'use-chat-submit'

import ChatContext from '../context/chat-context'

const ChatPromptInput = () => {
    const chat = use(ChatContext)

    invariant(chat, 'Chat context is required')

    const { sendMessage } = useChat({ chat })

    const [input, setInput] = useInputState('')

    const { textareaRef, getTextareaProps } = useChatSubmit({
        mode: 'enter',
        onSubmit: async (value) => {
            setInput('')

            await sendMessage({ text: value })
        },
    })

    return (
        <div className="cursor-text">
            <FocusTrap innerRef={textareaRef}>
                <Textarea
                    autosize
                    {...getTextareaProps({
                        onChange: setInput,
                        value: input,
                    })}
                    maxRows={10}
                    placeholder="Ask anything..."
                    rows={1}
                    size="md"
                    styles={{
                        input: {
                            '--input-padding-y': 'var(--mantine-spacing-xs)',
                        },
                    }}
                />
            </FocusTrap>
        </div>
    )
}

export default ChatPromptInput
