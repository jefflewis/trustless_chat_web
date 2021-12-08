import { useState } from 'react';
import './App.css';
import roomClient from './room'

export default function App() {
  const [roomId, setRoomId] = useState('')
  return (
    <Routes>
      <Route path="/" element={<Connect />} />
      <Route path="join/:id" element={<Join />} />
      <Route path="room/:id" element={<Room />} />
    </Routes>
  );
}
