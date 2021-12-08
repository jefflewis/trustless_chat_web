import React, { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import { Form, Field } from "react-final-form";
import { useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import roomClient from "./roomClient";

interface IFormValues {
  name: string;
  room: string;
}

const styles: Record<
  string,
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>["style"]
> = {
  form: {
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 20,
  },
};

function required(val: any) {
  return val ? undefined : "required";
}

export function Join() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const room = searchParams.get("room");

  if (!room || !roomId) {
    navigate("/");
    return null;
  }

  const onSubmit = ({ name, room }: IFormValues) => {
    localStorage.setItem("userName", name);

    console.log("peer is ", roomClient._peer);
    console.log("connecting to room ", { roomId });

    if (!roomClient._peer) {
      roomClient.joinRoom(roomId, { metadata: { name, room } });
    }

    navigate(`/room/${roomId}/?room=${room}&user=${name}`);
  };

  return (
    <Form onSubmit={onSubmit} initialValues={{ room, name: "" }}>
      {({ invalid, handleSubmit }) => {
        return (
          <form style={styles.form}>
            <header className="App-header">
              <h1>Join {room}</h1>
            </header>
            <article>
              <div style={styles.field}>
                <label htmlFor="name">Your Name</label>
                <Field name="name" component="input" validate={required} />
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                disabled={invalid}
                className="primary"
              >
                Join
              </button>
            </article>
          </form>
        );
      }}
    </Form>
  );
}
