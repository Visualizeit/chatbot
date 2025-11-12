import { FocusTrap, Textarea } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { useNavigate } from '@tanstack/react-router'
import { type FormEventHandler, useRef } from 'react'
import invariant from 'tiny-invariant'
import orpc from '@/apis/orpc'

const NewChatPromptInput = () => {
    const [input, setInput] = useInputState('')

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const navigate = useNavigate()

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()

        const session = await orpc.chat.createSession({ text: input })

        await navigate({
            to: '/chat/$sessionId',
            params: { sessionId: session.id },
        })
    }

    return (
        <form className="cursor-text" onSubmit={handleSubmit}>
            <FocusTrap innerRef={textareaRef}>
                <Textarea
                    autosize
                    maxRows={10}
                    onChange={setInput}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            if (
                                event.nativeEvent.isComposing ||
                                event.shiftKey
                            ) {
                                return
                            }

                            event.preventDefault()

                            const form = event.currentTarget.form

                            invariant(form, 'Form is null')

                            form.requestSubmit()
                        }
                    }}
                    placeholder="Ask anything..."
                    rows={1}
                    size="md"
                    styles={{
                        input: {
                            '--input-padding-y': 'var(--mantine-spacing-xs)',
                        },
                    }}
                    value={input}
                />
            </FocusTrap>
        </form>
    )
}

export default NewChatPromptInput
