import { createSlice } from "@reduxjs/toolkit";

export const systemVariableSlice = createSlice({
  name: "systemVariable",
  initialState: {
    moneyReceivedAfterVerifying: 50000,
  },
  reducers: {
    setSystemVariable: (state, action) => {
      state.moneyReceivedAfterVerifying =
        action.payload.moneyReceivedAfterVerifying;
    },
  },
});

export const { setSystemVariable } = systemVariableSlice.actions;

export const selectSystemVariable = (state) => state.systemVariable;

export default systemVariableSlice.reducer;
