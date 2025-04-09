import React, { useState, useRef } from "react";
import styles from "./waiting_topup_request.module.scss";
import { IoIosSearch } from "react-icons/io";
import InputChecker from "../../../../utils/input_checker";
import { ReactComponent as IconArrowLeft } from "../../../../assets/icons/ic_arrow_left.svg";
import { ReactComponent as IconArrowRight } from "../../../../assets/icons/ic_arrow_right.svg";
import RejectTopupRequestDialog from "../../../../parts/RejectTopupRequestDialog";
import ApproveTopupRequestDialog from "../../../../parts/ApproveTopupRequestDialog";
import { useDispatch } from "react-redux";
import { fetchTopupRequestTableData, selectTopupRequestTableData } from "../../../../slices/topup_request_table_data.slice";
import { useSelector } from "react-redux";
import Loader from "../../../../components/Loader";
import Converter from "../../../../utils/converter";

const WaitingTopupRequest = () => {

    const dispatch = useDispatch();

    const topupRequestTableData = useSelector(selectTopupRequestTableData);

    const [searchTerm, setSearchTerm] = useState("");

    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [showApproveDialog, setShowApproveDialog] = useState(false);

    const [selectedTopupRequests, setSelectedTopupRequests] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState(null);

    const inputRef = useRef(null);
    const tableRef = useRef(null);

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

        if (topupRequestTableData.isLoading) {
            return;
        }

        dispatch(fetchTopupRequestTableData({
            pageNo: 1,
            searchTerm,
        }));
    };

    const handleReject = (topupRequest, userName) => {
        setSelectedTopupRequests([topupRequest]);
        setSelectedUserName(userName);
        setShowRejectDialog(true);
    }

    const handleRejectAll = (topupRequests, userName) => {
        setSelectedTopupRequests(topupRequests);
        setSelectedUserName(userName);
        setShowRejectDialog(true);
    }

    const handleApprove = (topupRequest, userName) => {
        setSelectedTopupRequests([topupRequest]);
        setSelectedUserName(userName);
        setShowApproveDialog(true);
    }

    const handleApproveAll = (topupRequests, userName) => {
        setSelectedTopupRequests(topupRequests);
        setSelectedUserName(userName);
        setShowApproveDialog(true);
    }

    const onNextPage = () => {
        const currentPage = topupRequestTableData.data?.currentPage;
        const totalPages = topupRequestTableData.data?.totalPages;
        if (currentPage && totalPages && currentPage < totalPages) {
            dispatch(fetchTopupRequestTableData(
                {
                    pageNo: currentPage + 1,
                    searchTerm,
                }
            ));
        }
    };

    const onPrevPage = () => {
        const currentPage = topupRequestTableData.data?.currentPage;
        if (currentPage && currentPage > 1) {
            dispatch(fetchTopupRequestTableData(
                {
                    pageNo: currentPage - 1,
                    searchTerm,
                }
            ));
        }
    };

    return <div id={styles.root}>
        <form onSubmit={handleSubmit} className={styles.searchBar}>
            <input
                ref={inputRef}
                className={styles.searchInput}
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={handleChange}
                disabled={false}
            />
            <div className={styles.searchIconBackground} onClick={handleSubmit}>
                <IoIosSearch size={20} />
            </div>
        </form>
        {
            topupRequestTableData.data && (
                <div ref={tableRef} className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Tài khoản</th>
                                <th>Ngày yêu cầu</th>
                                <th>Số tiền</th>
                                <th>Tổng tiền</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                topupRequestTableData.data.data.map((group) => {

                                    const totalAmount = group.topupRequests.reduce((acc, item) => {
                                        return acc + item.amount.originalValue;
                                    }, 0);

                                    return <>
                                        {
                                            group.topupRequests.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        {
                                                            index == 0 && (
                                                                <td
                                                                    rowSpan={group.totalRequests}
                                                                    style={{ borderLeft: "none" }}
                                                                >
                                                                    {group.userName}
                                                                </td>
                                                            )
                                                        }
                                                        <td>{item.createdDate.formattedValue}</td>
                                                        <td>{item.amount.formattedValue}</td>
                                                        {
                                                            index == 0 && (
                                                                <td rowSpan={group.totalRequests} >{Converter.formatCurrency(totalAmount)}</td>
                                                            )
                                                        }
                                                        <td>
                                                            <button
                                                                className={styles.rejectButtonStyle}
                                                                onClick={() => handleReject(item, group.userName)}
                                                            >
                                                                Từ chối
                                                            </button>
                                                        </td>
                                                        {
                                                            index == 0 && (
                                                                <td rowSpan={group.totalRequests} >
                                                                    <button
                                                                        className={styles.approveAllButtonStyle}
                                                                        onClick={() => handleRejectAll(group.topupRequests, group.userName)}
                                                                    >
                                                                        Từ chối hết
                                                                    </button>
                                                                </td>
                                                            )
                                                        }
                                                        <td>
                                                            <button
                                                                className={styles.approveButtonStyle}
                                                                onClick={() => handleApprove(item, group.userName)}
                                                            >
                                                                Duyệt
                                                            </button>
                                                        </td>
                                                        {
                                                            index == 0 && (
                                                                <td rowSpan={group.totalRequests} >
                                                                    <button
                                                                        className={styles.approveAllButtonStyle}
                                                                        onClick={() => handleApproveAll(group.topupRequests, group.userName)}
                                                                    >
                                                                        Duyệt hết
                                                                    </button>
                                                                </td>
                                                            )
                                                        }
                                                    </tr>
                                                )
                                            })
                                        }
                                    </>
                                })
                            }
                        </tbody>
                    </table>
                </div>
            )
        }
        {
            topupRequestTableData.data && (
                <div className={styles.pagination}>
                    <IconArrowLeft
                        fill={topupRequestTableData.data.currentPage > 1 ? "#509BF5" : "#CDCDCD"}
                        style={topupRequestTableData.data.currentPage > 1 ? { cursor: "pointer" } : { cursor: "not-allowed" }}
                        className={styles.paginationButton}
                        onClick={onPrevPage}
                    />
                    <span>
                        {topupRequestTableData.data.currentPage} / {Math.max(topupRequestTableData.data.totalPages, 1)}
                    </span>
                    <IconArrowRight
                        fill={topupRequestTableData.data.currentPage < topupRequestTableData.data.totalPages ? "#509BF5" : "#CDCDCD"}
                        style={topupRequestTableData.data.currentPage < topupRequestTableData.data.totalPages ? { cursor: "pointer" } : { cursor: "not-allowed" }}
                        className={styles.paginationButton}
                        onClick={onNextPage}
                    />
                </div>
            )
        }
        {
            topupRequestTableData.isLoading && (
                <div className={styles.loading}>
                    <Loader color="#535353" width="45px" />
                    <span className={styles.loadingText} >Đang lấy dữ liệu...</span>
                </div>
            )
        }
        {
            topupRequestTableData.data && topupRequestTableData.data.data.length === 0 && (
                <span className={styles.noData}>Không có yêu cầu nào</span>
            )
        }
        {
            topupRequestTableData.errorMessage && (
                <div className={styles.error}>
                    {topupRequestTableData.errorMessage}
                </div>
            )
        }
        {
            showRejectDialog && selectedTopupRequests && selectedUserName && (
                <RejectTopupRequestDialog 
                    topupRequests={selectedTopupRequests} 
                    userName={selectedUserName}
                    setShowDialog={setShowRejectDialog} 
                    onSuccess={() => {}}
                />
            )
        }
        {
            showApproveDialog && selectedTopupRequests && selectedUserName && (
                <ApproveTopupRequestDialog
                    topupRequests={selectedTopupRequests}
                    userName={selectedUserName}
                    setShowDialog={setShowApproveDialog}
                    onSuccess={() => { }}
                />
            )
        }
    </div>;
};

export default WaitingTopupRequest;

// const sampleData = {
//     currentPage: 1,
//     totalPages: 2,
//     totalElements: 2,
//     data: [
//         {
//             userName: "CUONG",
//             totalRequests: 2,
//             topupRequests: [
//                 {
//                     id: {
//                         formattedValue: "1",
//                         originalValue: 1,
//                     },
//                     amount: {
//                         formattedValue: "100.000",
//                         originalValue: 100000,
//                     },
//                     createdDate: {
//                         formattedValue: "29-12-2023, 10:55",
//                         originalValue: new Date().getTime(),
//                     }
//                 },
//                 {
//                     id: {
//                         formattedValue: "2",
//                         originalValue: 2,
//                     },
//                     amount: {
//                         formattedValue: "100.000",
//                         originalValue: 100000,
//                     },
//                     createdDate: {
//                         formattedValue: "29-12-2023, 10:35",
//                         originalValue: new Date().getTime(),
//                     },
//                 },
//             ]
//         },
//         {
//             userName: "TEST",
//             totalRequests: 1,
//             topupRequests: [
//                 {
//                     id: {
//                         formattedValue: "1",
//                         originalValue: 1,
//                     },
//                     amount: {
//                         formattedValue: "60.000",
//                         originalValue: 60000,
//                     },
//                     createdDate: {
//                         formattedValue: "29-12-2023, 10:55",
//                         originalValue: new Date().getTime(),
//                     },
//                 },
//             ]
//         },
//         {
//             userName: "TEST2",
//             totalRequests: 4,
//             topupRequests: [
//                 {
//                     id: {
//                         formattedValue: "1",
//                         originalValue: 1,
//                     },
//                     amount: {
//                         formattedValue: "60.000",
//                         originalValue: 60000,
//                     },
//                     createdDate: {
//                         formattedValue: "29-12-2023, 10:55",
//                         originalValue: new Date().getTime(),
//                     },
//                 },
//                 {
//                     id: {
//                         formattedValue: "1",
//                         originalValue: 1,
//                     },
//                     amount: {
//                         formattedValue: "60.000",
//                         originalValue: 60000,
//                     },
//                     createdDate: {
//                         formattedValue: "29-12-2023, 10:55",
//                         originalValue: new Date().getTime(),
//                     },
//                 },
//                 {
//                     id: {
//                         formattedValue: "1",
//                         originalValue: 1,
//                     },
//                     amount: {
//                         formattedValue: "60.000",
//                         originalValue: 60000,
//                     },
//                     createdDate: {
//                         formattedValue: "29-12-2023, 10:55",
//                         originalValue: new Date().getTime(),
//                     },
//                 },
//                 {
//                     id: {
//                         formattedValue: "1",
//                         originalValue: 1,
//                     },
//                     amount: {
//                         formattedValue: "60.000",
//                         originalValue: 60000,
//                     },
//                     createdDate: {
//                         formattedValue: "29-12-2023, 10:55",
//                         originalValue: new Date().getTime(),
//                     },
//                 },
//             ]
//         },
//     ]
// }