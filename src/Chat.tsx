import React, { Component } from "react";
import { Launcher } from "react-chat-window";
import { Message } from "./roomClient";

interface MessageList {
  author: string;
  type: string;
  data: {
    text: string;
  };
}

interface ChatProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  user: string;
}

const transformChatMessages = (
  messages: Message[],
  user: string
): MessageList[] => {
  return messages.map((message) => {
    const meOrThem = message.sentBy === user ? "me" : "them";
    return {
      author: meOrThem,
      type: "text",
      data: {
        text: message.text,
      },
    };
  });
};

export function Chat({ messages, onSendMessage, user }: ChatProps) {
  return (
    <div>
      <Launcher
        agentProfile={{
          teamName: user,
          imageUrl:
            "https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png",
        }}
        onMessageWasSent={(message: MessageList) =>
          onSendMessage(message.data.text || "")
        }
        newMessagesCount={1}
        messageList={transformChatMessages(messages, user)}
        showEmoji={false}
      />
    </div>
  );
}
