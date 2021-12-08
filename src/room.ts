import Peer from "peerjs";
import EventEmitter from "events";

type Message = {
  text: string;
};

class RoomClient {
  peer: Peer | null = null;
  conn: Peer.DataConnection | null = null;

  _msgEmitter: EventEmitter;

  constructor() {
    this._msgEmitter = new EventEmitter();
  }

  createRoom = async () => {
    return new Promise((resolve) => {
      this.peer = new Peer();
      this.peer.on("connection", (peerConn) => {
        this.conn = peerConn;
        console.log(`Peer connected`, peerConn);
        this.conn.on("data", this._receiveMessage);
      });

      this.peer.on("open", (id) => {
        console.log("Initialized Peer with brokering id", id);
        resolve(id);
      });
    });
  };

  joinRoom = (roomId: string) => {
    if (!this.peer) {
      this.peer = new Peer();
    }
    this.conn = this.peer.connect(roomId);
    this.conn.on("open", () => {
      this.conn?.send("I connected!");
    });

    this.conn.on("data", this._receiveMessage);
  };

  _receiveMessage = (rawMsg: any) => {
    const msg: Message = JSON.parse(rawMsg);
    console.log("Received", msg);
    this._msgEmitter.emit("MESSAGE", msg);
  };

  subscribeToMessages = (subscriber: (msg: Message) => void) => {
    this._msgEmitter.on("MESSAGE", subscriber);
  };

  sendMessage = (msg: Message) => {
    if (!this.conn) {
      throw new Error("cant send a message without a connection");
    }
    this.conn.send(JSON.stringify(msg));
  };
}

const roomClient = new RoomClient();
export default roomClient;
