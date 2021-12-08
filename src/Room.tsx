import "./App.css";
import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import roomClient, { Message } from "./roomClient";
import { v4 as uuid } from "uuid";
import uniq from "lodash/uniq";
import mediaClient from "./mediaClient";
import { Video, Audio } from "./Media";
import { Chat } from "./Chat";

function useLocalStream() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  useEffect(() => {
    mediaClient.init().then(() => {
      setLocalStream(mediaClient.getStream());
    });
  }, []);
  return localStream;
}

export function Room() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchParams] = useSearchParams();

  const localStream = useLocalStream();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const user = searchParams.get("user");
  const room = searchParams.get("room");

  const [isConnected, setIsConnected] = useState(Boolean(roomClient._peer));

  const onSendMessage = (text: string) => {
    console.log(text, "this is entering the chattttt");
    const message: Message = {
      sentAt: new Date().toISOString(),
      text,
      id: uuid(),
      sentBy: user || "",
    };
    roomClient.sendMessage(message);
    setMessages((ms) => uniq([...ms, message]));
  };

  useEffect(() => {
    console.log("Starting", { roomId, peer: roomClient._peer });

    if (roomId) {
      if (localStorage.getItem("roomId")) {
        roomClient.createRoom().finally(() => {
          setIsConnected(true);
        });
      } else {
        roomClient
          .joinRoom(roomId, { metadata: { user, room } })
          .finally(() => {
            mediaClient.init().then(() => {
              const localStream = mediaClient.getStream();
              roomClient.call(localStream);
            });
            setIsConnected(true);
          });
      }
    }
  }, []);

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    roomClient.subcribeToStreams((remoteStream) => {
      console.log("remote stream came in", remoteStream);
      setRemoteStream(remoteStream.mediaStream);
    });
    roomClient.subcribeToCalls((call) => {
      if (localStream) {
        roomClient.answer(call, localStream);
      }
    });

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
        <div>
          {localStream && <Video isRemote={false} stream={localStream} />}
          {remoteStream && <Video isRemote={true} stream={remoteStream} />}
          {remoteStream && <Audio stream={remoteStream} />}
        </div>
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
        <Chat messages={messages} onSendMessage={onSendMessage} user={user} />
      </header>
    </div>
  );
}
