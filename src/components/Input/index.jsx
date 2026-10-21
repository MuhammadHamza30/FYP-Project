import { Form } from "react-bootstrap";
import { useField } from "formik";
import { useEffect } from "react";
export const Input = ({
  label,
  changeHandler,
  value: ignoredValue,
  ...props
}) => {
  const [field, meta] = useField(props.name);
  useEffect(() => {
    changeHandler?.(
      field.name,
      field.value,
    ); /* External state is used by legacy settings forms. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.name, field.value]);
  const invalid = meta.touched && !!meta.error;
  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor={props.id || field.name}>{label}</Form.Label>
      <Form.Control
        {...props}
        {...field}
        id={props.id || field.name}
        isInvalid={invalid}
        aria-describedby={invalid ? `${field.name}-error` : undefined}
      />
      {invalid && (
        <div id={`${field.name}-error`} className="error-message">
          {meta.error}
        </div>
      )}
    </Form.Group>
  );
};
