import React, { useState, useRef } from "react";
import styles from "./account_management.module.scss";
import PagingTable from "../../../components/PagingTable";
import MenuPopup from "../../../components/MenuPopup";
import { IoIosSearch, IoMdPersonAdd } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import CreateUserDialog from "../../../parts/CreateUserDialog";
import TopupDialog from "../../../parts/TopupDialog";
import InputChecker from "../../../utils/input_checker";
import ChangePasswordDialog from "../../../parts/ChangePasswordDialog";
import BlockUserDialog from "../../../parts/BlockUserDialog";
import { fetchUserTableData, selectUserTableData } from "../../../slices/user_table_data.slice";
import moderator_account_managementService from "../../../services/moderator_account_management.service";

const AccountManagement = () => {

  const dispatch = useDispatch();

  const userTableData = useSelector(selectUserTableData);

  const [searchTerm, setSearchTerm] = useState(userTableData.data?.searchTerm ?? "");
  const inputRef = useRef(null);

  const [showCreateNewUserDialog, setShowCreateNewUserDialog] = useState(false);
  const [showTopupDialog, setShowTopupDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showBlockUserDialog, setShowBlockUserDialog] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const onNextPage = () => {
    const currentPage = userTableData.data?.currentPage;
    const totalPages = userTableData.data?.totalPages;
    if (currentPage && totalPages && currentPage < totalPages) {
      dispatch(fetchUserTableData(
        {
          pageNo: currentPage + 1,
          searchTerm,
        }
      ));
    }
  };

  const onPrevPage = () => {
    const currentPage = userTableData.data?.currentPage;
    if (currentPage && currentPage > 1) {
      dispatch(fetchUserTableData(
        {
          pageNo: currentPage - 1,
          searchTerm,
        }
      ));
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (InputChecker.isAlphanumeric(value)) {
      setSearchTerm(event.target.value.toUpperCase());
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputRef.current) {
      inputRef.current.blur();
    }

    if (userTableData.isLoading) {
      return;
    }

    dispatch(fetchUserTableData({
      pageNo: 1,
      searchTerm,
    }));
  };

  const refreshUserTableData = () => {
    dispatch(fetchUserTableData({
      pageNo: userTableData.data?.currentPage ?? 1,
      searchTerm,
    }));
  }

  return (
    <div id={styles.root}>
      <h1>Quản lý tài khoản</h1>
      <div className={styles.divider} />
      <span className={styles.actions}>
        <form onSubmit={handleSubmit} className={styles.searchBar}>
          <input
            ref={inputRef}
            className={styles.searchInput}
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={handleChange}
            disabled={userTableData.isLoading}
          />
          <div className={styles.searchIconBackground} onClick={handleSubmit}>
            <IoIosSearch size={20} />
          </div>
        </form>
        <div className={styles.addUserIconBackground} onClick={() => setShowCreateNewUserDialog(true)}>
          <IoMdPersonAdd size={20} />
        </div>
      </span>
      <div id={styles.tableStyle}>
        <PagingTable
          data={userTableData.data}
          isLoading={userTableData.isLoading}
          errorMessage={userTableData.errorMessage}
          onNextPage={onNextPage}
          onPrevPage={onPrevPage}
          renderPopup={(selectedItem, handleClosePopup) => {
            const menuButtons = [
              {
                icon: null,
                text: "Nạp tiền",
                onClick: () => {
                  setShowTopupDialog(true);
                  setSelectedUser(selectedItem);
                  handleClosePopup();
                },
              },
              {
                icon: null,
                text: "Đổi mật khẩu",
                onClick: () => {
                  setShowChangePasswordDialog(true);
                  setSelectedUser(selectedItem);
                  handleClosePopup();
                },
              },
              {
                icon: null,
                text: selectedItem.disabledSessionId >= 0 ? "Mở khoá tài khoản" : "Khóa tài khoản",
                onClick: () => {
                  if (selectedItem.disabledSessionId >= 0) {
                    // unblock user
                    moderator_account_managementService.unblockUser(selectedItem.userId)
                      .then(() => {
                        refreshUserTableData();
                      })
                      .catch((error) => {
                        let errorMessage = error?.response.data.message;
                        if (!errorMessage) {
                          errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại sau!";
                        }
                        alert(errorMessage);
                      })
                    handleClosePopup();
                    return;
                  }
                  setShowBlockUserDialog(true);
                  setSelectedUser(selectedItem);
                  handleClosePopup();
                },
              },
            ]

            return (
              <MenuPopup menuButtons={menuButtons} />
            );
          }}
        />
      </div>
      {
        showCreateNewUserDialog &&
        <CreateUserDialog setShowDialog={setShowCreateNewUserDialog} />
      }
      {
        showTopupDialog && selectedUser &&
        <TopupDialog setShowDialog={setShowTopupDialog} user={selectedUser} />
      }
      {
        showChangePasswordDialog && selectedUser &&
        <ChangePasswordDialog setShowDialog={setShowChangePasswordDialog} user={selectedUser} />
      }
      {
        showBlockUserDialog && selectedUser &&
        <BlockUserDialog 
          setShowDialog={setShowBlockUserDialog} 
          user={selectedUser}
          onSuccess={() => {
            refreshUserTableData();
          }}
        />
      }
    </div>
  );
};

export default AccountManagement;
