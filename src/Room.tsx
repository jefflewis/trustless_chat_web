import "./App.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import roomClient, { Message } from "./roomClient";
import { v4 as uuid } from "uuid";
import uniq from "lodash/uniq";
import mediaClient from "./mediaClient";
import { AppBar, useTheme, Typography, Alert, Snackbar } from "@mui/material";
import { capitalize } from "lodash";
import { Media } from "./Media";
import { Canvas } from "./Canvas";
import { Chat } from "./Chat";

export function Room() {
  const theme = useTheme();

  const { roomId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchParams] = useSearchParams();

  const user = searchParams.get("user");
  const room = searchParams.get("room");

  const [isConnected, setIsConnected] = useState(Boolean(roomClient._peer));
  const [snackbarOpen, setSnackbarOpen] = useState(true);

  useEffect(() => {
    roomClient.subscribeToCalls((call) => {
      if (call.metadata.type === "video") {
        mediaClient.init().then((stream) => {
          console.log("got a call", { call, stream });
          roomClient.answer(call, stream);
        });
      }
    });
  }, []);

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
            setIsConnected(true);
          });
      }
    }
  }, []);

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    roomClient.subscribeToMessages((message) =>
      setMessages((ms) => uniq([...ms, message]))
    );
  }, [room, isConnected]);

  if (!user) {
    return null;
  }

  return (
    <>
      <div
        style={{
          height: "100%",
          backgroundColor: theme.palette.background.default,
          width: "100%",
          // account for static top bar
          paddingTop: "4.6rem",
        }}
      >
        <AppBar
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
          }}
          color="primary"
        >
          <Typography variant="h4" color={"black"}>
            {capitalize(room || "")}
          </Typography>
        </AppBar>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
          }}
        >
          {/* LEFT SECTION (user avatars) */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              paddingTop: "4rem",
              flexDirection: "column",
            }}
          >
            <Media />
          </div>

          {/* RIGHT SECTION (canvas) */}
          <div
            style={{
              flex: 3,
              height: "100%",
              backgroundColor:
                theme.palette.secondary.light || theme.palette.background.paper,
            }}
          >
            <Canvas />
            <Chat
              messages={messages}
              onSendMessage={onSendMessage}
              user={user}
            />
          </div>
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={3000}
        sx={{ width: "90%" }}
      >
        <Alert
          severity="success"
          sx={{ width: "100%" }}
          onClose={() => setSnackbarOpen(false)}
        >
          Share id copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}
