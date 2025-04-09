import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import moderatorDebtManagementService from "../services/moderator_debt_management_service";

export const dateFilterOptions = [
    {
        text: "Ngày nợ",
        value: "owedDate"
    },
    {
        text: "Ngày trả",
        value: "payDate"
    },
    {
        text: "Ngày nhập",
        value: "importedDate"
    }
]

export const debtStatus = [
    {
        text: "Chưa trả",
        value: "false",
    },
    {
        text: "Đã trả",
        value: "true",
    }
]
export const searchByOptions = [
    {
        text: "Người nợ",
        value: "debtor"
    },
    {
        text: "Người nhập",
        value: "creator"
    },
    {
        text: "Người thanh toán",
        value: "confirmedByUser"
    }
]

export const fetchDebtTableState = createAsyncThunk("fetchDebtTableState", async (params, { rejectWithValue }) => {
    try {
        const response = await moderatorDebtManagementService.getDebts(params);
        return response;
    } catch (error) {
        let errorMessage = error?.response?.data?.message;
        if (errorMessage) {
            return rejectWithValue(errorMessage);
        }
        return rejectWithValue("Mất kết nối đến server.");
    }
});

export const debtTableStateSlice = createSlice({
    name: "debtTableState",
    initialState: {
        isLoading: false,
        data: null,
        errorMessage: null,
        byDate: dateFilterOptions[0].value,
        startDate: new Date().getTime(),
        endDate: new Date().getTime(),
        isPaid: debtStatus[0].value,
        searchBy: searchByOptions[0].value,
        searchTerm: "",
    },
    reducers: {
        setDebtTableState: (state, action) => {
            state.data = action.payload;
        },
        setByDate: (state, action) => {
            state.byDate = action.payload;
        },
        setStartDate: (state, action) => {
            state.startDate = action.payload;
        },
        setEndDate: (state, action) => {
            state.endDate = action.payload;
        },
        setIsPaid: (state, action) => {
            state.isPaid = action.payload;
        },
        setSearchBy: (state, action) => {
            state.searchBy = action.payload;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchDebtTableState.pending, (state, action) => {
            state.isLoading = true;
            console.log("fetchDebtTableState.pending");
        });
        builder.addCase(fetchDebtTableState.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            console.log("fetchDebtTableState.fulfilled");
        });
        builder.addCase(fetchDebtTableState.rejected, (state, action) => {
            state.isLoading = false;
            state.data = null;
            state.errorMessage = action.payload;
            console.log("fetchDebtTableState.rejected: ", action.payload);
        });
    }
});

export const { 
    setDebtTableState,
    setByDate,
    setStartDate,
    setEndDate,
    setIsPaid,
    setSearchBy,
    setSearchTerm,
} = debtTableStateSlice.actions;

export const selectDebtTableState = (state) => state.debtTableState;

export default debtTableStateSlice.reducer;
