import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/user.slice';
import systemVariableReducer from '../slices/system_variable.slice';
import modalAppearanceReducer from '../slices/modal_appearance.slice';
import userTableDataReducer from '../slices/user_table_data.slice';
import debtTableStateReducer from '../slices/debt_table_data.slice';
import scrollableManagementSlice from '../slices/scrollable_management.slice';
import topupRequestTableDataSlice from '../slices/topup_request_table_data.slice';
import topupHistoryTableDataSlice from '../slices/topup_history_table_data.slice';
import topupRequestDataForUserSlice from "../slices/topup_request_data_for_user.slide";
import playedTimeTableDataSlice from "../slices/played_time_data.slice";
import moderatorAccountTableDataSlice from "../slices/moderator_account_table_data.slice";
import voucherTableDataReducer from "../slices/voucher_table_data.slice";
import guestFreeAccountSlice from "../slices/guest_fetch_free_account.slice";
import freeAccountForModeratorSlice from "../slices/moderator_fetch_free_account.slice"; 

export const store = configureStore({
    reducer: {
        user: userReducer,
        systemVariable: systemVariableReducer,
        modalAppearance: modalAppearanceReducer,
        userTableData: userTableDataReducer,
        debtTableState: debtTableStateReducer,
        topupRequestTableData: topupRequestTableDataSlice,
        topupRequestHistoryTableState: topupHistoryTableDataSlice,
        scrollableManagement: scrollableManagementSlice,
        topupRequestDataForUser: topupRequestDataForUserSlice,
        playedTimeTableData: playedTimeTableDataSlice,
        moderatorAccountTableData: moderatorAccountTableDataSlice,
        voucherTableData: voucherTableDataReducer,
        freeAccountForGuest: guestFreeAccountSlice,
        freeAccountForModerator: freeAccountForModeratorSlice,
    },
});