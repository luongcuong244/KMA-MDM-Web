import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminAccountManagementService from "../services/admin_account_management.service";
import CONSTANT from "../utils/constant";

export const fetchModeratorAccountTableData = createAsyncThunk("fetchModeratorAccountTableData", async ({ pageNo, searchTerm }, { rejectWithValue }) => {
    try {
        const response = await adminAccountManagementService.getUsers(pageNo, CONSTANT.pageSize, searchTerm);
        return response;
    } catch (error) {
        let errorMessage = error?.response?.data?.message;
        if (errorMessage) {
            return rejectWithValue(errorMessage);
        }
        return rejectWithValue("Mất kết nối đến server.");
    }
});

export const moderatorAccountTableDataSlice = createSlice({
    name: "moderatorAccountTableData",
    initialState: {
        isLoading: false,
        data: null,
        errorMessage: null,
    },
    reducers: {
        setModeratorAccountTableData: (state, action) => {
            state.data = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchModeratorAccountTableData.pending, (state, action) => {
            state.isLoading = true;
            console.log("fetchModeratorAccountTableData.pending");
        });
        builder.addCase(fetchModeratorAccountTableData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            console.log("fetchModeratorAccountTableData.fulfilled");
        });
        builder.addCase(fetchModeratorAccountTableData.rejected, (state, action) => {
            state.isLoading = false;
            state.data = null;
            state.errorMessage = action.payload;
            console.log("fetchModeratorAccountTableData.rejected: ", action.payload);
        });
    }
});

export const { setModeratorAccountTableData } = moderatorAccountTableDataSlice.actions;

export const selectModeratorAccountTableData = (state) => state.moderatorAccountTableData;

export default moderatorAccountTableDataSlice.reducer;
