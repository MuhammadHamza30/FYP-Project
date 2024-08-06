import { Container, Form } from "react-bootstrap";
import { useField, ErrorMessage } from "formik";
import { useEffect } from "react";

export const Textarea = (props) => {
  const [field, meta] = useField(props);
  useEffect(() => {
    props.changeHandler?.(field.name, meta.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.name, meta.value]);
  return (
    <Container>
      <Form.Group className="mb-3">
        <Form.Label htmlFor={field.name}>{props.label}</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          className={`${meta.error && "is-invalid"}`}
          {...field}
          {...props}
        />
        <ErrorMessage
          name={field.name}
          component="div"
          className="error-message"
        />
      </Form.Group>
    </Container>
  );
};
