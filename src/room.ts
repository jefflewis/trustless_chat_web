import Peer from "peerjs";
import EventEmitter from "events";

type Message = {
  text: string;
};

type Stream = {
  mediaStream: MediaStream;
};

class RoomClient {
  _peer: Peer | null = null;
  _conn: Peer.DataConnection | null = null;
  _emitter: EventEmitter;
  _missedCalls: Peer.MediaConnection[] = [];

  constructor() {
    this._emitter = new EventEmitter();
  }

  createRoom = async () => {
    return new Promise((resolve) => {
      this._peer = new Peer();
      this._peer.on("connection", (peerConn) => {
        this._conn = peerConn;
        console.log(`Peer connected`, peerConn);
        this._conn.on("data", this._receiveMessage);
      });

      this._peer.on("call", (call) => {
        this._missedCalls.push(call);
        call.on("stream", this._receiveStream);
      });

      this._peer.on("open", (id) => {
        console.log("Initialized Peer with brokering id", id);
        resolve(id);
      });
    });
  };

  joinRoom = (roomId: string) => {
    if (!this._peer) {
      this._peer = new Peer();
    }
    this._conn = this._peer.connect(roomId);
    this._conn.on("open", () => {
      this._conn?.send("I connected!");
    });

    this._conn.on("data", this._receiveMessage);
  };

  call = (mediaStream: MediaStream) => {
    if (!this._conn || !this._peer) {
      throw new Error("no connection for call");
    }
    const call = this._peer.call(this._conn.peer, mediaStream);
    call.on("stream", this._receiveStream);
  };

  _receiveStream = (mediaStream: MediaStream) => {
    this._emitter.emit("STREAM", { mediaStream });
  };

  subcribeToStreams = (subscribe: (stream: Stream) => void) => {
    this._emitter.on("STREAM", subscribe);
  };

  answer = (mediaStreams: MediaStream[]) => {
    mediaStreams.forEach((mediaStream) => {
      const call = this._missedCalls.pop();
      call?.answer(mediaStream);
    });
  };

  _receiveMessage = (rawMsg: any) => {
    const msg: Message = JSON.parse(rawMsg);
    console.log("Received", msg);
    this._emitter.emit("MESSAGE", msg);
  };

  subscribeToMessages = (subscriber: (msg: Message) => void) => {
    this._emitter.on("MESSAGE", subscriber);
  };

  sendMessage = (msg: Message) => {
    if (!this._conn) {
      throw new Error("cant send a message without a connection");
    }
    this._conn.send(JSON.stringify(msg));
  };
}

const roomClient = new RoomClient();
export default roomClient;
