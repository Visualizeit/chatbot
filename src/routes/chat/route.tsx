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
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react'
import { createFileRoute, Link, Outlet, useLoaderData, useRouter } from '@tanstack/react-router'
import { useCallback } from 'react'

import orpc from '@/apis/orpc'

interface SessionListItemProps {
    sessionId: string
    title: string
}

const SessionListItem = ({ sessionId, title }: SessionListItemProps) => {
    const router = useRouter()

    const handleDelete = useCallback(async () => {
        await orpc.chat.deleteSession({
            sessionId,
        })

        await router.navigate({
            replace: true,
            to: '/chat',
        })
    }, [router, sessionId])

    return (
        <Group className="group relative" key={sessionId}>
            <NavLink
                activeProps={{ 'aria-current': 'page' }}
                className="rounded-(--mantine-radius-default)"
                component={Link}
                label={title}
                to={
                    router.buildLocation({
                        params: { sessionid: sessionId },
                        to: '/chat/$sessionid',
                    }).pathname
                }
            />
            <Menu>
                <Menu.Target>
                    <ActionIcon
                        className="invisible absolute right-3 group-hover:visible"
                        variant="subtle"
                    >
                        <IconDots />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item
                        color="red"
                        leftSection={<IconTrash className="size-5" />}
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
    const { sessions } = useLoaderData({ from: '/chat' })

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
                        component={Link}
                        fullWidth
                        leftSection={<IconEdit className="size-5" />}
                        to="/chat/"
                        variant="default"
                    >
                        New Chat
                    </Button>
                </AppShellSection>
                <AppShellSection component={ScrollArea} grow>
                    {sessions.map((session) => (
                        <SessionListItem
                            key={session.id}
                            sessionId={session.id}
                            title={session.title}
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

export const Route = createFileRoute('/chat')({
    component: Component,
    loader: async () => {
        const sessions = await orpc.chat.getSessions()

        return { sessions }
    },
})
