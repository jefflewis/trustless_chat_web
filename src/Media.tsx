import { useEffect, useRef } from 'react';

function buildVideoTransform(isRemote: boolean) {
  return `scale(${isRemote ? 1 : -1}, 1)`
}
export function Video({ stream, isRemote }: { stream: MediaStream, isRemote: boolean}) {
  const ref = useRef<HTMLVideoElement | null>(null)
  useEffect(() => {
    if (!ref.current) {
      return
    }
    ref.current.srcObject = stream
  }, [])

  return <video style={{ transform: buildVideoTransform(isRemote) }} ref={ref} height={400} width={400} autoPlay muted={!isRemote}></video>
}

export function Audio({ stream }: { stream: MediaStream}) {
  const ref = useRef<HTMLAudioElement | null>(null)
  useEffect(() => {
    if (!ref.current) {
      return
    }
    ref.current.srcObject = stream
  }, [])
  return <audio ref={ref} autoPlay></audio>
}
