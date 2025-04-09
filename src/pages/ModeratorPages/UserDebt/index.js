import React, { useState, useRef } from "react";
import styles from "./user_debt.module.scss";
import DatePicker from "react-datepicker";
import { IoMdRefresh, IoIosSearch } from "react-icons/io";
import { dateFilterOptions, debtStatus, searchByOptions } from "../../../slices/debt_table_data.slice";
import { useDispatch, useSelector } from "react-redux";
import { selectDebtTableState, setByDate, setIsPaid, setStartDate, setEndDate, setSearchBy, setSearchTerm, fetchDebtTableState } from "../../../slices/debt_table_data.slice";
import PagingTable from "../../../components/PagingTable";
import InputChecker from "../../../utils/input_checker";
import CONSTANT from "../../../utils/constant";
import MenuPopup from "../../../components/MenuPopup";
import moderatorDebtManagementService from "../../../services/moderator_debt_management_service";
import EditDebtDialog from "../../../parts/EditDebtDialog";

const UserDebt = () => {

    const [isSendingRequest, setIsSendingRequest] = useState(false);
    const [showEditDebtDialog, setShowEditDebtDialog] = useState(false);

    const [selectedDebt, setSelectedDebt] = useState(null);

    const isFilteringByRefresh = useRef(true);

    const dispatch = useDispatch();

    const debtTableState = useSelector(selectDebtTableState);

    const handleSelectDateChange = (event) => {
        dispatch(setByDate(event.target.value));
    };

    const handleSelectStatusChange = (event) => {
        dispatch(setIsPaid(event.target.value === "true"));
    }

    const handleSelectSearchByChange = (event) => {
        dispatch(setSearchBy(event.target.value));
    }

    const handleSearchTermChange = (event) => {
        const value = event.target.value;
        if (InputChecker.isAlphanumeric(value)) {
            dispatch(setSearchTerm(value.toUpperCase()));
        }
    }

    const onClickRefresh = () => {
        if (!debtTableState.isPaid && debtTableState.byDate == "payDate") {
            alert("Không thể tìm kiếm theo ngày trả khi chưa trả nợ!");
            return;
        }

        if (!debtTableState.isPaid && debtTableState.searchBy === "confirmedByUser") {
            alert("Không thể tìm kiếm theo người thanh toán khi chưa trả nợ!")
            return;
        }

        dispatch(setSearchTerm(""));

        const params = {
            byDate: debtTableState.byDate,
            startDate: debtTableState.startDate,
            endDate: debtTableState.endDate,
            isPaid: debtTableState.isPaid,
            pageNo: 1,
            pageSize: CONSTANT.pageSize,
        }
        dispatch(fetchDebtTableState(params));
    }

    const onClickSearch = () => {
        if (!debtTableState.isPaid && debtTableState.byDate == "payDate") {
            alert("Không thể tìm kiếm theo ngày trả khi chưa trả nợ!");
            return;
        }

        if (!debtTableState.isPaid && debtTableState.searchBy === "confirmedByUser") {
            alert("Không thể tìm kiếm theo người thanh toán khi chưa trả nợ!")
            return;
        }

        const params = {
            byDate: debtTableState.byDate,
            startDate: debtTableState.startDate,
            endDate: debtTableState.endDate,
            isPaid: debtTableState.isPaid,
            searchTerm: debtTableState.searchTerm,
            searchBy: debtTableState.searchBy,
            pageNo: 1,
            pageSize: CONSTANT.pageSize,
        }
        dispatch(fetchDebtTableState(params));
    }

    const onNextPage = () => {
        const currentPage = debtTableState.data?.currentPage;
        const totalPages = debtTableState.data?.totalPages;
        if (currentPage && totalPages && currentPage < totalPages) {
            const params = {
                byDate: debtTableState.byDate,
                startDate: debtTableState.startDate,
                endDate: debtTableState.endDate,
                isPaid: debtTableState.isPaid,
                searchTerm: isFilteringByRefresh ? null : debtTableState.searchTerm, // nếu là refresh thì không cần search term, search by
                searchBy: isFilteringByRefresh ? null : debtTableState.searchBy,
                pageNo: currentPage + 1,
                pageSize: CONSTANT.pageSize,
            }
            dispatch(fetchDebtTableState(params));
        }
    }

    const onPrevPage = () => {
        const currentPage = debtTableState.data?.currentPage;
        if (currentPage && currentPage > 1) {
            const params = {
                byDate: debtTableState.byDate,
                startDate: debtTableState.startDate,
                endDate: debtTableState.endDate,
                isPaid: debtTableState.isPaid,
                searchTerm: isFilteringByRefresh ? null : debtTableState.searchTerm, // nếu là refresh thì không cần search term, search by
                searchBy: isFilteringByRefresh ? null : debtTableState.searchBy,
                pageNo: currentPage - 1,
                pageSize: CONSTANT.pageSize,
            }
            dispatch(fetchDebtTableState(params));
        }
    }

    const deleteDebt = (debtId) => {
        setIsSendingRequest(true);
        moderatorDebtManagementService.deleteDebt(debtId)
            .then(() => {
                alert("Xóa nợ thành công!");
                onClickRefresh();
            })
            .catch((err) => {
                let errorMessage = err?.response.data.message;
                if (!errorMessage) {
                    errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại sau!";
                }
                alert(errorMessage);
            })
            .finally(() => {
                setIsSendingRequest(false);
            })
    }

    const restoreDebt = (debtId) => {
        setIsSendingRequest(true);
        moderatorDebtManagementService.restoreDebt(debtId)
            .then(() => {
                alert("Khôi phục nợ thành công!");
                onClickRefresh();
            })
            .catch((err) => {
                let errorMessage = err?.response.data.message;
                if (!errorMessage) {
                    errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại sau!";
                }
                alert(errorMessage);
            })
            .finally(() => {
                setIsSendingRequest(false);
            })
    }

    return <div id={styles.root}>
        <h1>Nợ người dùng</h1>
        <div className={styles.divider} />
        <div className={styles.filterRow}>
            <select 
                name="date" 
                onChange={handleSelectDateChange} 
                value={debtTableState.byDate}
                disabled={isSendingRequest}
            >
                {
                    dateFilterOptions
                        .map((option, index) => {
                            if (!debtTableState.isPaid && option.value === "payDate") {
                                if (debtTableState.byDate === "payDate") dispatch(setByDate(dateFilterOptions[0].value));
                                return;
                            }
                            return <option key={index} value={option.value}>{option.text}</option>
                        })
                }
            </select>
            <label>Từ</label>
            <div className={styles.inputWrapper}>
                <DatePicker
                    selected={new Date(debtTableState.startDate)}
                    startOpen={false}
                    dateFormat="dd-MM-yyyy, HH:mm"
                    showTimeSelect
                    autoFocus={false}
                    onChange={(date) => {
                        if (date.getTime() > debtTableState.endDate) return;
                        dispatch(setStartDate(date.getTime()));
                    }}
                    disabled={isSendingRequest}
                />
            </div>
            <label>Đến</label>
            <div className={styles.inputWrapper}>
                <DatePicker
                    selected={new Date(debtTableState.endDate)}
                    startOpen={false}
                    dateFormat="dd-MM-yyyy, HH:mm"
                    showTimeSelect
                    autoFocus={false}
                    onChange={(date) => {
                        if (date.getTime() < debtTableState.startDate) return;
                        dispatch(setEndDate(date.getTime()));
                    }}
                    disabled={isSendingRequest}
                />
            </div>
            <select 
                name="status" 
                onChange={handleSelectStatusChange} 
                value={debtTableState.isPaid.toString()}
                disabled={isSendingRequest}
            >
                {
                    debtStatus.map((option, index) => {
                        return <option key={index} value={option.value}>{option.text}</option>
                    })
                }
            </select>
            <div 
                className={styles.refreshIconBackground} 
                onClick={() => {
                    if (isSendingRequest) return;
                    onClickRefresh();
                }}
            >
                <IoMdRefresh size={20} />
            </div>
            <div style={{ height: "100%", width: 1, backgroundColor: "gray" }} />
            <select 
                name="searchBy" 
                onChange={handleSelectSearchByChange} 
                value={debtTableState.searchBy}
                disabled={isSendingRequest}
            >
                {
                    searchByOptions.map((option, index) => {
                        if (!debtTableState.isPaid && option.value === "confirmedByUser") {
                            if (debtTableState.searchBy === "confirmedByUser") dispatch(setSearchBy(searchByOptions[0].value));
                            return;
                        };
                        return <option key={index} value={option.value}>{option.text}</option>
                    })
                }
            </select>
            <input
                className={styles.searchInput}
                type="text"
                placeholder="Tìm kiếm..."
                value={debtTableState.searchTerm}
                onChange={handleSearchTermChange}
                disabled={isSendingRequest}
            />
            <div 
                className={styles.searchIconBackground} 
                onClick={() => {
                    if (isSendingRequest) return;
                    onClickSearch();
                }}
            >
                <IoIosSearch size={20} />
            </div>
            <div className={styles.divider} />
        </div>
        <div id={styles.tableStyle}>
            <PagingTable
                data={debtTableState.data}
                isLoading={debtTableState.isLoading}
                errorMessage={debtTableState.errorMessage}
                onNextPage={onNextPage}
                onPrevPage={onPrevPage}
                renderPopup={(selectedItem, handleClosePopup) => {
                    const isPaid = selectedItem.confirmedDate > 0;

                    const menuButtons = isPaid ? [
                        {
                            icon: null,
                            text: "Khôi phục nợ",
                            onClick: () => {
                                if (window.confirm("Bạn có chắc chắn khôi phục nợ này?") == true) {
                                    restoreDebt(selectedItem.debtId)
                                }
                                handleClosePopup();
                            },
                        },
                        {
                            icon: null,
                            text: "Xóa",
                            onClick: () => {
                                if (window.confirm("Bạn có chắc chắn muốn xóa nợ này?") == true) {
                                    deleteDebt(selectedItem.debtId)
                                }
                                handleClosePopup();
                            },
                        },
                    ] : [
                            {
                                icon: null,
                                text: "Sửa",
                                onClick: () => {
                                    setShowEditDebtDialog(true);
                                    setSelectedDebt(selectedItem);
                                    handleClosePopup();
                                },
                            },
                            {
                                icon: null,
                                text: "Xóa",
                                onClick: () => {
                                    if (window.confirm("Bạn có chắc chắn muốn xóa nợ này!") == true) {
                                        deleteDebt(selectedItem.debtId)
                                    }
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
            showEditDebtDialog && selectedDebt &&
            <EditDebtDialog setShowDialog={setShowEditDebtDialog} debt={selectedDebt} onUpdateSuccessfully={onClickRefresh} />
        }
    </div>
}

export default UserDebt;