import react, { DetailedHTMLProps, HTMLAttributes } from "react";
import { Form, Field } from "react-final-form";
import { useNavigate } from "react-router";

function createRoom() {
  return Math.random().toString();
}

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

export function Connect() {
  let navigate = useNavigate();

  const onSubmit = ({ name, room }: IFormValues) => {
    const id = createRoom();
    navigate(`/room/${id}?room=${room}&name=${name}`);
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
                <Field name="room" component="input" validate={required} />
              </div>
              <div style={styles.field}>
                <label htmlFor="name">Your Name</label>
                <Field
                  name="name"
                  component="input"
                  validate={(val) => (val ? undefined : "required")}
                />
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
