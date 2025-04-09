import React, { useEffect } from "react";
import styles from "./admin.module.scss";
import PATH from "../../enums/path.enum";
import ManagementPageHeader from "../../parts/ManagementPageHeader";
import ManagementPageNavGenerator from "../../parts/ManagementPageNavGenerator";
import { ReactComponent as IconAccountManagement } from "../../assets/icons/tab_account_management_icon.svg";
import ModeratorAccount from "./ModeratorAccount";
import { fetchModeratorAccountTableData } from "../../slices/moderator_account_table_data.slice";
import { fetchVoucherTableData } from "../../slices/voucher_table_data.slice";
import { useDispatch } from "react-redux";
import VoucherManagement from "./VoucherManagement";
import HTRoadEventManagement from "./HTRoadEventManagement";

const AdminPages = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    // fetch mọi thứ ở đây

    // load user table data
    dispatch(fetchModeratorAccountTableData({
      pageNo: 1,
      searchTerm: '',
    }));

    dispatch(fetchVoucherTableData({
      pageNo: 1,
    }))

  }, []);

  return (
    <div id={styles.root}>
      <ManagementPageHeader onClickSignOut={() => { }} />
      <ManagementPageNavGenerator
        parentRoute={PATH.admin}
        activeIconColor={"#FFFFFF"}
        inactiveIconColor={"#919496"}
        routes={[
          {
            path: PATH.moderator_account_management,
            text: "Quản lý tài khoản",
            icon: IconAccountManagement,
            page: ModeratorAccount,
          },
          {
            path: PATH.voucher_management,
            text: "Quản lý voucher",
            icon: IconAccountManagement,
            page: VoucherManagement,
          },
          {
            path: PATH.ht_road_event,
            text: "Sự kiện HT Road",
            icon: IconAccountManagement,
            page: HTRoadEventManagement,
          },
        ]}
      />
    </div>
  );
};

export default AdminPages;
 