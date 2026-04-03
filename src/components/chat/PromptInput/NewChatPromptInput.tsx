import { FocusTrap, Textarea } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useNavigate } from "@tanstack/react-router";
import type { FormEventHandler } from "react";
import { useChatSubmit } from "use-chat-submit";

import orpc from "@/apis/orpc";

const NewChatPromptInput = () => {
  const [input, setInput] = useInputState("");

  const navigate = useNavigate();

  const { textareaRef, getTextareaProps } = useChatSubmit({
    mode: "enter",
    onSubmit: (_value, { target }) => {
      if (!target.form) {
        return;
      }

      target.form.requestSubmit();
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const session = await orpc.chat.createSession({ text: input });

    await navigate({
      to: "/chat/$sessionId",
      params: { sessionId: session.id },
    });
  };

  return (
    <form className="cursor-text" onSubmit={handleSubmit}>
      <FocusTrap innerRef={textareaRef}>
        <Textarea
          autosize
          maxRows={10}
          onChange={setInput}
          placeholder="Ask anything..."
          rows={1}
          size="md"
          styles={{
            input: {
              "--input-padding-y": "var(--mantine-spacing-xs)",
            },
          }}
          value={input}
          {...getTextareaProps()}
        />
      </FocusTrap>
    </form>
  );
};

export default NewChatPromptInput;
