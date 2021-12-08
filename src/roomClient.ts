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

  createRoom = async (userName?: string) => {
    const roomId = localStorage.getItem("roomId") ?? undefined;

    return new Promise<string>((resolve) => {
      console.log("creating room peer");
      this._peer = new Peer(roomId);

      console.log("new peer created", this._peer);
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
        localStorage.setItem("roomId", id);
        resolve(id);
      });
    });
  };

  joinRoom = async (roomId: string, options?: Peer.PeerConnectOption) => {
    if (!this._peer) {
      this._peer = new Peer();
    }

    this._conn = await this._connectToPeer(this._peer, roomId, options);

    console.log("connected to peer", {
      peer: this._peer,
      connection: this._conn,
    });
  };

  _connectToPeer = async (
    peer: Peer,
    roomId: string,
    options?: Peer.PeerConnectOption
  ) => {
    return new Promise<Peer.DataConnection>((resolve) => {
      console.log("connecting to peer", { peer });

      let connection: Peer.DataConnection;
      let connectionInterval: NodeJS.Timeout | undefined;

      peer.on("open", () => {
        connection = peer.connect(roomId, options);

        if (connectionInterval) {
          clearInterval();
        }

        connection.on("open", () => {
          console.log("connection opened");
          connection?.send(JSON.stringify({ notice: `${peer.id} connected` }));
        });

        connection.on("close", () => {
          console.log("peer closed connection", connection);
          if (connectionInterval) {
            clearInterval(connectionInterval);
          }

          connectionInterval = setInterval(() => {
            peer.connect(roomId, options);
          }, 250);
        });

        connection.on("data", this._receiveMessage);

        resolve(connection);
      });
    });
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

    if (!msg.text) {
      return;
    }

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
