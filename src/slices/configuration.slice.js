import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import configurationService from "../services/configuration.service";

export const fetchConfigurations = createAsyncThunk("fetchConfigurations", async ({ searchTerm }, { rejectWithValue }) => {
    try {
        const response = await configurationService.getConfigurations(searchTerm);
        return response.data.data;
    } catch (error) {
        let errorMessage = error?.response?.data?.message;
        if (errorMessage) {
            return rejectWithValue(errorMessage);
        }
        return rejectWithValue("Mất kết nối đến server.");
    }
});

export const configurationsSlice = createSlice({
    name: "configurations",
    initialState: {
        isLoading: false,
        data: null,
        errorMessage: null,
    },
    reducers: {
        setConfigurations: (state, action) => {
            state.data = action.payload;
            console.log("setConfigurations: ", action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchConfigurations.pending, (state, action) => {
            state.isLoading = true;
            console.log("fetchConfigurations.pending");
        });
        builder.addCase(fetchConfigurations.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.errorMessage = null;
            console.log("fetchConfigurations.fulfilled: ", action.payload);
        });
        builder.addCase(fetchConfigurations.rejected, (state, action) => {
            state.isLoading = false;
            state.data = null;
            state.errorMessage = action.payload;
            console.log("fetchConfigurations.rejected: ", action.payload);
        });
    }
});

export const { setConfigurations } = configurationsSlice.actions;

export const selectConfigurations = (state) => state.configurations;

export default configurationsSlice.reducer;