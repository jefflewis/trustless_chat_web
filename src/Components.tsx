import { TextField } from "@mui/material";

interface TextInputProps {
  input: any;
  label?: string;
  id?: string;
  required?: boolean;
}
export function TextInput({ input, label, id, required }: TextInputProps) {
  return (
    <TextField
      id={id}
      label={label}
      variant="filled"
      required={required}
      {...input}
    />
  );
}
