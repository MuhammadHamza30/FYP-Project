import { createSlice } from "@reduxjs/toolkit";
const user = sessionStorage.getItem("spms-user");
export const authSlice = createSlice({
  name: "user",
  initialState: {
    isAuthenticated: user ? true : false,
    user: user ? JSON.parse(user) : null,
  },
  reducers: {
    authHandler: (state, action) => {
      return action.payload;
    },
  },
});

export const { authHandler } = authSlice.actions;

export default authSlice.reducer;
