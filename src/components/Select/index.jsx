import { useEffect } from "react";
import { useField, ErrorMessage } from "formik";
import { Container, Form } from "react-bootstrap";

export const Select = (props) => {
  const [field, meta] = useField(props);

  useEffect(() => {
    props.changeHandler?.(field.name, meta.value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.value]);

  return (
    <Container>
      <Form.Group className="mb-3">
        <Form.Label htmlFor={field.name}>{props.label}</Form.Label>
        <Form.Select
          className={`${meta.error && "is-invalid"} bg-gray`}
          {...field}
          {...props}
        >
          <option value="">Search {props.label}</option>
          {props.data.map((e, i) => (
            <option key={i} value={e[props.searchKey]}>
              {e[props.searchValue]}
            </option>
          ))}
        </Form.Select>
        <ErrorMessage
          name={field.name}
          component="div"
          className="error-message"
        />
      </Form.Group>
    </Container>
  );
};
