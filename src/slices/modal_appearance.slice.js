import { createSlice } from "@reduxjs/toolkit";

export const modalAppearanceSlice = createSlice({
  name: "modalAppearance",
  initialState: {
    isSignOutDialogShowing: false,
    isBlockUserDialogShowing: false,
  },
  reducers: {
    setSignOutDialogShowing: (state, action) => {
      state.isSignOutDialogShowing = action.payload.isSignOutDialogShowing;
    },
    setBlockUserDialogShowing: (state, action) => {
      state.isBlockUserDialogShowing = action.payload.isBlockUserDialogShowing;
    },
  },
});

export const { 
  setSignOutDialogShowing,
  setBlockUserDialogShowing,
} = modalAppearanceSlice.actions;

export const selectModalAppearance = (state) => state.modalAppearance;

export default modalAppearanceSlice.reducer;