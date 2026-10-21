import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { MainSidebar } from "../components/Sidebar";
jest.mock("../APIS/config", () => ({
  auth: { signOut: jest.fn().mockResolvedValue() },
}));
const storeFor = (user) =>
  configureStore({
    reducer: { user: (s = { isAuthenticated: !!user, user }) => s },
  });
const player = { docId: "player", name: "Test player", occupation: "Player" };
beforeEach(() => sessionStorage.clear());
function guard(user, role, path = "/private") {
  render(
    <Provider store={storeFor(user)}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<ProtectedRoute role={role} />}>
            <Route path="/private" element={<p>Protected content</p>} />
          </Route>
          <Route path="/login" element={<p>Login page</p>} />
          <Route path="/admin" element={<p>Admin sign in</p>} />
          <Route path="/player/dashboard" element={<p>Player home</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}
test("signed-out visitors are redirected to login", () => {
  guard(null, "player");
  expect(screen.getByText("Login page")).toBeInTheDocument();
});
test("wrong-role visitors are redirected to their own dashboard", () => {
  guard(player, "doctor");
  expect(screen.getByText("Player home")).toBeInTheDocument();
});
test("valid role can access its workspace", () => {
  guard(player, "player");
  expect(screen.getByText("Protected content")).toBeInTheDocument();
});
test("corrupt admin session does not grant access", () => {
  sessionStorage.setItem("spms-admin", "bad");
  guard(null, "admin");
  expect(screen.getByText("Admin sign in")).toBeInTheDocument();
});
test("navigation stays available and mobile menu closes after navigation", () => {
  render(
    <Provider store={storeFor(player)}>
      <MemoryRouter initialEntries={["/player/dashboard"]}>
        <MainSidebar>
          <p>Body</p>
        </MainSidebar>
      </MemoryRouter>
    </Provider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  expect(document.querySelector(".app-sidebar")).toHaveClass("is-open");
  fireEvent.click(screen.getByRole("link", { name: "Health data" }));
  expect(document.querySelector(".app-sidebar")).not.toHaveClass("is-open");
  expect(
    screen.getByRole("navigation", { name: "Workspace navigation" }),
  ).toBeInTheDocument();
});
