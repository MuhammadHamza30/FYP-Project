import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
export const FileInput = ({ name, label, loading, changeHandler }) => (
  <Form.Group className="mb-3">
    <Form.Label htmlFor={name}>{label}</Form.Label>
    <Form.Control
      id={name}
      type="file"
      accept="image/jpeg,image/png,image/webp"
      disabled={loading}
      onChange={(event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (
          !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
          file.size > 5 * 1024 * 1024
        ) {
          toast.error("Choose a JPG, PNG, or WebP image under 5 MB.");
          event.target.value = "";
          return;
        }
        changeHandler?.(name, file);
      }}
    />
    {loading && <small role="status">Uploading image…</small>}
  </Form.Group>
);
