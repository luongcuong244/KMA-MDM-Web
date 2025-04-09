import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import guestFreeAccount from "../services/guest_free_account.service";

export const fetchFreeAccountForGuest = createAsyncThunk("fetchFreeAccountForGuest", async (params, { rejectWithValue }) => {
    try {
        const response = await guestFreeAccount.getFreeAccount();
        return response;
    } catch (error) {
        let errorMessage = error?.response?.data?.message;
        if (errorMessage) {
            return rejectWithValue(errorMessage);
        }
        return rejectWithValue("Mất kết nối đến server.");
    }
});

export const freeAccountForGuestSlice = createSlice({
    name: "freeAccountForGuest",
    initialState: {
        isLoading: false,
        data: null,
        errorMessage: null,
    },
    reducers: {
        setFreeAccountForGuest: (state, action) => {
            state.data = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFreeAccountForGuest.pending, (state, action) => {
            state.isLoading = true;
            state.data = null;
            state.errorMessage = null;
        });
        builder.addCase(fetchFreeAccountForGuest.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.errorMessage = null;
        });
        builder.addCase(fetchFreeAccountForGuest.rejected, (state, action) => {
            state.isLoading = false;
            state.data = null;
            state.errorMessage = action.payload;
        });
    }
});

export const { setFreeAccountForGuest } = freeAccountForGuestSlice.actions;

export const selectFreeAccountForGuest = (state) => state.freeAccountForGuest;

export default freeAccountForGuestSlice.reducer;
