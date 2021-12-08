import {useState} from 'react';
import './App.css';

import roomClient from './room'

export default function App() {
  const [roomId, setRoomId] = useState('')
  return (
    <div className="App">
      <header className="App-header">
        <input type="text" onChange={(e) => setRoomId(e.target.value)} />
        <button onClick={() => { roomClient.joinRoom(roomId) }}>Join Room</button>
        <p>
          Trustless Chat
        </p>
      </header>
    </div>
  );
}
