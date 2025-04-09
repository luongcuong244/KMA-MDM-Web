import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminVoucherManagementService from "../services/admin_voucher_management.service";
import CONSTANT from "../utils/constant";

export const fetchVoucherTableData = createAsyncThunk("fetchVoucherTableData", async ({ pageNo }, { rejectWithValue }) => {
    try {
        const response = await adminVoucherManagementService.getVouchers(pageNo, CONSTANT.pageSize);
        return response;
    } catch (error) {
        let errorMessage = error?.response?.data?.message;
        if (errorMessage) {
            return rejectWithValue(errorMessage);
        }
        return rejectWithValue("Mất kết nối đến server.");
    }
});

export const voucherTableDataSlice = createSlice({
    name: "voucherTableData",
    initialState: {
        isLoading: false,
        data: null,
        errorMessage: null,
    },
    reducers: {
        setVoucherTableData: (state, action) => {
            state.data = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchVoucherTableData.pending, (state, action) => {
            state.isLoading = true;
            console.log("fetchVoucherTableData.pending");
        });
        builder.addCase(fetchVoucherTableData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            console.log("fetchVoucherTableData.fulfilled");
        });
        builder.addCase(fetchVoucherTableData.rejected, (state, action) => {
            state.isLoading = false;
            state.data = null;
            state.errorMessage = action.payload;
            console.log("fetchVoucherTableData.rejected: ", action.payload);
        });
    }
});

export const { setVoucherTableData } = voucherTableDataSlice.actions;

export const selectVoucherTableData = (state) => state.voucherTableData;

export default voucherTableDataSlice.reducer;
