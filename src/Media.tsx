import { useEffect, useRef } from 'react';

export function Video({ stream }: { stream: MediaStream}) {
  const ref = useRef<HTMLVideoElement | null>(null)
  useEffect(() => {
    if (!ref.current) {
      return
    }
    ref.current.srcObject = stream
  }, [])
  return <video ref={ref} height={100} width={100} autoPlay></video>
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
