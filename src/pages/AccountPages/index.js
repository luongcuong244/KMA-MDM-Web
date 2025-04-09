import React from "react";
import styles from "./account.module.scss";
import ManagementPageHeader from "../../parts/ManagementPageHeader";
import ManagementPageNavGenerator from "../../parts/ManagementPageNavGenerator";
import PATH from "../../enums/path.enum";
import { ReactComponent as IconAccountInfo } from "../../assets/icons/tab_account_info_icon.svg";
import { ReactComponent as IconTransactionHistory } from "../../assets/icons/tab_transaction_history_icon.svg";
import { ReactComponent as IconDebtDetail } from "../../assets/icons/tab_debt_details_icon.svg";
import { ReactComponent as IconChangePassword } from "../../assets/icons/tab_changing_password_icon.svg";
import { ReactComponent as IconFeedback } from "../../assets/icons/tab_feedback_icon.svg";
import AccountInfo from "./AccountInfo";
import TransactionHistory from "./TransactionHistory";
import DebtDetail from "./DebtDetail";
import ChangePassword from "./ChangePassword";
import SendFeedback from "./SendFeedback";

const AccountPages = () => {
  return (
    <div id={styles.root}>
      <ManagementPageHeader onClickSignOut={() => { }} />
      <ManagementPageNavGenerator
        parentRoute={PATH.account}
        activeIconColor={"#FFFFFF"}
        inactiveIconColor={"#919496"}
        routes={[
          {
            path: PATH.account_info,
            text: "Thông tin tài khoản",
            icon: IconAccountInfo,
            page: AccountInfo,
          },
          {
            path: PATH.transaction_history,
            text: "Lịch sử giao dịch",
            icon: IconTransactionHistory,
            page: TransactionHistory,
          },
          {
            path: PATH.debt_detail,
            text: "Chi tiết số nợ",
            icon: IconDebtDetail,
            page: DebtDetail,
          },
          {
            path: PATH.change_password,
            text: "Đổi mật khẩu",
            icon: IconChangePassword,
            page: ChangePassword,
          },
          {
            path: PATH.feedback,
            text: "Góp ý",
            icon: IconFeedback,
            page: SendFeedback,
          },
        ]}
      />
    </div>
  );
}

export default AccountPages;