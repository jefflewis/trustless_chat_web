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
      navigate(`/room/${id}?room=${name}&user=${user}`);
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
                <label htmlFor="name">Room Name</label>
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
                Connect
              </button>
            </article>
          </form>
        );
      }}
    </Form>
  );
}
