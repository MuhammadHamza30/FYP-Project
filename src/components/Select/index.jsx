import { useEffect } from "react";
import { useField } from "formik";
import { Form } from "react-bootstrap";
export const Select = ({
  label,
  changeHandler,
  data = [],
  searchKey,
  searchValue,
  ...props
}) => {
  const [field, meta] = useField(props.name);
  useEffect(() => {
    changeHandler?.(field.name, field.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.name, field.value]);
  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor={field.name}>{label}</Form.Label>
      <Form.Select
        {...props}
        {...field}
        id={field.name}
        isInvalid={meta.touched && !!meta.error}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {data.map((item, index) => (
          <option key={index} value={item[searchKey]}>
            {item[searchValue]}
          </option>
        ))}
      </Form.Select>
      {meta.touched && meta.error && (
        <div className="error-message">{meta.error}</div>
      )}
    </Form.Group>
  );
};
