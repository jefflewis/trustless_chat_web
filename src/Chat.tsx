import React, { useState, useEffect } from "react";
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

const getWhoYouAreChattingWith = (messages: Message[]): string => {
  return messages[0].sentBy || "";
};

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
  const [isOpen, setIsOpen] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [chattingWith, setChattingWith] = useState("");

  useEffect(() => {
    if (!isOpen && messages.length !== 0) {
      setNewMessagesCount(newMessagesCount + 1);
    }
    if (messages.length > 0) {
      setChattingWith(getWhoYouAreChattingWith(messages));
    }
  }, [messages.length]);

  const onClick = () => {
    setIsOpen(!isOpen);
    setNewMessagesCount(0);
  };
  return (
    <div>
      <Launcher
        agentProfile={{
          teamName: chattingWith,
        }}
        onMessageWasSent={(message: MessageList) => {
          const updatedMessageCount = isOpen
            ? newMessagesCount
            : newMessagesCount + 1;
          setNewMessagesCount(updatedMessageCount);
          onSendMessage(message.data.text || "");
        }}
        newMessagesCount={newMessagesCount}
        handleClick={onClick}
        isOpen={isOpen}
        messageList={transformChatMessages(messages, user)}
        showEmoji={false}
      />
    </div>
  );
}
