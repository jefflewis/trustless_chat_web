import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import roomClient, { Message } from "./roomClient";
import { v4 as uuid } from "uuid";
import uniq from "lodash/uniq";

type IMessage = unknown;

export function Room() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchParams] = useSearchParams();

  const user = searchParams.get("user");
  const room = searchParams.get("room");

  const [isConnected, setIsConnected] = useState(Boolean(roomClient._peer));

  useEffect(() => {
    console.log("Starting", { roomId, peer: roomClient._peer });

    if (roomId) {
      if (localStorage.getItem("roomId")) {
        roomClient.createRoom();
      } else {
        roomClient.joinRoom(roomId, { metadata: { user, room } });
      }

      setIsConnected(true);
    }
  }, []);

  useEffect(() => {
    roomClient.subcribeToStreams((stream) => {});

    roomClient.subscribeToMessages((message) =>
      setMessages((ms) => uniq([...ms, message]))
    );
  }, [room, isConnected]);

  if (!user) {
    return null;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>{room}</h1>

        <h2>Connected</h2>
        <ul>
          <li>{user}</li>
          <li>{roomClient._conn?.metadata.name}</li>
        </ul>

        <ul>
          {messages.map((message) => {
            return (
              <li key={message.id}>
                <div>{message.text}</div>
                <div>{message.sentAt}</div>
              </li>
            );
          })}
        </ul>
        <Form
          onSubmit={({ text }) => {
            const message: Message = {
              sentAt: new Date().toISOString(),
              text,
              id: uuid(),
              sentBy: user,
            };
            roomClient.sendMessage(message);
            setMessages((ms) => uniq([...ms, message]));
          }}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Field name="text" component="input" />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                Send
              </button>
            </form>
          )}
        />
      </header>
    </div>
  );
}
