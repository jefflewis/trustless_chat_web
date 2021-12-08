import { useEffect, useRef, useState } from "react";
import roomClient from "./roomClient";

export function Canvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    if (!ref?.current) {
      return;
    }

    roomClient.call(ref.current.captureStream(), {
      metadata: { type: "canvas" },
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
