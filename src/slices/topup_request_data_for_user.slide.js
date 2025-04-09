import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/user.service";

export const fetchTopupRequestDataForUser = createAsyncThunk("fetchTopupRequestDataForUser", async (params, { rejectWithValue }) => {
    try {
        const response = await userService.getTopupRequests();
        return response;
    } catch (error) {
        let errorMessage = error?.response?.data?.message;
        if (errorMessage) {
            return rejectWithValue(errorMessage);
        }
        return rejectWithValue("Mất kết nối đến server.");
    }
});

export const topupRequestDataForUserSlice = createSlice({
    name: "topupRequestDataForUser",
    initialState: {
        isLoading: false,
        data: null,
        errorMessage: null,
    },
    reducers: {
        setTopupRequestDataForUser: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTopupRequestDataForUser.pending, (state, action) => {
            state.isLoading = true;
            console.log("fetchTopupRequestDataForUser.pending");
        });
        builder.addCase(fetchTopupRequestDataForUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            console.log("fetchTopupRequestDataForUser.fulfilled");
        });
        builder.addCase(fetchTopupRequestDataForUser.rejected, (state, action) => {
            state.isLoading = false;
            state.data = null;
            state.errorMessage = action.payload;
            console.log("fetchTopupRequestDataForUser.rejected: ", action.payload);
        });
    }
});

export const { setTopupRequestDataForUser } = topupRequestDataForUserSlice.actions;

export const selectTopupRequestDataForUser = (state) => state.topupRequestDataForUser;

export default topupRequestDataForUserSlice.reducer;
