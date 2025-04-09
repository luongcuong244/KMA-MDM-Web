import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import moderatorAccountManagementService from "../services/moderator_account_management.service";
import CONSTANT from "../utils/constant";

export const fetchUserTableData = createAsyncThunk("fetchUserTableData", async ({ pageNo, searchTerm }, { rejectWithValue }) => {
    try {
        const response = await moderatorAccountManagementService.getUsers(pageNo, CONSTANT.pageSize, searchTerm);
        return response;
    } catch (error) {
        let errorMessage = error?.response?.data?.message;
        if (errorMessage) {
            return rejectWithValue(errorMessage);
        }
        return rejectWithValue("Mất kết nối đến server.");
    }
});

export const userTableDataSlice = createSlice({
    name: "userTableData",
    initialState: {
        isLoading: false,
        data: null,
        errorMessage: null,
    },
    reducers: {
        setUserTableData: (state, action) => {
            state.data = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserTableData.pending, (state, action) => {
            state.isLoading = true;
            console.log("fetchUserTableData.pending");
        });
        builder.addCase(fetchUserTableData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            console.log("fetchUserTableData.fulfilled");
        });
        builder.addCase(fetchUserTableData.rejected, (state, action) => {
            state.isLoading = false;
            state.data = null;
            state.errorMessage = action.payload;
            console.log("fetchUserTableData.rejected: ", action.payload);
        });
    }
});

export const { setUserTableData } = userTableDataSlice.actions;

export const selectUserTableData = (state) => state.userTableData;

export default userTableDataSlice.reducer;
