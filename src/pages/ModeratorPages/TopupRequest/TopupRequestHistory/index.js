import React from "react";
import styles from "./topup_request_history.module.scss";
import { useState, useRef } from "react";
import { IoMdRefresh, IoIosSearch } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { 
    selectTopupRequestHistoryTableState, 
    setStartDate, 
    setEndDate, 
    topupRequestStatus, 
    searchByOptions,
    setSearchTerm,
    setSearchBy,
    fetchTopupRequestHistoryTableState,
    setStatus,
} from "../../../../slices/topup_history_table_data.slice";
import DatePicker from "react-datepicker";
import InputChecker from "../../../../utils/input_checker";
import PagingTable from "../../../../components/PagingTable";
import CONSTANT from "../../../../utils/constant";

const TopupRequestHistory = () => {

    const [isSendingRequest, setIsSendingRequest] = useState(false);

    const isFilteringByRefresh = useRef(true);

    const dispatch = useDispatch();

    const topupRequestHistoryTableState = useSelector(selectTopupRequestHistoryTableState);

    const handleSelectStatusChange = (event) => {
        dispatch(setStatus(event.target.value));
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
        dispatch(setSearchTerm(""));
        const params = {
            startDate: topupRequestHistoryTableState.startDate,
            endDate: topupRequestHistoryTableState.endDate,
            status: topupRequestHistoryTableState.status,
            pageNo: 1,
            pageSize: CONSTANT.pageSize,
        }
        dispatch(fetchTopupRequestHistoryTableState(params));
    }

    const onClickSearch = () => {
        const params = {
            startDate: topupRequestHistoryTableState.startDate,
            endDate: topupRequestHistoryTableState.endDate,
            status: topupRequestHistoryTableState.status,
            searchTerm: topupRequestHistoryTableState.searchTerm,
            searchBy: topupRequestHistoryTableState.searchBy,
            pageNo: 1,
            pageSize: CONSTANT.pageSize,
        }
        dispatch(fetchTopupRequestHistoryTableState(params));
    }

    const onNextPage = () => {
        const currentPage = topupRequestHistoryTableState.data?.currentPage;
        const totalPages = topupRequestHistoryTableState.data?.totalPages;
        if (currentPage && totalPages && currentPage < totalPages) {
            const params = {
                startDate: topupRequestHistoryTableState.startDate,
                endDate: topupRequestHistoryTableState.endDate,
                status: topupRequestHistoryTableState.status,
                searchTerm: isFilteringByRefresh ? null : topupRequestHistoryTableState.searchTerm, // nếu là refresh thì không cần search term, search by
                searchBy: isFilteringByRefresh ? null : topupRequestHistoryTableState.searchBy,
                pageNo: currentPage + 1,
                pageSize: CONSTANT.pageSize,
            }
            dispatch(fetchTopupRequestHistoryTableState(params));
        }
    }

    const onPrevPage = () => {
        const currentPage = topupRequestHistoryTableState.data?.currentPage;
        if (currentPage && currentPage > 1) {
            const params = {
                startDate: topupRequestHistoryTableState.startDate,
                endDate: topupRequestHistoryTableState.endDate,
                status: topupRequestHistoryTableState.status,
                searchTerm: isFilteringByRefresh ? null : topupRequestHistoryTableState.searchTerm, // nếu là refresh thì không cần search term, search by
                searchBy: isFilteringByRefresh ? null : topupRequestHistoryTableState.searchBy,
                pageNo: currentPage - 1,
                pageSize: CONSTANT.pageSize,
            }
            dispatch(fetchTopupRequestHistoryTableState(params));
        }
    }

    return <div id={styles.root}>
        <div className={styles.filterRow}>
            <label>Từ</label>
            <div className={styles.inputWrapper}>
                <DatePicker
                    selected={new Date(topupRequestHistoryTableState.startDate)}
                    startOpen={false}
                    dateFormat="dd-MM-yyyy, HH:mm"
                    showTimeSelect
                    autoFocus={false}
                    onChange={(date) => {
                        if (date.getTime() > topupRequestHistoryTableState.endDate) return;
                        dispatch(setStartDate(date.getTime()));
                    }}
                    disabled={isSendingRequest}
                />
            </div>
            <label>Đến</label>
            <div className={styles.inputWrapper}>
                <DatePicker
                    selected={new Date(topupRequestHistoryTableState.endDate)}
                    startOpen={false}
                    dateFormat="dd-MM-yyyy, HH:mm"
                    showTimeSelect
                    autoFocus={false}
                    onChange={(date) => {
                        if (date.getTime() < topupRequestHistoryTableState.startDate) return;
                        dispatch(setEndDate(date.getTime()));
                    }}
                    disabled={isSendingRequest}
                />
            </div>
            <select
                name="status"
                onChange={handleSelectStatusChange}
                value={topupRequestHistoryTableState.status.toString()}
                disabled={isSendingRequest}
            >
                {
                    topupRequestStatus.map((option, index) => {
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
                value={topupRequestHistoryTableState.searchBy}
                disabled={isSendingRequest}
            >
                {
                    searchByOptions.map((option, index) => {
                        return <option key={index} value={option.value}>{option.text}</option>
                    })
                }
            </select>
            <input
                className={styles.searchInput}
                type="text"
                placeholder="Tìm kiếm..."
                value={topupRequestHistoryTableState.searchTerm}
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
                data={topupRequestHistoryTableState.data}
                isLoading={topupRequestHistoryTableState.isLoading}
                errorMessage={topupRequestHistoryTableState.errorMessage}
                onNextPage={onNextPage}
                onPrevPage={onPrevPage}
            />
        </div>
    </div>
};

export default TopupRequestHistory;