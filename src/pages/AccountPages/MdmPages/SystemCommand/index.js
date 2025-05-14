import React, { useEffect, useState } from "react";
import styles from "./system_command.module.scss";
import socket from "../../../../socket/socket";
import deviceService from "../../../../services/device.service";

export default function SystemCommand() {
    const [error, setError] = useState("");
    const [deviceId, setDeviceId] = useState(null);
    const [device, setDevice] = useState(null);

    useEffect(() => {
        socket.connect();
        socket.on("connect", () => {
            socket.emit("web:send:get_push_messages");
        });
        return () => {
            socket.off("connect");
            socket.disconnect();
        }
    }, [])

    const handleSearch = async () => {
        if (!deviceId) {
            setError("Vui lòng nhập mã thiết bị");
            return;
        }
        // deviceService.getDeviceById(deviceId).then((response) => {

        // })
    }

    return (
        <div id={styles.root}>
            <label className={styles.title}>Lệnh hệ thống</label>
            {
                error && (
                    <div className={styles.error}>
                        <span className={styles.errorText}>{error}</span>
                    </div>
                )
            }
            <div className={styles.searchBarContainer}>
                <input
                    type="text"
                    className={styles.searchBar}
                    placeholder="Nhập mã thiết bị"
                    onChange={(e) => setDeviceId(e.target.value)}
                    value={deviceId}
                />
                <button className={styles.searchButton}>Tìm kiếm</button>
            </div>
            {
                <>
                    <div className={styles.row} style={{ marginTop: "20px" }}>
                        <label className={styles.rowTitle}>Thời gian yêu cầu cài đặt gốc:</label>
                        <label className={styles.rowValue}>-</label>
                    </div>
                    <div className={styles.row}>
                        <label className={styles.rowTitle}>Thời gian xác nhận cài đặt gốc:</label>
                        <label className={styles.rowValue}>-</label>
                    </div>
                    <div className={styles.row}>
                        <label className={styles.rowTitle}>Thời gian yêu cầu khởi động lại:</label>
                        <label className={styles.rowValue}>-</label>
                    </div>
                    <div className={styles.row}>
                        <label className={styles.rowTitle}>Thời gian xác nhận khởi động lại:</label>
                        <label className={styles.rowValue}>-</label>
                    </div>
                    <div className={styles.row}>
                        <label className={styles.rowTitle}>Khoá:</label>
                        <label className={styles.rowValue}>-</label>
                    </div>
                    <div className={styles.row}>
                        <label className={styles.rowTitle}>Thông báo khoá:</label>
                        <label className={styles.rowValue}>-</label>
                    </div>
                    <div className={styles.buttons}>
                        <button className={styles.searchButton}>Đổi mật khẩu máy</button>
                        <button className={styles.searchButton}>Khởi động lại</button>
                        <button className={styles.searchButton}>Khoá máy</button>
                        <button className={styles.searchButton}>Khôi phục cài đặt gốc</button>
                    </div>
                </>
            }
        </div>
    );
}