class MediaClient {
  _stream: MediaStream | null = null;
  init = async () => {
    return navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 }, audio: true })
      .then((stream) => {
        this._stream = stream;
      });
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
