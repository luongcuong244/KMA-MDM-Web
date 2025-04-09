import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import moderatorFreeAccountManagementService from "../services/moderator_free_account_management.service";

export const fetchFreeAccountForModerator = createAsyncThunk("fetchFreeAccountForModerator", async (params, { rejectWithValue }) => {
    try {
        const response = await moderatorFreeAccountManagementService.getFreeAccount(params);
        return response;
    } catch (error) {
        let errorMessage = error?.response?.data?.message;
        if (errorMessage) {
            return rejectWithValue(errorMessage);
        }
        return rejectWithValue("Mất kết nối đến server.");
    }
});

export const freeAccountForModeratorSlice = createSlice({
    name: "freeAccountForModerator",
    initialState: {
        isLoading: false,
        data: null,
        errorMessage: null,
        date: new Date().getTime(),
    },
    reducers: {
        setFreeAccountForModerator: (state, action) => {
            state.data = action.payload;
        },
        setDate: (state, action) => {
            state.date = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFreeAccountForModerator.pending, (state, action) => {
            state.isLoading = true;
            state.errorMessage = null;
        });
        builder.addCase(fetchFreeAccountForModerator.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.errorMessage = null;
        });
        builder.addCase(fetchFreeAccountForModerator.rejected, (state, action) => {
            state.isLoading = false;
            state.data = null;
            state.errorMessage = action.payload;
        });
    }
});

export const { 
    setFreeAccountForModerator,
    setDate,
} = freeAccountForModeratorSlice.actions;

export const selectFreeAccountForModerator = (state) => state.freeAccountForModerator;

export default freeAccountForModeratorSlice.reducer;
