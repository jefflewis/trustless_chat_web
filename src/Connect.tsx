import { Button } from "@mui/material";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { Form, Field } from "react-final-form";
import { useNavigate } from "react-router";
import { TextInput } from "./Components";
import roomClient from "./roomClient";

interface IFormValues {
  roomName: string;
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
    flex: 1,
    height: "100vh",
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

  const onSubmit = async ({ roomName }: IFormValues) => {
    const user = localStorage.getItem("userName") ?? "";
    const id = await roomClient.createRoom();

    navigator.clipboard.writeText(
      encodeURI(`http://localhost:3000/join/${id}?room=${roomName}`)
    );

    if (user) {
      navigate(`/room/${id}?user=${user}&room=${roomName}`);
    } else {
      navigate(`/join/${id}?room=${roomName}`);
    }
  };

  return (
    <Form onSubmit={onSubmit} initialValues={{ roomName: "" }}>
      {({ invalid, handleSubmit }) => {
        return (
          <form style={styles.form} onSubmit={handleSubmit}>
            <header className="App-header">
              <h1>Create a room</h1>
            </header>
            <article>
              <div style={styles.field}>
                <Field
                  name="roomName"
                  render={({ input }) => (
                    <TextInput input={input} label="Room Name" required />
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
  );
}
