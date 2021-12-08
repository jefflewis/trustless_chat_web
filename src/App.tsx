import React from "react";
import { Route, Routes } from "react-router";
import "./App.css";
import { Chat } from "./Chat";
import { Connect } from "./Connect";
import { Join } from "./Join";
import { Room } from "./Room";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Connect />} />
      <Route path="join/:roomId" element={<Join />} />
      <Route path="room/:roomId" element={<Room />} />
    </Routes>
  );
}
