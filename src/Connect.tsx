import { Button, TextField } from "@mui/material";
import react, { DetailedHTMLProps, HTMLAttributes } from "react";
import { Form, Field } from "react-final-form";
import { useNavigate } from "react-router";
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
  let navigate = useNavigate();

  const onSubmit = async ({ name }: IFormValues) => {
    const user = localStorage.getItem("userName") ?? "";
    const id = await roomClient.createRoom();

    if (user) {
      navigate(`/room/${name}?user=${user}`);
    } else {
      navigate(`/join/${id}?room=${name}`);
    }
  };

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
                <label htmlFor="room">Room Name</label>
                <Field name="room" component={() => (
                  <TextField id="filled-basic" label="Filled" variant="filled" />
                )} validate={required} />
                
              </div>
              <div style={styles.field}>
                <label htmlFor="name">Your Name</label>
                <Field
                  name="name"
                  component={() => (
                    <TextField id="filled-basic" label="Filled" variant="filled" />
                  )}
                  validate={required}
                />
              </div>
              <Button variant="contained" disabled={invalid} onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }} >Connect</Button>
            </article>
          </form>
        );
      }}
    </Form>
  );
}
