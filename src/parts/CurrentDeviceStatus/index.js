import React, { useEffect, useState } from "react";
import styles from "./current_device_status.module.scss";
import clsx from "clsx";
import socket from "../../socket/socket";
import Converter from "../../utils/converter";

const CurrentDeviceStatus = ({ isOpen, onClose, deviceId }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [error, setError] = useState("");
    const [showDeviceInfo, setShowDeviceInfo] = useState(false);
    const [deviceStatus, setDeviceStatus] = useState(null);

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
            } else if (data.status === "success" && data.data && data.data.deviceStatus) {
                console.log("deviceStatus", data.data.deviceStatus);
                setError("");
                setDeviceStatus(data.data.deviceStatus);
            } else {
                setError("Lỗi không xác định");
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

    const renderTextField = (label, value) => {
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <div className={clsx(styles.inputContainer, styles.inputContainerBorder)}>
                    <p className={styles.input}>{value}</p>
                </div>
            </div>
        );
    };

    const renderCheckboxField = (label, value, onChange) => {
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <div className={styles.inputContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkBox}
                        checked={value}
                        onChange={onChange}
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
                    !error && deviceStatus && (
                        <div className={styles.dialogContent}>
                            {
                                renderTextField(
                                    "Mã thiết bị",
                                    deviceId,
                                )
                            }
                            {
                                renderCheckboxField(
                                    "Hiện thông tin máy",
                                    showDeviceInfo,
                                    (e) => {
                                        setShowDeviceInfo(e.target.checked);
                                    }
                                )
                            }
                            {
                                showDeviceInfo && (
                                    <>
                                        {
                                            renderTextField(
                                                "Tên thiết bị",
                                                deviceStatus.deviceInfo.deviceName
                                            )
                                        }
                                        {
                                            renderTextField(
                                                "Mẫu thiết bị",
                                                deviceStatus.deviceInfo.deviceModel
                                            )
                                        }
                                        {
                                            renderTextField(
                                                "Thương hiệu",
                                                deviceStatus.deviceInfo.deviceBrand
                                            )
                                        }
                                        {
                                            renderTextField(
                                                "Sản phẩm",
                                                deviceStatus.deviceInfo.deviceProduct
                                            )
                                        }
                                        {
                                            renderTextField(
                                                "Nhà sản xuất",
                                                deviceStatus.deviceInfo.deviceManufacturer
                                            )
                                        }
                                        {
                                            renderTextField(
                                                "Số serial",
                                                deviceStatus.deviceInfo.deviceSerial
                                            )
                                        }
                                        {
                                            renderTextField(
                                                "Phần cứng thiết bị",
                                                deviceStatus.deviceInfo.deviceHardware
                                            )
                                        }
                                        {
                                            renderTextField(
                                                "Mã bản dựng",
                                                deviceStatus.deviceInfo.deviceBuildId
                                            )
                                        }
                                        {
                                            renderTextField(
                                                "Phiên bản android",
                                                deviceStatus.deviceInfo.androidVersion
                                            )
                                        }
                                        {
                                            renderTextField(
                                                "Phiên bản SDK Android",
                                                deviceStatus.deviceInfo.androidSdkVersion
                                            )
                                        }
                                        {
                                            renderTextField(
                                                "Id Android",
                                                deviceStatus.deviceInfo.androidId
                                            )
                                        }
                                        {
                                            renderTextField(
                                                "IMEI",
                                                deviceStatus.deviceInfo.imei
                                            )
                                        }
                                        {
                                            renderTextField(
                                                "Kiến trúc CPU",
                                                deviceStatus.deviceInfo.cpuArch
                                            )
                                        }
                                        {
                                            renderTextField(
                                                "Số lõi CPU",
                                                deviceStatus.deviceInfo.cpuCores
                                            )
                                        }
                                    </>
                                )
                            }
                            {
                                renderTextField(
                                    "Tổng RAM",
                                    Converter.formatStorage(deviceStatus.deviceInfo.totalRAM)
                                )
                            }
                            {
                                renderTextField(
                                    "Dung lượng bộ nhớ",
                                    Converter.formatStorage(deviceStatus.deviceInfo.totalStorage)
                                )
                            }
                            {
                                renderTextField(
                                    "Phần trăm pin",
                                    deviceStatus.batteryLevel
                                )
                            }
                            {
                                renderTextField(
                                    "Đang sạc",
                                    deviceStatus.isCharging ? "Có" : "Không"
                                )
                            }
                            {
                                renderTextField(
                                    "Sử dụng bộ nhớ",
                                    `${Converter.formatStorage(deviceStatus.storageUsage)} / ${Converter.formatStorage(deviceStatus.deviceInfo.totalStorage)}`
                                )
                            }
                            {
                                renderTextField(
                                    "Sử dụng RAM",
                                    `${Converter.formatStorage(deviceStatus.ramUsage)} / ${Converter.formatStorage(deviceStatus.deviceInfo.totalRAM)}`
                                )
                            }
                            {
                                renderTextField(
                                    "Đang khóa",
                                    deviceStatus.isLocked ? "Có" : "Không"
                                )
                            }
                            {
                                renderTextField(
                                    "Loại kết nối",
                                    deviceStatus.networkType === "WiFi" ? "WiFi" : "Mạng di động"
                                )
                            }
                            {
                                renderTextField(
                                    "Bật định vị",
                                    deviceStatus.locationEnabled ? "Có" : "Không"
                                )
                            }
                            {
                                renderTextField(
                                    "Vị trí hiện tại",
                                    deviceStatus.location
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