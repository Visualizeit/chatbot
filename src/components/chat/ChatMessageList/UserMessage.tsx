import { Group, Paper, Stack, Text } from "@mantine/core";
import { Fragment } from "react";
import { match } from "ts-pattern";

import type { ChatUIMessage } from "@/apis/ChatUIMessage";

interface UserMessageProps {
  message: ChatUIMessage;
}

const UserMessage = ({ message }: UserMessageProps) => (
  <Group align="start" className="max-w-4/5 self-end">
    <Paper className="min-w-0 flex-1 bg-(--mantine-color-brand-light)" px="md" py="xs">
      <Stack>
        {message.parts.map((part, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: order of parts is stable
          <Fragment key={index}>
            {match(part)
              .with({ type: "text" }, (_part) => (
                <Text className="wrap-break-word whitespace-pre-wrap">{_part.text}</Text>
              ))
              .otherwise(() => null)}
          </Fragment>
        ))}
      </Stack>
    </Paper>
  </Group>
);

export default UserMessage;
