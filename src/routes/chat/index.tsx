import { Container, Stack, Title } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'

import NewChatPromptInput from '@/components/chat/PromptInput/new-chat-prompt-input'

const Component = () => (
    <Container className="size-full" size="sm">
        <Stack className="size-full" gap="xl" justify="center">
            <Title ta="center">How can I help you today?</Title>
            <NewChatPromptInput />
        </Stack>
    </Container>
)

export const Route = createFileRoute('/chat/')({
    component: Component,
})
