import React, { useEffect, useState } from "react";
import styles from "./current_device_status.module.scss";
import clsx from "clsx";
import socket from "../../socket/socket";

const CurrentDeviceStatus = ({ isOpen, onClose, deviceId }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        socket.connect();
        socket.on("connect", () => {
            socket.emit("web:send:view_device_status", {
                deviceId: deviceId,
            });
        });
        socket.on("web:receive:device_status", (data) => {
            if (!data) {
                setError("Không có dữ liệu");
                return;
            }
            if (data.status === "error") {
                setError(data.message || "Lỗi không xác định");
                return; 
            } else {
                setError("");
            }
        });
        return () => {
            socket.off("connect");
            socket.disconnect();
        }
    }, []);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
        }, 500);
    }

    const renderTextField = (label, placeholder, value, onChange) => {
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <div className={clsx(styles.inputContainer, styles.inputContainerBorder)}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        disabled={true}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className={clsx(styles.dialogBackdrop, isExiting && styles.dialogBackdropExit)}>
            <div className={clsx(styles.dialog, isExiting ? styles.dialogExit : styles.dialogEnter)}>
                <label className={styles.title}>Trạng thái thiết bị hiện tại</label>
                {
                    error && <label className={styles.error}>{error}</label>
                }
                {
                    !error && (
                        <div>
                            {
                                renderTextField(
                                    "Mã thiết bị",
                                    "Nhập mã thiết bị",
                                    "deviceId",
                                    // (e) => setDeviceId(e.target.value),
                                    // false
                                )
                            }
                        </div>
                    )
                }
                <div className={styles.dialogActions}>
                    <button type="button" onClick={handleClose}>Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default CurrentDeviceStatus;