import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import applicationService from "../services/application.service";

export const fetchApplications = createAsyncThunk("fetchApplications", async ({ searchTerm }, { rejectWithValue }) => {
    try {
        const response = await applicationService.getApplications(searchTerm);
        return response.data.data;
    } catch (error) {
        let errorMessage = error?.response?.data?.message;
        if (errorMessage) {
            return rejectWithValue(errorMessage);
        }
        return rejectWithValue("Mất kết nối đến server.");
    }
});

export const applicationsSlice = createSlice({
    name: "applications",
    initialState: {
        isLoading: false,
        data: null,
        errorMessage: null,
    },
    reducers: {
        setApplications: (state, action) => {
            state.data = action.payload;
            console.log("setApplications: ", action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchApplications.pending, (state, action) => {
            state.isLoading = true;
            console.log("fetchApplications.pending");
        });
        builder.addCase(fetchApplications.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.errorMessage = null;
            console.log("fetchApplications.fulfilled: ", action.payload);
        });
        builder.addCase(fetchApplications.rejected, (state, action) => {
            state.isLoading = false;
            state.data = null;
            state.errorMessage = action.payload;
            console.log("fetchApplications.rejected: ", action.payload);
        });
    }
});

export const { setApplications } = applicationsSlice.actions;

export const selectApplications = (state) => state.applications;

export default applicationsSlice.reducer;