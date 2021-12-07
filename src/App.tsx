import { useState } from 'react';
import './App.css';

import { connectToPeer, BROKERING_ID} from './peer'

export default function App() {
  const [peerId, setPeerId] = useState('')
  return (
    <div className="App">
      <header className="App-header">
        <div>Brokering ID: {BROKERING_ID}</div>
        <input type="text" onChange={(e) => setPeerId(e.target.value)} />
        <button onClick={() => { connectToPeer(peerId) }}>Connect to peer</button>
        <p>
          Trustless Chat
        </p>
      </header>
    </div>
  );
}
