import React, { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import { Form, Field } from "react-final-form";
import { Button, Typography } from "@mui/material";
import { TextInput } from "./Components";
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
    width: 400,
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
    <div
      className="debug"
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Form onSubmit={onSubmit} initialValues={{ room, name: "" }}>
        {({ invalid, handleSubmit }) => {
          return (
            <form style={styles.form}>
              <header style={{ marginBottom: "4rem" }}>
                <Typography variant="h1">Join {room}</Typography>
              </header>
              <article>
                <div style={styles.field}>
                  <Field
                    name="name"
                    render={({ input }) => (
                      <TextInput input={input} label="Your Name" required />
                    )}
                    validate={required}
                  />
                </div>
                <Button
                  fullWidth={true}
                  variant="contained"
                  disabled={invalid}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  Connect
                </Button>
              </article>
            </form>
          );
        }}
      </Form>
    </div>
  );
}
