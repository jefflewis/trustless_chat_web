class MediaClient {
  _stream: MediaStream | null = null;
  init = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
      audio: true,
    });
    this._stream = stream;

    return this._stream;
  };

  getStream = () => {
    if (!this._stream) {
      throw new Error("no stream initialized yet!!!");
    }
    return this._stream;
  };
}

const mediaClient = new MediaClient();
export default mediaClient;
