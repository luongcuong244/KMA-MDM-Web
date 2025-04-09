import React, { useEffect } from "react";
import styles from "./admin.module.scss";

const AdminPages = () => {
  return (
    <div id={styles.root}>
      {/* <ManagementPageHeader onClickSignOut={() => { }} />
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
      /> */}
    </div>
  );
};

export default AdminPages;
 