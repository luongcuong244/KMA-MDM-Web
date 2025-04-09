import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import moderatorTopupRequestManagementService from "../services/moderator_topup_request_management_service";

export const topupRequestStatus = [
    {
        text: "Đã chấp nhận",
        value: "approved",
    },
    {
        text: "Đã từ chối",
        value: "rejected",
    }
]
export const searchByOptions = [
    {
        text: "Người dùng",
        value: "user"
    },
    {
        text: "Nhân viên thực hiện",
        value: "staff"
    },
]

export const fetchTopupRequestHistoryTableState = createAsyncThunk("fetchTopupRequestHistoryTableState", async (params, { rejectWithValue }) => {
    try {
        const response = await moderatorTopupRequestManagementService.getTopupRequestHistory(params);
        return response;
    } catch (error) {
        let errorMessage = error?.response?.data?.message;
        if (errorMessage) {
            return rejectWithValue(errorMessage);
        }
        return rejectWithValue("Mất kết nối đến server.");
    }
});

export const topupRequestHistoryTableStateSlice = createSlice({
    name: "topupRequestHistoryTableState",
    initialState: {
        isLoading: false,
        data: null,
        errorMessage: null,
        startDate: new Date().getTime(),
        endDate: new Date().getTime(),
        status: topupRequestStatus[0].value,
        searchBy: searchByOptions[0].value,
        searchTerm: "",
    },
    reducers: {
        setTopupRequestHistoryTableState: (state, action) => {
            state.data = action.payload;
        },
        setStartDate: (state, action) => {
            state.startDate = action.payload;
        },
        setEndDate: (state, action) => {
            state.endDate = action.payload;
        },
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        setSearchBy: (state, action) => {
            state.searchBy = action.payload;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTopupRequestHistoryTableState.pending, (state, action) => {
            state.isLoading = true;
            console.log("fetchTopupRequestHistoryTableState.pending");
        });
        builder.addCase(fetchTopupRequestHistoryTableState.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            console.log("fetchTopupRequestHistoryTableState.fulfilled");
        });
        builder.addCase(fetchTopupRequestHistoryTableState.rejected, (state, action) => {
            state.isLoading = false;
            state.data = null;
            state.errorMessage = action.payload;
            console.log("fetchTopupRequestHistoryTableState.rejected: ", action.payload);
        });
    }
});

export const { 
    setTopupRequestHistoryTableState,
    setByDate,
    setStartDate,
    setEndDate,
    setStatus,
    setSearchBy,
    setSearchTerm,
} = topupRequestHistoryTableStateSlice.actions;

export const selectTopupRequestHistoryTableState = (state) => state.topupRequestHistoryTableState;

export default topupRequestHistoryTableStateSlice.reducer;
