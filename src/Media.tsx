import { useTheme } from "@mui/material";
import { useEffect, useRef } from "react";

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

  return (
    <>
      <div
        style={{
          borderRadius: "50%",
          overflow: "hidden",
          border: "4px solid",
          borderColor: palette.primary.main,
          height: avatarSize,
          width: avatarSize,
          position: "absolute",
        }}
      >
        <div
          style={{
            height: "99%",
            width: "50",
            border: "1px solid pink",
            position: "relative",
            top: 0,
            left: -90,
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
    </>
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
