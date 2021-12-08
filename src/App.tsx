import { useState } from 'react';
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Connect />} />
      <Route path="join/:id" element={<Join />} />
      <Route path="room/:id" element={<Room />} />
    </Routes>
  );
}
