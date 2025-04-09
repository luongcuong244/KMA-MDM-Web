import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import moderatorPlayedTimeManagementService from "../services/moderator_played_time_management_service";

export const fetchPlayedTimeTableData = createAsyncThunk("fetchPlayedTimeTableData", async (params, { rejectWithValue }) => {
    try {
        const response = await moderatorPlayedTimeManagementService.getPlayedTime(params);
        return response;
    } catch (error) {
        let errorMessage = error?.response?.data?.message;
        if (errorMessage) {
            return rejectWithValue(errorMessage);
        }
        return rejectWithValue("Mất kết nối đến server.");
    }
});

export const playedTimeTableDataSlice = createSlice({
    name: "playedTimeTableData",
    initialState: {
        isLoading: false,
        data: null,
        errorMessage: null,
        date: new Date().getTime(),
        searchTerm: "",
    },
    reducers: {
        setPlayedTimeTableData: (state, action) => {
            state.data = action.payload;
        },
        setDate: (state, action) => {
            state.date = action.payload;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPlayedTimeTableData.pending, (state, action) => {
            state.isLoading = true;
            state.errorMessage = null;
        });
        builder.addCase(fetchPlayedTimeTableData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.errorMessage = null;
        });
        builder.addCase(fetchPlayedTimeTableData.rejected, (state, action) => {
            state.isLoading = false;
            state.data = null;
            state.errorMessage = action.payload;
        });
    }
});

export const { 
    setPlayedTimeTableData,
    setDate,
    setSearchTerm,
} = playedTimeTableDataSlice.actions;

export const selectPlayedTimeTableData = (state) => state.playedTimeTableData;

export default playedTimeTableDataSlice.reducer;
