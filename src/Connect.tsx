import { Button, TextField } from "@mui/material";
import react, { DetailedHTMLProps, HTMLAttributes } from "react";
import { Form, Field } from "react-final-form";
import { useNavigate } from "react-router";
import { TextInput } from "./Components";
import roomClient from "./roomClient";

interface IFormValues {
  name: string;
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

export function Connect() {
  const navigate = useNavigate();

  const onSubmit = async ({ name }: IFormValues) => {
    const user = localStorage.getItem("userName") ?? "";
    const id = await roomClient.createRoom();

    if (user) {
      navigate(`/room/${id}?room=${name}&user=${user}`);
    } else {
      navigate(`/join/${id}?room=${name}`);
    }
  };

  console.log("hello world");

  return (
    <Form onSubmit={onSubmit} initialValues={{ room: "", name: "" }}>
      {({ invalid, handleSubmit }) => {
        return (
          <form style={styles.form}>
            <header className="App-header">
              <h1>Create a room</h1>
            </header>
            <article>
              <div style={styles.field}>
                <Field
                  name="room"
                  render={({ input }) => (
                    <TextInput input={input} label="Room Name" required />
                  )}
                  validate={required}
                />
              </div>
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
  );
}
