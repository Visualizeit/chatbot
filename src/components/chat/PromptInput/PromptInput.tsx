import { useChat } from '@ai-sdk/react'
import { FocusTrap, Textarea } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { type FormEventHandler, useRef } from 'react'
import invariant from 'tiny-invariant'

const PromptInput = () => {
    const { sendMessage } = useChat()

    const [input, setInput] = useInputState('')

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()

        setInput('')

        await sendMessage({ text: input })
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
                    rows={1}
                    size="md"
                    value={input}
                />
            </FocusTrap>
        </form>
    )
}

export default PromptInput
