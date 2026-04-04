import {
    ActionIcon,
    AppShell,
    AppShellSection,
    Box,
    Button,
    Group,
    Menu,
    NavLink,
    ScrollArea,
} from '@mantine/core'
import { createFileRoute, Link, Outlet, useLoaderData, useRouter } from '@tanstack/react-router'
import { EllipsisIcon, SquarePenIcon, Trash2Icon } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useCallback } from 'react'

import orpc from '@/apis/orpc'

interface ConversationListItemProps {
    conversationId: string
    title: string
}

const ConversationListItem = ({ conversationId, title }: ConversationListItemProps) => {
    const router = useRouter()

    const handleDelete = useCallback(async () => {
        await orpc.conversation.remove({
            conversationId,
        })

        await router.navigate({
            replace: true,
            to: '/',
        })
    }, [conversationId, router])

    return (
        <Group className="group relative" key={conversationId}>
            <NavLink
                activeProps={{ 'aria-current': 'page' }}
                className="rounded-(--mantine-radius-default)"
                component={Link}
                label={title}
                to={
                    router.buildLocation({
                        params: { conversationId },
                        to: '/$conversationId',
                    }).pathname
                }
            />
            <Menu>
                <Menu.Target>
                    <ActionIcon
                        className="invisible absolute right-3 group-hover:visible"
                        variant="subtle"
                    >
                        <EllipsisIcon />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item
                        color="red"
                        leftSection={<Trash2Icon className="size-4" />}
                        onClick={handleDelete}
                    >
                        Delete
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Group>
    )
}

const Component = () => {
    const { conversations } = useLoaderData({ from: '/_app' })

    const router = useRouter()

    const handleNewConversation = useCallback(() => {
        void router.navigate({
            params: { conversationId: nanoid() },
            to: '/$conversationId',
        })
    }, [router])

    return (
        <AppShell
            navbar={{
                breakpoint: 0,
                width: 256,
            }}
            padding="md"
        >
            <AppShell.Navbar className="gap-(--mantine-spacing-md)" p="xs">
                <AppShellSection>
                    <Button
                        fullWidth
                        leftSection={<SquarePenIcon className="size-4" />}
                        onClick={handleNewConversation}
                        variant="default"
                    >
                        New Chat
                    </Button>
                </AppShellSection>
                <AppShellSection component={ScrollArea} grow>
                    {conversations.map((conversation) => (
                        <ConversationListItem
                            key={conversation.id}
                            conversationId={conversation.id}
                            title={conversation.title}
                        />
                    ))}
                </AppShellSection>
            </AppShell.Navbar>
            <AppShell.Main className="flex">
                <Box className="w-full">
                    <Outlet />
                </Box>
            </AppShell.Main>
        </AppShell>
    )
}

export const Route = createFileRoute('/_app')({
    component: Component,
    loader: async () => {
        const conversations = await orpc.conversation.list()

        return { conversations }
    },
})
