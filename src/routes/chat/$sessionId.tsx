import { Chat } from "@ai-sdk/react";
import { Container, Stack } from "@mantine/core";
import { eventIteratorToUnproxiedDataStream } from "@orpc/client";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import orpc from "@/apis/orpc";
import ChatMessageList from "@/components/chat/ChatMessageList/ChatMessageList";
import ChatScrollArea from "@/components/chat/ChatMessageList/ChatScrollArea";
import ChatContext from "@/components/chat/ChatProvider/ChatContext";
import PromptInput from "@/components/chat/PromptInput/PromptInput";

const Component = () => {
  const { messages } = Route.useLoaderData();

  const { sessionId } = Route.useParams();

  const chat = useMemo(
    () =>
      new Chat({
        messages,
        transport: {
          sendMessages: async (options) =>
            eventIteratorToUnproxiedDataStream(
              await orpc.chat.chat(
                {
                  sessionId,
                  messages: options.messages,
                },
                { signal: options.abortSignal },
              ),
            ),
          reconnectToStream: () => {
            throw new Error("Unsupported");
          },
        },
      }),
    [messages, sessionId],
  );

  return (
    <ChatContext value={chat}>
      <Stack className="size-full *:first:flex-1" gap={0}>
        <ChatScrollArea>
          <Container pb="xl" size="sm">
            <ChatMessageList />
          </Container>
        </ChatScrollArea>
        <Container className="w-full" size="sm">
          <PromptInput />
        </Container>
      </Stack>
    </ChatContext>
  );
};

export const Route = createFileRoute("/chat/$sessionId")({
  component: Component,
  ssr: false,
  loader: async ({ params }) => {
    const messages = await orpc.chat.getMessages({
      sessionId: params.sessionId,
    });

    return { messages };
  },
});
