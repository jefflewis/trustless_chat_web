import Peer from "peerjs";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

export default function App() {
  const [peerId, setPeerId] = useState("");
  const [tempPeerId, setTempPeerId] = useState("");
  const [msg, setMsg] = useState("");
  const [peer, setPeer] = useState<Peer>();
  const [peerConn, setPeerConn] = useState<Peer.DataConnection>();
  const [conn, setConn] = useState<Peer.DataConnection>();

  // on mount
  useEffect(() => {
    const id = uuidv4();
    setPeer(new Peer(id));

    console.log({ newPeerId: id });
  }, []);

  // connect to peer when we have an id
  useEffect(() => {
    if (!peerId) return;

    setConn(peer?.connect(peerId));
  }, [peerId, peer]);

  useEffect(() => {
    if (!peer) return;

    peer.on("connection", (peerConnection) => {
      console.log("Peer connected", peerConnection);

      setPeerConn(peerConnection);
    });
  }, [peer]);

  useEffect(() => {
    if (!peerConn) return;

    peerConn.on("data", (data) => {
      console.log("Peer Received: ", data);

      peerConn.send("got your msg");
    });
  }, [peerConn]);

  useEffect(() => {
    if (!conn) return;

    conn.on("open", () => {
      conn!.send("I connected!");
    });

    conn.on("data", (data) => {
      console.log("Conn Received:", data);
    });
  }, [conn]);

  return (
    <div className="App">
      <header className="App-header">
        <div>Brokering ID: {peerId}</div>
        <input type="text" onChange={(e) => setTempPeerId(e.target.value)} />
        <button
          onClick={() => {
            setPeerId(tempPeerId);
          }}
        >
          Connect to peer
        </button>

        <input
          style={{ marginTop: "3rem" }}
          type="text"
          onChange={(e) => setMsg(e.target.value)}
        />
        <button
          onClick={() => {
            if (!msg) return;

            if (conn) {
              return conn.send(msg);
            }

            // if we made it this far we know we are the "room host"
            if (peerConn) {
              peerConn?.send(msg);
              console.log("peerConn?.send call with: ", msg);
            }
          }}
        >
          send msg
        </button>
      </header>
    </div>
  );
}
