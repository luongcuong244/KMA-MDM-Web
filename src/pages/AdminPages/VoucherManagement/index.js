import React, { useState, useRef } from "react";
import styles from "./voucher_management.module.scss";
import PagingTable from "../../../components/PagingTable";
import MenuPopup from "../../../components/MenuPopup";
import { IoIosSearch, IoMdPersonAdd } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import InputChecker from "../../../utils/input_checker";
import { fetchVoucherTableData, selectVoucherTableData } from "../../../slices/voucher_table_data.slice";
import CreateVoucherDialog from "../../../parts/CreateVoucherDialog";

const VoucherManagement = () => {

    const dispatch = useDispatch();

    const voucherTableData = useSelector(selectVoucherTableData);

    const inputRef = useRef(null);

    const [showCreateVoucherDialog, setShowCreateVoucherDialog] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    const onNextPage = () => {
        const currentPage = voucherTableData.data?.currentPage;
        const totalPages = voucherTableData.data?.totalPages;
        if (currentPage && totalPages && currentPage < totalPages) {
            dispatch(fetchVoucherTableData(
                {
                    pageNo: currentPage + 1,
                }
            ));
        }
    };

    const onPrevPage = () => {
        const currentPage = voucherTableData.data?.currentPage;
        if (currentPage && currentPage > 1) {
            dispatch(fetchVoucherTableData(
                {
                    pageNo: currentPage - 1,
                }
            ));
        }
    };

    return (
        <div id={styles.root}>
            <h1>Quản lý voucher</h1>
            <div className={styles.divider} />
            <span className={styles.actions}>
                {/* <form onSubmit={handleSubmit} className={styles.searchBar}>
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
                </form> */}
                <div className={styles.addUserIconBackground} onClick={() => setShowCreateVoucherDialog(true)}>
                    <IoMdPersonAdd size={20} />
                </div>
            </span>
            <div id={styles.tableStyle}>
                <PagingTable
                    data={voucherTableData.data}
                    isLoading={voucherTableData.isLoading}
                    errorMessage={voucherTableData.errorMessage}
                    onNextPage={onNextPage}
                    onPrevPage={onPrevPage}
                    renderPopup={(selectedItem, handleClosePopup) => {
                        const menuButtons = [
                            {
                                icon: null,
                                text: "Sửa",
                                onClick: () => {
                                    // setShowChangePasswordDialog(true);
                                    // setSelectedUser(selectedItem);
                                    // handleClosePopup();
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
                showCreateVoucherDialog &&
                <CreateVoucherDialog setShowDialog={setShowCreateVoucherDialog} />
            }
        </div>
    );
};

export default VoucherManagement;
