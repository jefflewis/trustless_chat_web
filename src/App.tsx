import React from "react";
import "./App.css";
import { Route, Routes } from "react-router";
import { Connect } from "./Connect";

// interface IMessage {
//   sentBy: string
//   sentAt: Date
//   body: string
// }

function Join() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Join ROOM NAME</p>
      </header>
    </div>
  );
}

function Room() {
  return (
    <div className="App">
      <header className="App-header">
        <p>This is the ROOM NAME</p>
      </header>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Connect />} />
      <Route path="join/:id" element={<Join />} />
      <Route path="room/:id" element={<Room />} />
    </Routes>
  );
}
