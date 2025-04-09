import { createSlice } from "@reduxjs/toolkit";

export const scrollableManagementSlice = createSlice({
    name: "scrollableManagement",
    initialState: {
        allowScrollOnRoadFrame: true,
        allowScrollOnMyItems: true,
        allowScrollOnTopupRequestPendingFrame: true,
    },
    reducers: {
        setAllowScrollOnRoadFrame: (state, action) => {
            state.allowScrollOnRoadFrame = action.payload;
        },
        setAllowScrollOnMyItems: (state, action) => {
            state.allowScrollOnMyItems = action.payload;
        },
        setAllowScrollOnTopupRequestPendingFrame: (state, action) => {
            state.allowScrollOnTopupRequestPendingFrame = action.payload;
        },
    },
});

export const {
    setAllowScrollOnRoadFrame,
    setAllowScrollOnMyItems,
    setAllowScrollOnTopupRequestPendingFrame
} = scrollableManagementSlice.actions;

export const selectScrollableManagement = (state) => state.scrollableManagement;

export default scrollableManagementSlice.reducer;
