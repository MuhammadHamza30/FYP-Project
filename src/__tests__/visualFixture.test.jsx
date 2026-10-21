import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Dashboard } from "../components/Dashboard";
import fs from "fs";
import path from "path";
jest.mock("react-redux", () => ({
  useSelector: (selector) =>
    selector({
      user: {
        user: {
          docId: "player",
          name: "Test Player",
          occupation: "Player",
          trainers: [],
          doctors: [],
        },
      },
    }),
  useDispatch: () => jest.fn(),
}));
jest.mock("../APIS/config", () => ({ auth: { signOut: jest.fn() } }));
jest.mock("../APIS", () => ({
  getUpdates: async () => [],
  getTournments: async () => [],
}));
test("dashboard renders empty states and creates optional local visual fixture", async () => {
  const { container } = render(
    <MemoryRouter initialEntries={["/player/dashboard"]}>
      <Dashboard />
    </MemoryRouter>,
  );
  await screen.findByText("No tournaments announced");
  if (process.env.SPMS_VISUAL_DIR) {
    fs.mkdirSync(process.env.SPMS_VISUAL_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(process.env.SPMS_VISUAL_DIR, "dashboard.html"),
      `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"/><style>${fs.readFileSync(require.resolve("bootstrap/dist/css/bootstrap.min.css"), "utf8")}\n${fs.readFileSync(path.join(process.cwd(), "src/App.css"), "utf8")}</style></head><body>${container.innerHTML}</body></html>`,
    );
  }
});
