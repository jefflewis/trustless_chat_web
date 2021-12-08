import React from "react";
import "./App.css";
import { Route, Routes } from "react-router";
import { Connect } from "./Connect";
import { Join } from "./Join";

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
