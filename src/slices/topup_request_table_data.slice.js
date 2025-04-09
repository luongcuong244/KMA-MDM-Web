import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import moderatorTopupRequestManagementService from "../services/moderator_topup_request_management_service";
import CONSTANT from "../utils/constant";

export const fetchTopupRequestTableData = createAsyncThunk("fetchTopupRequestTableData", async ({ pageNo, searchTerm }, { rejectWithValue }) => {
    try {
        const response = await moderatorTopupRequestManagementService.getTopupRequests(pageNo, CONSTANT.pageSize, searchTerm);
        return response;
    } catch (error) {
        let errorMessage = error?.response?.data?.message;
        if (errorMessage) {
            return rejectWithValue(errorMessage);
        }
        return rejectWithValue("Mất kết nối đến server.");
    }
});

export const topupRequestTableDataSlice = createSlice({
    name: "topupRequestTableData",
    initialState: {
        isLoading: false,
        data: null,
        errorMessage: null,
    },
    reducers: {
        setTopupRequestTableData: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTopupRequestTableData.pending, (state, action) => {
            state.isLoading = true;
            console.log("fetchTopupRequestTableData.pending");
        });
        builder.addCase(fetchTopupRequestTableData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            console.log("fetchTopupRequestTableData.fulfilled");
        });
        builder.addCase(fetchTopupRequestTableData.rejected, (state, action) => {
            state.isLoading = false;
            state.data = null;
            state.errorMessage = action.payload;
            console.log("fetchTopupRequestTableData.rejected: ", action.payload);
        });
    }
});

export const { setTopupRequestTableData } = topupRequestTableDataSlice.actions;

export const selectTopupRequestTableData = (state) => state.topupRequestTableData;

export default topupRequestTableDataSlice.reducer;
