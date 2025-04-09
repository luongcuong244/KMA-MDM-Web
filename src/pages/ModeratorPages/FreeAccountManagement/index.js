import React, { useState } from "react";
import styles from "./free_account_management.module.scss";
import PagingTable from "../../../components/PagingTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchFreeAccountForModerator, selectFreeAccountForModerator, setDate } from "../../../slices/moderator_fetch_free_account.slice";
import DatePicker from "react-datepicker";
import { ReactComponent as IconArrowLeft } from "../../../assets/icons/ic_arrow_left.svg";
import { ReactComponent as IconArrowRight } from "../../../assets/icons/ic_arrow_right.svg";
import * as XLSX from 'xlsx';
import Converter from "../../../utils/converter";
import moderatorFreeAccountManagementService from "../../../services/moderator_free_account_management.service";
import * as moment from "moment";

const FreeAccountManagement = () => {

    const dispatch = useDispatch();

    const freeAccountTableData = useSelector(selectFreeAccountForModerator);

    const [predictionData, setPredictionData] = useState(null);
    const [isSendingRequest, setSendingRequest] = useState(false);

    const onDateChange = (date) => {
        dispatch(setDate(date.getTime()));

        dispatch(fetchFreeAccountForModerator({
            date: date.getTime()
        }));
    }

    const cancelChanges = () => {
        setPredictionData(null);
    }

    const updateChanges = () => {

        const requestBody = {
            date: freeAccountTableData.date,
            data: predictionData.rows.map((row) => {
                return {
                    accountName: row.accountName.originalValue,
                    password: row.password.originalValue,
                    timeToUseInMinutes: row.timeToUse.originalValue,
                    startTimeAllowedToLogin: row.startTimeAllowedToLogin.originalValue,
                    endTimeAllowedToLogin: row.endTimeAllowedToLogin.originalValue,
                }
            }),
        }

        setSendingRequest(true);
        moderatorFreeAccountManagementService.updateFreeAccount(requestBody)
            .then((res) => {
                alert("Cập nhật thành công");
                dispatch(fetchFreeAccountForModerator({
                    date: freeAccountTableData.date
                }));
            })
            .catch((error) => {
                const message = error?.response?.data?.message;
                if (message) {
                    alert(message);
                } else {
                    alert("Cập nhật thất bại!")
                }
            })
            .finally(() => {
                setSendingRequest(false);
                setPredictionData(null);
            });
    }

    const handleExcelFileUpload = (event) => {
        try {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });

                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    const formattedDate = moment(freeAccountTableData.date).format("DD-MM-YYYY");

                    const tableData = {
                        header: [
                            {
                                hidden: false,
                                name: "Tài khoản",
                            },
                            {
                                hidden: false,
                                name: "Mật khẩu",
                            },
                            {
                                hidden: false,
                                name: "Số giờ chơi",
                            },
                            {
                                hidden: false,
                                name: "Bắt đầu đăng nhập",
                            },
                            {
                                hidden: false,
                                name: "Kết thúc đăng nhập",
                            },
                        ],
                        rows: [

                        ],
                    }

                    for (let i = 0; i < excelData.length; i++) {
                        const row = excelData[i];

                        if (row.length != 6) {
                            continue;
                        }

                        const regex = /^[a-zA-Z0-9]+$/g;
                        if (row[0].isEmpty || regex.test(row[0]) === false) {
                            alert(`Dòng ${i + 1}, tài khoản không được chứa ký tự đặc biệt`);
                            return;
                        }

                        // Check date
                        const date = row[5];
                        if (date !== formattedDate) {
                            alert(`Dòng ${i + 1} không đúng ngày, ngày phải là ${formattedDate}`);
                            return;
                        }

                        const startTime = Converter.convertPlayedTimeFormationToTimestamp(row[5], row[3]);
                        const endTime = Converter.convertPlayedTimeFormationToTimestamp(row[5], row[4]);

                        if (!startTime || !endTime) {
                            alert(`Dòng ${i + 1} không đúng định dạng thời gian`);
                            return;
                        }

                        if (startTime >= endTime) {
                            alert(`Dòng ${i + 1} thời gian bắt đầu phải nhỏ hơn thời gian kết thúc`);
                            return;
                        }

                        const timeToUseInMinutes = parseInt(row[2]);

                        if (!timeToUseInMinutes) {
                            alert(`Dòng ${i + 1} không đúng định dạng thời gian`);
                            return;
                        }

                        if (timeToUseInMinutes <= 0) {
                            alert(`Dòng ${i + 1} thời gian phải lớn hơn 0`);
                            return
                        }

                        let timeToUseFormatted = "";
                        const decimalTime = (timeToUseInMinutes / 60).toFixed(1);

                        if (decimalTime.endsWith('.0')) {
                            timeToUseFormatted = parseInt(decimalTime) + " giờ";
                        } else {
                            timeToUseFormatted = decimalTime + " giờ";
                        }

                        tableData.rows.push({
                            accountName: {
                                formattedValue: row[0].toUpperCase(),
                                originalValue: row[0].toUpperCase(),
                            },
                            password: {
                                formattedValue: row[1],
                                originalValue: row[1],
                            },
                            timeToUse: {
                                formattedValue: timeToUseFormatted,
                                originalValue: timeToUseInMinutes,
                            },
                            startTimeAllowedToLogin: {
                                formattedValue: row[3],
                                originalValue: startTime,
                            },
                            endTimeAllowedToLogin: {
                                formattedValue: row[4],
                                originalValue: endTime,
                            },
                        });
                    }

                    setPredictionData(tableData);
                } catch (error) {
                    alert("File không đúng định dạng");
                }
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {

        }

        setTimeout(() => {
            event.target.value = null;
        }, 100);
    }

    const onPrevDate = () => {

        if (isSendingRequest) {
            return;
        }

        if (predictionData) {
            if (window.confirm("Dữ liệu chưa được lưu, bạn có muốn tiếp tục?") === false) {
                return;
            } else {
                setPredictionData(null);
            }
        }

        const timestamp = freeAccountTableData.date;
        const date = new Date(timestamp);
        date.setDate(date.getDate() - 1);
        dispatch(setDate(date.getTime()));

        dispatch(fetchFreeAccountForModerator({
            date: date.getTime()
        }));
    }

    const onNextDate = () => {

        if (isSendingRequest) {
            return;
        }

        if (predictionData) {
            if (window.confirm("Dữ liệu chưa được lưu, bạn có muốn tiếp tục?") === false) {
                return;
            } else {
                setPredictionData(null);
            }
        }

        const timestamp = freeAccountTableData.date;
        const date = new Date(timestamp);
        date.setDate(date.getDate() + 1);
        dispatch(setDate(date.getTime()));

        dispatch(fetchFreeAccountForModerator({
            date: date.getTime()
        }));
    }

    return (
        <div id={styles.root}>
            <h1>Tài khoản miễn phí</h1>
            <div className={styles.divider} />
            <span className={styles.actions}>
                <div className={styles.topLeftPanel}>
                    <div className={styles.dateWrapper}>
                        <IconArrowLeft
                            fill={"#509BF5"}
                            className={styles.arrowButton}
                            onClick={onPrevDate}
                        />
                        <div className={styles.inputWrapper}>
                            <DatePicker
                                selected={freeAccountTableData.date}
                                startOpen={false}
                                dateFormat="dd-MM-yyyy"
                                autoFocus={false}
                                onChange={onDateChange}
                                disabled={isSendingRequest}
                            />
                        </div>
                        <IconArrowRight
                            fill={"#509BF5"}
                            className={styles.arrowButton}
                            onClick={onNextDate}
                        />
                    </div>
                </div>
                <input
                    type="file"
                    onChange={handleExcelFileUpload}
                    className={styles.uploadButton}
                />
            </span>
            <div id={styles.tableStyle}>
                <PagingTable
                    data={predictionData ? predictionData : freeAccountTableData.data}
                    isLoading={predictionData ? false : freeAccountTableData.isLoading}
                    errorMessage={predictionData ? "" : freeAccountTableData.errorMessage}
                    turnOnPagingMode={false}
                />
            </div>
            <div className={styles.bottomPanel}>
                {
                    (predictionData || freeAccountTableData.data) &&
                    <span className={styles.totalElement}>{`Số hàng: ${predictionData ? predictionData.rows.length : freeAccountTableData.data.rows.length}`}</span>
                }
                {
                    predictionData &&
                    <div className={styles.bottomButtons}>
                        <button
                            className={styles.cancelButton}
                            onClick={cancelChanges}
                            disabled={isSendingRequest}
                        >
                            Hủy
                        </button>
                        <button
                            className={styles.updateButton}
                            onClick={updateChanges}
                            disabled={isSendingRequest}
                        >
                            Cập nhật
                        </button>
                    </div>
                }
            </div>
        </div>
    );
}

export default FreeAccountManagement;