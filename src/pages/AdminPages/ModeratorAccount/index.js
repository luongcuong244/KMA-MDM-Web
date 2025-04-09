import React, { useState, useRef } from "react";
import styles from "./moderator_account.module.scss";
import PagingTable from "../../../components/PagingTable";
import MenuPopup from "../../../components/MenuPopup";
import { IoIosSearch, IoMdPersonAdd } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import InputChecker from "../../../utils/input_checker";
import { fetchModeratorAccountTableData, selectModeratorAccountTableData } from "../../../slices/moderator_account_table_data.slice";
import moderator_account_managementService from "../../../services/moderator_account_management.service";
import CreateModeratorDialog from "../../../parts/CreateModeratorDialog";
import ChangeModeratorPasswordDialog from "../../../parts/ChangeModeratorPasswordDialog";
import BlockModeratorDialog from "../../../parts/BlockModeratorDialog";
import ModeratorPermissionDialog from "../../../parts/ModeratorPermissionDialog";

const ModeratorAccount = () => {

    const dispatch = useDispatch();

    const moderatorAccountTableData = useSelector(selectModeratorAccountTableData);

    const [searchTerm, setSearchTerm] = useState(moderatorAccountTableData.data?.searchTerm ?? "");
    const inputRef = useRef(null);

    const [showCreateNewModeratorDialog, setShowCreateNewModeratorDialog] = useState(false);
    const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
    const [showBlockUserDialog, setShowBlockUserDialog] = useState(false);
    const [showModeratorPermissionDialog, setShowModeratorPermissionDialog] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    const onNextPage = () => {
        const currentPage = moderatorAccountTableData.data?.currentPage;
        const totalPages = moderatorAccountTableData.data?.totalPages;
        if (currentPage && totalPages && currentPage < totalPages) {
            dispatch(fetchModeratorAccountTableData(
                {
                    pageNo: currentPage + 1,
                    searchTerm,
                }
            ));
        }
    };

    const onPrevPage = () => {
        const currentPage = moderatorAccountTableData.data?.currentPage;
        if (currentPage && currentPage > 1) {
            dispatch(fetchModeratorAccountTableData(
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

        if (moderatorAccountTableData.isLoading) {
            return;
        }

        dispatch(fetchModeratorAccountTableData({
            pageNo: 1,
            searchTerm,
        }));
    };

    const refreshUserTableData = () => {
        dispatch(fetchModeratorAccountTableData({
            pageNo: moderatorAccountTableData.data?.currentPage ?? 1,
            searchTerm,
        }));
    }

    return (
        <div id={styles.root}>
            <h1>Quản lý nhân viên</h1>
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
                        disabled={moderatorAccountTableData.isLoading}
                    />
                    <div className={styles.searchIconBackground} onClick={handleSubmit}>
                        <IoIosSearch size={20} />
                    </div>
                </form>
                <div className={styles.addUserIconBackground} onClick={() => setShowCreateNewModeratorDialog(true)}>
                    <IoMdPersonAdd size={20} />
                </div>
            </span>
            <div id={styles.tableStyle}>
                <PagingTable
                    data={moderatorAccountTableData.data}
                    isLoading={moderatorAccountTableData.isLoading}
                    errorMessage={moderatorAccountTableData.errorMessage}
                    onNextPage={onNextPage}
                    onPrevPage={onPrevPage}
                    renderPopup={(selectedItem, handleClosePopup) => {
                        const menuButtons = [
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
                            {
                                icon: null,
                                text: "Cấp quyền",
                                onClick: () => {
                                    setShowModeratorPermissionDialog(true);
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
                showCreateNewModeratorDialog &&
                <CreateModeratorDialog setShowDialog={setShowCreateNewModeratorDialog} />
            }
            {
                showChangePasswordDialog && selectedUser &&
                <ChangeModeratorPasswordDialog setShowDialog={setShowChangePasswordDialog} user={selectedUser} />
            }
            {
                showBlockUserDialog && selectedUser &&
                <BlockModeratorDialog
                    setShowDialog={setShowBlockUserDialog}
                    user={selectedUser}
                    onSuccess={() => {
                        refreshUserTableData();
                    }}
                />
            }
            {
                showModeratorPermissionDialog && selectedUser &&
                <ModeratorPermissionDialog setShowDialog={setShowModeratorPermissionDialog} user={selectedUser} />
            }
        </div>
    );
};

export default ModeratorAccount;
