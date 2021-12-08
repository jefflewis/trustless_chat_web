import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";

const id = uuidv4();
const peer = new Peer(id);
peer.on("connection", (peerConn) => {
  console.log("Peer connected", peerConn);
  peerConn.send("thanks for connecting");
  peerConn.on("data", (data) => {
    console.log("Received:", data);
  });
});

console.log(id);
export function connectToPeer(peerId: string) {
  const conn = peer.connect(peerId);
  console.log(conn);

  conn.on("open", () => {
    conn.send("I connected!");
  });

  conn.on("data", (data) => {
    console.log("Received:", data);
  });
}

export const BROKERING_ID = id;
