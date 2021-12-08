import Peer from "peerjs";
import EventEmitter from "events";

export interface Message {
  id: string;
  sentBy: string;
  sentAt: string;
  text: string;
}

type Stream = {
  type: string;
  mediaStream: MediaStream;
};

class RoomClient {
  _peer: Peer | null = null;
  _conn: Peer.DataConnection | null = null;
  _emitter: EventEmitter;

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
        console.log("Peer connected", peerConn);
        this._conn.on("data", this._receiveMessage);
      });

      this._peer.on("call", (call) => {
        console.log("ROOM HOST GOT CALL", call);
        call.on("stream", (stream) =>
          this._receiveStream(stream, call.metadata.type)
        );
        this._emitter.emit("CALL", call);
      });

      this._peer.on("open", (id) => {
        console.log("Initialized Peer with brokering id", id);
        localStorage.setItem("roomId", id);
        resolve(id);

        this._emitter.emit("created", this._conn);
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

    this._emitter.emit("joined", this._conn);
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

          // connectionInterval = setInterval(() => {
          //   peer.connect(roomId, options);
          // }, 250);
        });

        connection.on("data", this._receiveMessage);

        resolve(connection);
      });
    });
  };

  call = (mediaStream: MediaStream, options?: Peer.CallOption) => {
    if (!this._conn || !this._peer) {
      throw new Error("no connection for call");
    }
    console.log("CALLING", this._conn.peer);
    const call = this._peer.call(this._conn.peer, mediaStream, options);

    call.on("stream", (stream) =>
      this._receiveStream(stream, call.metadata.type)
    );
  };

  _receiveStream = (mediaStream: MediaStream, type: string) => {
    this._emitter.emit("STREAM", { mediaStream, type });
  };

  subscribeToCalls = (subscribe: (call: Peer.MediaConnection) => void) => {
    this._emitter.on("CALL", subscribe);
  };

  subscribeToStreams = (subscribe: (stream: Stream) => void) => {
    this._emitter.on("STREAM", subscribe);
  };

  answer = (call: Peer.MediaConnection, mediaStream?: MediaStream) => {
    console.log("answering", { call, mediaStream });
    call.answer(mediaStream);
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
