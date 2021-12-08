import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import roomClient from "./roomClient";

type IMessage = unknown;

export function Room() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [searchParams] = useSearchParams();

  const user = searchParams.get("user");
  const room = searchParams.get("room");

  const [isConnected, setIsConnected] = useState(Boolean(roomClient._peer));

  useEffect(() => {
    console.log("Starting", { roomId, peer: roomClient._peer });

    if (roomId && !roomClient._peer) {
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
      setMessages((ms) => [...ms, message])
    );
  }, [room, isConnected]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>{room}</h1>

        <h2>Connected</h2>
        <ul>
          <li>{user}</li>
          {/* <li>{roomClient._conn?.metadata.name}</li> */}
        </ul>
      </header>
    </div>
  );
}
