import { useEffect, useState } from "react";
import {
  map,
  debounceTime,
  Subject,
  distinctUntilChanged,
  pairwise,
  filter,
} from "rxjs";

function calcRootMeanSquare(buffer: Float32Array): number {
  let rms = 0;
  for (let i = 0; i < buffer.length; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms /= buffer.length;
  rms = Math.sqrt(rms);
  return rms;
}

class SoundPressureLevel {
  subject: Subject<number> = new Subject();
  _dataArray: Float32Array | null = null;

  constructor(stream: MediaStream) {
    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    setInterval(() => {
      const dataArray = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(dataArray);
      const soundPressureLevel = calcRootMeanSquare(dataArray.slice(200));

      this.subject.next(soundPressureLevel);
    }, 100);
  }
}

const IS_TALKING_SLP_LEVEL = 0.1;

export function useIsTalking(
  stream: MediaStream | null,
  talkingLevel: number = IS_TALKING_SLP_LEVEL
) {
  const [isTalking, setIsTalking] = useState(false);
  useEffect(() => {
    if (!stream) {
      return;
    }
    const slp = new SoundPressureLevel(stream);
    const isSlpAboveTalkingLevel$ = slp.subject.pipe(
      map((slpValue) => slpValue >= talkingLevel),
      distinctUntilChanged()
    );

    isSlpAboveTalkingLevel$.subscribe((isSlpAboveTalkingLevel) => {
      console.log(isTalking);
      if (isSlpAboveTalkingLevel && !isTalking) {
        console.log("SETTING IS TALKING TO TRUE");
        setIsTalking(true);
      }
    });

    isSlpAboveTalkingLevel$
      .pipe(debounceTime(1000))
      .subscribe((isSlpAboveTalkingLevel) => {
        if (!isSlpAboveTalkingLevel) {
          console.log("SETTING IS TALKING TO FALSE");
          setIsTalking(false);
        }
      });
  }, [Boolean(stream)]);

  return isTalking;
}
