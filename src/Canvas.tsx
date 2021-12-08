import React, { useEffect, useRef, useState } from "react";
import { Video } from "./Media";
import roomClient from "./roomClient";

export function Canvas() {
  const ref = useRef<HTMLCanvasElement>(null);
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
      if (!ref?.current) {
        return;
      }

      console.log("Calling with canvas joined", ref.current);

      roomClient.call(ref.current.captureStream(), {
        metadata: { type: "canvas" },
      });

      roomClient.subscribeToStreams((stream) => {
        if (!ref?.current || stream.type !== "canvas") {
          return;
        }

        console.log("remote stream came in joined", stream);
        setRemoteStream(stream.mediaStream);
      });
    });

    roomClient._emitter.on("created", () => {
      if (!ref?.current) {
        return;
      }

      console.log("Calling with canvas created", ref.current);

      // roomClient.call(ref.current.captureStream(), {
      //   metadata: { type: "canvas" },
      // });

      roomClient.subscribeToStreams((remoteStream) => {
        if (!ref?.current || remoteStream.type !== "canvas") {
          return;
        }

        console.log("remote stream came in created", remoteStream);
        setRemoteStream(remoteStream.mediaStream);
        requestAnimationFrame(() => {
          console.log("wtf");
        });
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
    context?.moveTo(pos.x - 410, pos.y - 110);
    return false;
  };

  const onMouseMove = (e: any) => {
    if (!ref?.current) {
      return;
    }

    const pos = fixPosition(e, ref.current);
    const context = ref.current.getContext("2d");

    if (isMouseDown) {
      console.log("pos", pos);
      context?.lineTo(pos.x - 410, pos.y - 110);
      context?.stroke();
    }
  };

  const onMouseUp = (_e: any) => {
    setIsMouseDown(false);
  };

  useEffect(() => {
    // make it white for the rtc video to work
    const context = ref.current?.getContext("2d");
    if (context) {
      context.rect(0, 0, 800, 800);
      context.fillStyle = "white";
      context.fill();
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        border: "1 px solid red",
        margin: 40,
        flexWrap: "wrap",
        position: "relative",
      }}
    >
      <canvas
        style={{
          zIndex: 10,
          opacity: 0.5,
          position: "absolute",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        ref={ref}
        id="canvas"
        width="800"
        height="800"
      />

      {remoteStream && (
        <Video
          style={{ position: "absolute" }}
          width="800"
          height="800"
          isRemote
          stream={remoteStream}
        />
      )}
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
