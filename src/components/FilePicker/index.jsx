import { Container, Form } from "react-bootstrap";

export const FileInput = (props) => {
  return (
    <Container>
      <Form.Group className="mb-3">
        <Form.Label htmlFor={props.name}>{props.label}</Form.Label>
        <Container className="file-container btn btn-lg secondary-button">
          {props.loading ? (
            <div className="spinner-grow text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : "Upload"
          }
          <input
            type="file"
            id={props.name}
            onChange={(e) => props.changeHandler?.(props.name, e.target.files?.[0])}
            accept="image/*"
          />
        </Container>
      </Form.Group>
    </Container>
  );
};
