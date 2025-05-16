import React, { useEffect, useState } from "react";
import styles from "./system_command.module.scss";
import socket from "../../../../socket/socket";
import deviceService from "../../../../services/device.service";
import Converter from "../../../../utils/converter";

export default function SystemCommand() {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [deviceId, setDeviceId] = useState(null);
    const [device, setDevice] = useState(null);

    useEffect(() => {
        socket.connect();
        socket.on("connect", () => {
            socket.emit("web:send:get_push_messages");
        });
        socket.on("web:receive:system_command", (data) => {
            if (data.error) {
                setError(data.error);
                setMessage("");
            } else if (data.message) {
                setMessage(data.message);
                setError("");
                if (data.device) {
                    setDevice(data.device);
                }
            } else {
                setError("");
                setMessage("");
            }
        });
        return () => {
            socket.off("connect");
            socket.off("web:receive:system_command");
            socket.disconnect();
        }
    }, [])

    const handleSearch = async () => {
        if (!deviceId) {
            setError("Vui lòng nhập mã thiết bị");
            setMessage("");
            return;
        }
        deviceService.getDeviceById(deviceId)
            .then((response) => {
                if (response.status === 200) {
                    setDevice(response.data.data);
                    setError("");
                    setMessage("");
                } else {
                    setDevice(null);
                    setError("Không tìm thấy thiết bị");
                    setMessage("");
                }
            })
            .catch((error) => {
                setDevice(null);
                setError("Không tìm thấy thiết bị");
                setMessage("");
            })
    }

    const clickChangePassword = () => {
    }

    const clickReboot = () => {
        if (device) {
            if (window.confirm(`Bạn có chắc chắn muốn khởi động lại thiết bị "${deviceId}" không?`) === true) {
                socket.emit("web:send:reboot", { deviceId });
            } else {
                return;
            }
        }
    }

    const clickLock = () => {

    }

    const clickFactoryReset = () => {
        if (device) {
            if (window.confirm(`Bạn có chắc chắn muốn khôi phục cài đặt gốc thiết bị "${deviceId}" không?`) === true) {
                socket.emit("web:send:factory_reset", { deviceId });
            } else {
                return;
            }
        }
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
            {
                message && (
                    <div className={styles.error}>
                        <span className={styles.messageText}>{message}</span>
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
                <button className={styles.searchButton} onClick={handleSearch}>Tìm kiếm</button>
            </div>
            {
                device && (
                    <>
                        <div className={styles.row} style={{ marginTop: "20px" }}>
                            <label className={styles.rowTitle}>Thời gian yêu cầu cài đặt gốc:</label>
                            <label className={styles.rowValue}>{device.factoryResetRequested ? Converter.formatDate(device.factoryResetRequested) : "-"}</label>
                        </div>
                        <div className={styles.row}>
                            <label className={styles.rowTitle}>Thời gian xác nhận cài đặt gốc:</label>
                            <label className={styles.rowValue}>{device.factoryResetConfirmed ? Converter.formatDate(device.factoryResetConfirmed) : "-"}</label>
                        </div>
                        <div className={styles.row}>
                            <label className={styles.rowTitle}>Thời gian yêu cầu khởi động lại:</label>
                            <label className={styles.rowValue}>{device.rebootRequested ? Converter.formatDate(device.rebootRequested) : "-"}</label>
                        </div>
                        <div className={styles.row}>
                            <label className={styles.rowTitle}>Thời gian xác nhận khởi động lại:</label>
                            <label className={styles.rowValue}>{device.rebootConfirmed ? Converter.formatDate(device.rebootConfirmed) : "-"}</label>
                        </div>
                        <div className={styles.row}>
                            <label className={styles.rowTitle}>Khoá:</label>
                            <label className={styles.rowValue}>{device.lock ? "Đã khóa" : "Không"}</label>
                        </div>
                        <div className={styles.row}>
                            <label className={styles.rowTitle}>Thông báo khoá:</label>
                            <label className={styles.rowValue}>{device.lockMessage || "-"}</label>
                        </div>
                        <div className={styles.buttons}>
                            <button className={styles.searchButton} onClick={clickChangePassword}>Đổi mật khẩu máy</button>
                            <button className={styles.searchButton} onClick={clickReboot}>Khởi động lại</button>
                            <button className={styles.searchButton} onClick={clickLock}>{device.lock ? "Mở khóa" : "Khóa máy"}</button>
                            <button className={styles.searchButton} onClick={clickFactoryReset}>Khôi phục cài đặt gốc</button>
                        </div>
                    </>
                )
            }
        </div>
    );
}