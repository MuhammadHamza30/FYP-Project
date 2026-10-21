import { createSlice } from "@reduxjs/toolkit";
import { readSession, publicUser, roleOf } from "../../utils/session";
const stored = publicUser(readSession("spms-user"));
const user = roleOf(stored) && stored?.docId ? stored : null;
if (user) sessionStorage.setItem("spms-user", JSON.stringify(user));
export const authSlice = createSlice({
  name: "user",
  initialState: { isAuthenticated: !!user, user },
  reducers: {
    authHandler: (state, action) => ({
      ...action.payload,
      user: publicUser(action.payload.user),
    }),
  },
});
export const { authHandler } = authSlice.actions;
export default authSlice.reducer;
