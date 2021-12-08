import { useTheme } from "@mui/material";
import { useEffect, useRef } from "react";

function buildVideoTransform(isRemote: boolean) {
  return `scale(${isRemote ? 1 : -1}, 1)`;
}
export function Video({
  stream,
  isRemote,
  talking,
}: {
  stream: MediaStream;
  isRemote: boolean;
  talking?: boolean;
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
          animationPlayState: talking ? "initial" : "paused",
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
