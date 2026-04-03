import { Stack, Typography } from "@mantine/core";
import { Fragment } from "react";
import { match } from "ts-pattern";

import type { ChatUIMessage } from "@/apis/ChatUIMessage";

import MemoizedMarkdown from "./MemoizedMarkdown";
import Reasoning from "./Reasoning";

export interface AssistantMessageProps {
  message: ChatUIMessage;
}

const AssistantMessage = ({ message }: AssistantMessageProps) => (
  <Stack>
    {message.parts.map((part, index) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: order of parts is stable
      <Fragment key={index}>
        {match(part)
          .with({ type: "reasoning" }, (_part) => <Reasoning reasoning={_part.text} />)
          .with({ type: "text" }, (_part) => (
            <Typography>
              <MemoizedMarkdown content={_part.text} />
            </Typography>
          ))
          .otherwise(() => null)}
      </Fragment>
    ))}
  </Stack>
);

export default AssistantMessage;
