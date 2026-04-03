import { Textarea } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { useNavigate } from '@tanstack/react-router'
import { useChatSubmit } from 'use-chat-submit'

import orpc from '@/apis/orpc'

const NewChatPromptInput = () => {
    const [input, setInput] = useInputState('')

    const navigate = useNavigate()

    const { getTextareaProps } = useChatSubmit({
        mode: 'enter',
        onSubmit: async (value) => {
            const session = await orpc.chat.createSession({ text: value })

            setInput('')

            await navigate({
                params: { sessionid: session.id },
                to: '/chat/$sessionid',
            })
        },
    })

    return (
        <Textarea
            autoFocus
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
    )
}

export default NewChatPromptInput
