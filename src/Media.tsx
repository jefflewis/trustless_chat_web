import { useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";

function buildVideoTransform(isRemote: boolean) {
  return `scale(${isRemote ? 1 : -1}, 1)`;
}
export function Video({
  stream,
  isRemote,
}: {
  stream: MediaStream;
  isRemote: boolean;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const { palette } = useTheme();

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    ref.current.srcObject = stream;
  }, []);

  const avatarSize = "15rem";
  const [borderWidth, setBorderWidth] = useState(4);
  useEffect(() => {
    const id = setInterval(() => {
      setBorderWidth((w) => (w === 4 ? 12 : 4));
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div
        style={{
          borderRadius: "50%",
          overflow: "hidden",
          border: `${borderWidth}px solid`,
          borderColor: palette.primary.main,
          height: avatarSize,
          width: avatarSize,
          // position: "absolute",
          transition: "border-width 0.3s ease-in-out",
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
          <video
            style={{ transform: buildVideoTransform(isRemote) }}
            ref={ref}
            width="190%"
            height="100%"
            autoPlay
            muted={!isRemote}
          />
        </div>
      </div>
    </div>
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
