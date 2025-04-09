import React, { useState, useRef } from "react";
import styles from "./played_time.module.scss";
import PagingTable from "../../../components/PagingTable";
import { IoIosSearch } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import InputChecker from "../../../utils/input_checker";
import { fetchPlayedTimeTableData, selectPlayedTimeTableData, setDate, setSearchTerm } from "../../../slices/played_time_data.slice";
import DatePicker from "react-datepicker";
import { ReactComponent as IconArrowLeft } from "../../../assets/icons/ic_arrow_left.svg";
import { ReactComponent as IconArrowRight } from "../../../assets/icons/ic_arrow_right.svg";
import * as XLSX from 'xlsx';
import Converter from "../../../utils/converter";
import moderatorPlayedTimeManagementService from "../../../services/moderator_played_time_management_service";

const PlayedTime = () => {

    const dispatch = useDispatch();

    const playedTimeTableData = useSelector(selectPlayedTimeTableData);

    const [predictionData, setPredictionData] = useState(null);
    const [isSendingRequest, setSendingRequest] = useState(false);

    const inputRef = useRef(null);

    const handleChange = (event) => {
        const value = event.target.value;
        if (InputChecker.isAlphanumeric(value)) {
            dispatch(setSearchTerm(value.toUpperCase()));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputRef.current) {
            inputRef.current.blur();
        }

        if (playedTimeTableData.isLoading || isSendingRequest) {
            return;
        }

        dispatch(fetchPlayedTimeTableData({
            date: playedTimeTableData.date,
            searchTerm: playedTimeTableData.searchTerm,
        }));
    };

    const onDateChange = (date) => {
        dispatch(setDate(date.getTime()));

        dispatch(fetchPlayedTimeTableData({
            date: date.getTime(),
            searchTerm: playedTimeTableData.searchTerm,
        }));
    }

    const cancelChanges = () => {
        setPredictionData(null);
    }

    const updateChanges = () => {

        const requestBody = {
            date: playedTimeTableData.date,
            data: predictionData.rows.map((row) => {
                return {
                    computerName: row.computerName.originalValue,
                    userName: row.userName.originalValue,
                    startTime: row.date.originalValue,
                    playedTime: row.playedTime.originalValue,
                }
            }),
        }

        setSendingRequest(true);
        moderatorPlayedTimeManagementService.updatePlayedTime(requestBody)
            .then((res) => {
                alert("Cập nhật thành công");
                dispatch(fetchPlayedTimeTableData({
                    date: playedTimeTableData.date,
                    searchTerm: playedTimeTableData.searchTerm,
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

                    let lastTime = null;
                    let lastRow = null;
                    let isTimeOrderByAsc = null;
                    const formattedDate = Converter.formatDateToPlayedTimeFormation(playedTimeTableData.date);

                    const tableData = {
                        header: [
                            {
                                hidden: false,
                                name: "Máy",
                            },
                            {
                                hidden: false,
                                name: "Người dùng",
                            },
                            {
                                hidden: false,
                                name: "Ngày",
                            },
                            {
                                hidden: false,
                                name: "Thời gian",
                            },
                            {
                                hidden: false,
                                name: "Thời gian chơi",
                            },
                        ],
                        rows: [

                        ],
                    }

                    for (let i = 0; i < excelData.length; i++) {
                        const row = excelData[i];

                        if (row.length < 6) {
                            alert(`Dòng ${i + 1} không đủ thông tin, số cột phải > 5`);
                            return;
                        }

                        if (row[4] !== "Đang sử dụng") {
                            continue;
                        }

                        if (row[1].isEmpty || row[1].includes("-")) {
                            continue;
                        }

                        // Check date
                        const date = row[2];
                        if (date !== formattedDate) {
                            alert(`Dòng ${i + 1} không đúng ngày, ngày phải là ${formattedDate}`);
                            return;
                        }

                        const timeRow = Converter.convertPlayedTimeFormationToTimestamp(row[2], row[3]);

                        if (timeRow === null) {
                            alert(`Dòng ${i + 1} không đúng định dạng thời gian`);
                            return;
                        }

                        if (lastTime != null && isTimeOrderByAsc === null) {
                            isTimeOrderByAsc = lastTime < timeRow;
                        }

                        if (lastTime != null && lastRow != null && (isTimeOrderByAsc && lastTime > timeRow || !isTimeOrderByAsc && lastTime < timeRow)) {
                            alert(`Dòng ${lastRow + 1} không đúng thứ tự thời gian`);
                            return;
                        }

                        lastTime = timeRow;
                        lastRow = i;

                        const playedTime = row[5];
                        const playedTimeInMinutes = Converter.convertPlayedTimeToMinutes(playedTime);

                        if (playedTimeInMinutes === null) {
                            alert(`Dòng ${i + 1} không đúng định dạng thời gian chơi`);
                            return;
                        }

                        if (playedTimeInMinutes <= 0) {
                            continue;
                        }

                        tableData.rows.push({
                            computerName: {
                                formattedValue: row[0],
                                originalValue: row[0],
                            },
                            userName: {
                                formattedValue: row[1],
                                originalValue: row[1],
                            },
                            date: {
                                formattedValue: row[2],
                                originalValue: timeRow,
                            },
                            time: {
                                formattedValue: row[3],
                                originalValue: timeRow,
                            },
                            playedTime: {
                                formattedValue: playedTime,
                                originalValue: playedTimeInMinutes,
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

        const timestamp = playedTimeTableData.date;
        const date = new Date(timestamp);
        date.setDate(date.getDate() - 1);
        dispatch(setDate(date.getTime()));

        dispatch(fetchPlayedTimeTableData({
            date: date.getTime(),
            searchTerm: playedTimeTableData.searchTerm,
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

        const timestamp = playedTimeTableData.date;
        const date = new Date(timestamp);
        date.setDate(date.getDate() + 1);
        dispatch(setDate(date.getTime()));

        dispatch(fetchPlayedTimeTableData({
            date: date.getTime(),
            searchTerm: playedTimeTableData.searchTerm,
        }));
    }

    return (
        <div id={styles.root}>
            <h1>Thời gian chơi</h1>
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
                                selected={playedTimeTableData.date}
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
                    <form onSubmit={handleSubmit} className={styles.searchBar}>
                        <input
                            ref={inputRef}
                            className={styles.searchInput}
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={playedTimeTableData.searchTerm}
                            onChange={handleChange}
                            disabled={playedTimeTableData.isLoading}
                        />
                        <div className={styles.searchIconBackground} onClick={handleSubmit}>
                            <IoIosSearch size={20} />
                        </div>
                    </form>
                </div>
                <input
                    type="file"
                    onChange={handleExcelFileUpload}
                    className={styles.uploadButton}
                />
            </span>
            <div id={styles.tableStyle}>
                <PagingTable
                    data={predictionData ? predictionData : playedTimeTableData.data}
                    isLoading={predictionData ? false : playedTimeTableData.isLoading}
                    errorMessage={predictionData ? "" : playedTimeTableData.errorMessage}
                    turnOnPagingMode={false}
                />
            </div>
            <div className={styles.bottomPanel}>
                {
                    (predictionData || playedTimeTableData.data) && 
                    <span className={styles.totalElement}>{`Số hàng: ${predictionData ? predictionData.rows.length : playedTimeTableData.data.rows.length}`}</span>
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

export default PlayedTime;