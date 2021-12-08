import react, { DetailedHTMLProps, HTMLAttributes } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import TextField from "@mui/material/TextField";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";

const styles: Record<
string,
DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>["style"]
> = {
room: {
  flex: 1,
},
chatBox: {
  backgroundColor: 'white',
  borderWidth: 0,
  color: 'black',
  borderRadius: 5,
}
};

export function Room() {
  const { id } = useParams();
  const [ searchParams ] = useSearchParams();
  const name = searchParams.get("name")
  const room = searchParams.get("room")

  return (
    <div className="App">
      {/* WHAT WE NEED HERE */}
      {/* NAVIGATION BETWEEN CHAT AND CANVAS */}

      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem"
        }}
      >
        <Link to="/chat">Chat</Link> |{" "}
        <Link to="/expenses">Canvas</Link>
      </nav>
    </div>
  );
}
