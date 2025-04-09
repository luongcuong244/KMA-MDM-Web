import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    _id: null,
    userName: null,
    role: null,
    isBlocked: false,
  },
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload?._id;
      state.userName = action.payload?.userName;
      state.role = action.payload?.role;
      state.isBlocked = action.payload?.isBlocked;
    },
  },
});

export const {
  setUser,
} = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
