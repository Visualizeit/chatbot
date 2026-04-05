import { useChat } from '@ai-sdk/react'
import { FocusTrap, Group, Space, Textarea } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { useRouter } from '@tanstack/react-router'
import { invariant } from 'es-toolkit/util'
import { use } from 'react'
import type { SubmitEventHandler } from 'react'
import { useChatSubmit } from 'use-chat-submit'
import * as z from 'zod/v4'

import ConversationContext from '../context/conversation-context'
import PromptInputSubmit from './prompt-input-submit'

import classes from './prompt-input.module.css'

const PromptInput = () => {
    const chat = use(ConversationContext)

    const promptInputId = 'prompt-input'

    invariant(chat, 'Conversation context is required')

    const { sendMessage } = useChat({ chat })

    const [input, setInput] = useInputState('')

    const router = useRouter()

    const isSubmitDisabled = !z.string().trim().min(1).safeParse(input).success

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()

        setInput('')

        await sendMessage({ text: input })

        await router.invalidate({ sync: true })
    }

    const { textareaRef, getTextareaProps } = useChatSubmit({
        allowEmptySubmit: false,
        mode: 'enter',
        onSubmit: (_value, { target }) => {
            if (target.form) {
                target.form.requestSubmit()
            }
        },
    })

    return (
        <form className={classes.container} onSubmit={handleSubmit}>
            <label htmlFor={promptInputId}>
                <FocusTrap innerRef={textareaRef}>
                    <Textarea
                        autosize
                        classNames={{
                            input: classes.input,
                            wrapper: classes.wrapper,
                        }}
                        {...getTextareaProps({
                            onChange: setInput,
                            value: input,
                        })}
                        id={promptInputId}
                        maxRows={10}
                        placeholder="Ask anything..."
                        rows={1}
                        size="md"
                    />
                </FocusTrap>
            </label>
            <Group justify="space-between">
                <Space />
                <PromptInputSubmit disabled={isSubmitDisabled} />
            </Group>
        </form>
    )
}

export default PromptInput
