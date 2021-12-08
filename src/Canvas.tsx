import React, { Suspense, useEffect, useRef, useState } from "react";
import { Video } from "./Media";
import roomClient from "./roomClient";

export function Canvas() {
  const [isConnected, setIsConnected] = useState(Boolean(roomClient._conn));
  const ref = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    roomClient.subscribeToCalls((call) => {
      if (call.metadata.type !== "canvas") {
        return;
      }

      console.log("answering canvas call", call, ref.current?.captureStream());

      roomClient.answer(call, ref.current?.captureStream());
    });

    roomClient._emitter.on("joined", () => {
      if (!ref?.current || !videoRef.current) {
        return;
      }

      console.log("Calling with canvas joined", ref.current);

      roomClient.call(ref.current.captureStream(), {
        metadata: { type: "canvas" },
      });

      roomClient.subscribeToStreams((remoteStream) => {
        if (
          !ref?.current ||
          !videoRef.current ||
          remoteStream.type !== "canvas"
        ) {
          return;
        }

        console.log("remote stream came in", remoteStream);
        if (!videoRef.current.srcObject) {
          videoRef.current.srcObject = remoteStream.mediaStream;
          setRemoteStream(remoteStream.mediaStream);
        }
      });
    });

    roomClient._emitter.on("created", () => {
      if (!ref?.current || !videoRef.current) {
        return;
      }

      console.log("Calling with canvas created", ref.current);

      // roomClient.call(ref.current.captureStream(), {
      //   metadata: { type: "canvas" },
      // });

      roomClient.subscribeToStreams((remoteStream) => {
        if (
          !ref?.current ||
          !videoRef.current ||
          remoteStream.type !== "canvas"
        ) {
          return;
        }

        console.log("remote stream came in", remoteStream);
        setRemoteStream(remoteStream.mediaStream);
        videoRef.current.srcObject = ref.current.captureStream();
      });
    });
  }, []);

  const onMouseDown = (e: any) => {
    if (!ref?.current) {
      return;
    }

    const context = ref?.current?.getContext("2d");
    var pos = fixPosition(e, ref.current);
    setIsMouseDown(true);
    context?.beginPath();
    context?.moveTo(pos.x, pos.y);
    return false;
  };

  const onMouseMove = (e: any) => {
    if (!ref?.current) {
      return;
    }

    const pos = fixPosition(e, ref.current);
    const context = ref.current.getContext("2d");

    if (isMouseDown) {
      context?.lineTo(pos.x, pos.y);
      context?.stroke();
    }
  };

  const onMouseUp = (_e: any) => {
    setIsMouseDown(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        border: "1 px solid red",
        margin: 40,
        flexWrap: "wrap",
      }}
    >
      <canvas
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        ref={ref}
        id="canvas"
        width="300"
        height="300"
        style={{ backgroundColor: "white", border: "1px solid black" }}
      />
      {/* {remoteStream && <Video isRemote stream={remoteStream} />} */}
      <video
        style={{
          backgroundColor: "white",
          border: "1px solid black",
        }}
        width="300"
        height="300"
        ref={videoRef}
      />
    </div>
  );
}

function fixPosition(e: MouseEvent, gCanvasElement: HTMLCanvasElement) {
  var x;
  var y;
  if (e.pageX || e.pageY) {
    x = e.pageX;
    y = e.pageY;
  } else {
    x =
      e.clientX +
      document.body.scrollLeft +
      document.documentElement.scrollLeft;
    y =
      e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  x -= gCanvasElement.offsetLeft;
  y -= gCanvasElement.offsetTop;
  return { x: x, y: y };
}
