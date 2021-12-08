import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material";
import { useIsTalking } from "./audio";
import mediaClient from "./mediaClient";
import roomClient from "./roomClient";

function buildVideoTransform(isRemote: boolean) {
  return `scale(${isRemote ? 1 : -1}, 1)`;
}

function useLocalStream() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  useEffect(() => {
    mediaClient.init().then(() => {
      setLocalStream(mediaClient.getStream());
    });
  }, []);
  return localStream;
}

export function Media() {
  const localStream = useLocalStream();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(Boolean(roomClient._conn));

  useEffect(() => {
    roomClient._emitter.on("joined", () => {
      roomClient.subscribeToStreams((remoteStream) => {
        console.log("remote stream came in", remoteStream);
        setRemoteStream(remoteStream.mediaStream);
      });
      setIsConnected(true);
    });

    roomClient._emitter.on("created", () => {
      roomClient.subscribeToStreams((remoteStream) => {
        if (remoteStream.type !== "video") {
          return;
        }
        console.log("remote stream came in", remoteStream);
        setRemoteStream(remoteStream.mediaStream);
      });
    });
  }, []);

  useEffect(() => {
    if (localStream && isConnected) {
      roomClient.call(localStream, { metadata: { type: "video" } });
    }
  }, [localStream, isConnected]);

  return (
    <>
      {localStream && <VideoAvatar isRemote={false} stream={localStream} />}
      <div style={{ marginTop: "4rem" }}>
        {remoteStream && <VideoAvatar isRemote={true} stream={remoteStream} />}
      </div>
      {remoteStream && <Audio stream={remoteStream} />}
    </>
  );
}

function VideoAvatar({
  stream,
  isRemote,
}: {
  stream: MediaStream;
  isRemote: boolean;
}) {
  const { palette } = useTheme();

  const isTalking = useIsTalking(stream);

  const avatarSize = "15rem";

  return (
    <div>
      <div
        style={{
          borderRadius: "50%",
          overflow: "hidden",
          border: `4px solid ${palette.primary.main}`,
          height: avatarSize,
          width: avatarSize,
          animationName: "grow",
          animationDuration: "2s",
          animationIterationCount: "infinite",
          animationTimingFunction: "ease-out",
          animationFillMode: "forward",
          animationPlayState: isTalking ? "initial" : "paused",
        }}
      >
        <div
          style={{
            height: "99%",
            width: "50",
            position: "relative",
            top: 0,
            left: -90,
            // animation: "avatar-shadow 1s infinite ease",
          }}
        >
          <Video isRemote={isRemote} stream={stream} />
        </div>
      </div>
    </div>
  );
}

export function Video({
  stream,
  isRemote,
}: {
  stream: MediaStream;
  isRemote: boolean;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    ref.current.srcObject = stream;
  }, []);
  return (
    <video
      style={{ transform: buildVideoTransform(isRemote) }}
      ref={ref}
      width="190%"
      height="100%"
      autoPlay
      muted={!isRemote}
    />
  );
}

export function Audio({ stream }: { stream: MediaStream }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    ref.current.srcObject = stream;
  }, []);
  return <audio ref={ref} autoPlay></audio>;
}
