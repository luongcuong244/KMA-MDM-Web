import React, { useEffect } from "react";
import styles from "./moderator.module.scss";
import PATH from "../../enums/path.enum";
import ManagementPageHeader from "../../parts/ManagementPageHeader";
import ManagementPageNavGenerator from "../../parts/ManagementPageNavGenerator";
import AccountManagement from "./AccountManagement";
import { ReactComponent as IconAccountManagement } from "../../assets/icons/tab_account_management_icon.svg";
import { ReactComponent as IconApprovalTopUpRequest } from "../../assets/icons/tab_topup_request_icon.svg";
import { ReactComponent as IconPlayedTime } from "../../assets/icons/tab_played_time_icon.svg";
import TopupRequest from "./TopupRequest";
import PlayedTime from "./PlayedTime";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTableData } from "../../slices/user_table_data.slice";
import { fetchTopupRequestHistoryTableState, setEndDate, setStartDate, selectTopupRequestHistoryTableState } from "../../slices/topup_history_table_data.slice";
import CONSTANT from "../../utils/constant";
import { fetchTopupRequestTableData } from "../../slices/topup_request_table_data.slice";
import { fetchPlayedTimeTableData } from "../../slices/played_time_data.slice";
import FreeAccountManagement from "./FreeAccountManagement";
import { fetchFreeAccountForModerator } from "../../slices/moderator_fetch_free_account.slice";

const ModeratorPages = () => {

  const dispatch = useDispatch();

  const topupRequestHistoryState = useSelector(selectTopupRequestHistoryTableState);

  useEffect(() => {

    // fetch mọi thứ ở đây

    // load user table data
    dispatch(fetchUserTableData({
      pageNo: 1,
      searchTerm: '',
    }));

    // load topup request table data
    dispatch(fetchTopupRequestTableData({
      pageNo: 1,
      searchTerm: '',
    }));

    // load topup history table data

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    dispatch(setStartDate(start.getTime()));

    const end = new Date();
    end.setHours(23, 59, 59, 999);
    dispatch(setEndDate(end.getTime()));


    const params = {
      startDate: start.getTime(),
      endDate: end.getTime(),
      status: topupRequestHistoryState.status,
      searchTerm: topupRequestHistoryState.searchTerm,
      searchBy: topupRequestHistoryState.searchBy,
      pageNo: 1,
      pageSize: CONSTANT.pageSize,
    }

    dispatch(fetchTopupRequestHistoryTableState(params))

    // load played time table data

    const playedTimeParams = {
      date: new Date().getTime(),
      searchTerm: '',
    }

    dispatch(fetchPlayedTimeTableData(playedTimeParams));

    // load free account for moderator
    const freeAccountParams = {
      date: new Date().getTime(),
    }

    dispatch(fetchFreeAccountForModerator(freeAccountParams));

  }, [])

  return (
    <div id={styles.root}>
      <ManagementPageHeader onClickSignOut={() => {}} />
      <ManagementPageNavGenerator
        parentRoute={PATH.moderator}
        activeIconColor={"#FFFFFF"}
        inactiveIconColor={"#919496"}
        routes={[
          {
            path: PATH.account_management,
            text: "Quản lý tài khoản",
            icon: IconAccountManagement,
            page: AccountManagement,
          },
          // {
          //   path: PATH.user_debt,
          //   text: "Nợ người dùng",
          //   icon: IconUserDebt,
          //   page: UserDebt,
          // },
          // {
          //   path: PATH.transaction_history_manager,
          //   text: "Lịch sử giao dịch",
          //   icon: IconTransactionHistory,
          //   page: UserDebt,
          // },
          {
            path: PATH.approval_topup_request,
            text: "Duyệt yêu cầu nạp tiền",
            icon: IconApprovalTopUpRequest,
            page: TopupRequest,
          },
          // {
          //   path: PATH.send_notification,
          //   text: "Gửi thông báo",
          //   icon: IconSendNotification,
          //   page: SendingNotification,
          // },
          // {
          //   path: PATH.view_feedback,
          //   text: "Xem góp ý",
          //   icon: IconViewFeedback,
          //   page: ViewFeedback,
          // },
          {
            path: PATH.played_time,
            text: "Thời gian chơi",
            icon: IconPlayedTime,
            page: PlayedTime,
          },
          {
            path: PATH.free_account_management,
            text: "Tài khoản miễn phí",
            icon: IconPlayedTime,
            page: FreeAccountManagement,
          },
        ]}
      />
    </div>
  );
};

export default ModeratorPages;
