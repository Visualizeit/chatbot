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
} from "@mantine/core";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react";
import { createFileRoute, Link, Outlet, useRouter } from "@tanstack/react-router";

import orpc from "@/apis/orpc";

const Component = () => {
  const { sessions } = Route.useLoaderData();

  const router = useRouter();

  return (
    <AppShell
      navbar={{
        width: 256,
        breakpoint: 0,
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
            <Group className="group relative" key={session.id}>
              <NavLink
                activeProps={{ "aria-current": "page" }}
                className="rounded-(--mantine-radius-default)"
                component={Link}
                label={session.title}
                to={
                  router.buildLocation({
                    to: "/chat/$sessionId",
                    params: { sessionId: session.id },
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
                    onClick={async () => {
                      await orpc.chat.deleteSession({
                        sessionId: session.id,
                      });

                      await router.navigate({
                        to: "/chat",
                        replace: true,
                      });
                    }}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          ))}
        </AppShellSection>
      </AppShell.Navbar>
      <AppShell.Main className="flex">
        <Box className="w-full">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};

export const Route = createFileRoute("/chat")({
  component: Component,
  loader: async () => {
    const sessions = await orpc.chat.getSessions();

    return { sessions };
  },
});
