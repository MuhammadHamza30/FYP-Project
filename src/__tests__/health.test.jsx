import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HealthData } from "../components/HealthData";
import { getUser } from "../APIS";
jest.mock("../APIS", () => ({ getUser: jest.fn() }));
jest.mock("react-redux", () => ({
  useSelector: (selector) => selector({ user: { user: { docId: "player" } } }),
}));
test("health date filtering works and clear restores the full history", async () => {
  getUser.mockResolvedValue({
    healthRecords: [
      { date: "2026-10-20", heartBeat: 70, steps: 1000, temperature: 98.6 },
      { date: "2026-10-21", heartBeat: 72, steps: 1200, temperature: 98.8 },
    ],
  });
  render(<HealthData />);
  await screen.findByText("2026-10-20");
  fireEvent.change(screen.getByLabelText("Filter by date"), {
    target: { value: "2026-10-21" },
  });
  expect(screen.queryByText("2026-10-20")).not.toBeInTheDocument();
  fireEvent.click(screen.getByText("Clear"));
  expect(screen.getByText("2026-10-20")).toBeInTheDocument();
});
test("missing health records show an honest empty state", async () => {
  getUser.mockResolvedValue({});
  render(<HealthData />);
  expect(
    await screen.findByText("No measurements recorded yet"),
  ).toBeInTheDocument();
  expect(screen.queryByText("8 Hour")).not.toBeInTheDocument();
});
