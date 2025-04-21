import React, { useEffect, useState } from "react";
import styles from "./add_device_dialog.module.scss";
import clsx from "clsx";
import configurationService from "../../services/configuration.service";
import deviceService from "../../services/device.service";

const AddDeviceDialog = ({ isOpen, onClose, onSubmit }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [error, setError] = useState("");
    const [configurations, setConfigurations] = useState([]);
    const [deviceId, setDeviceId] = useState("");
    const [description, setDescription] = useState("");
    const [configurationId, setConfigurationId] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
        configurationService.getConfigurations("")
            .then((response) => {
                if (response.data && response.data.data) {
                    setConfigurations([null, ...response.data.data]);
                } else {
                    console.error("No data found in response");
                }
            })
            .catch((error) => {
                console.error("Error fetching app icons:", error);
            });
    }, []);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        if (!deviceId.trim()) {
            setError("Mã thiết bị không được để trống");
            return;
        }
        if (!configurationId) {
            setError("Cấu hình không được để trống");
            return;
        }
        setError("");

        deviceService.addNewDevice({
            deviceId: deviceId,
            description: description,
            configurationId: configurationId,
            phoneNumber: phoneNumber,
        }).then((response) => {
            if (response.data) {
                console.log("Device added successfully:", response.data.message);
                onSubmit(response.data.data);
                handleClose();
            }
        }).catch((error) => {
            console.error("Error adding device:", error);
            if (error.response && error.response.data) {
                setError(error.response.data.message);
            } else {
                setError("Error adding device");
            }
        });

        // applicationService.addApplication({
        //     apkServerPath: apkUploadData ? apkUploadData.data.serverPath : null,
        //     appName: appName,
        //     packageName: isSystemApp ? packageName : apkUploadData.data.fileDetails.pkg,
        //     versionName: isSystemApp ? "0" : apkUploadData.data.fileDetails.version,
        //     versionCode: isSystemApp ? 0 : apkUploadData.data.fileDetails.versionCode,
        //     isSystemApp: isSystemApp,
        //     showIcon: showIcon,
        //     iconId: showIcon ? iconId : null,
        //     iconName: showIcon ? (!iconName ? null : iconName) : null,
        // }).then((response) => {
        //     if (response.data) {
        //         console.log("Application added successfully:", response.data.message);
        //         onSubmit(response.data.data);
        //         handleClose();
        //     }
        // }).catch((error) => {
        //     console.error("Error adding application:", error);
        //     if (error.response && error.response.data) {
        //         setError(error.response.data.message);
        //     } else {
        //         setError("Error adding application");
        //     }
        // });
    };

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
        }, 500);
    }

    const renderTextInputField = (label, placeholder, value, onChange, disable) => {
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
                        disabled={disable}
                    />
                </div>
            </div>
        );
    };

    const renderComboBoxField = (label, options, value, onChange, onAddNew) => {
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <div className={styles.inputContainer}>
                    <div className={styles.inputContainerBorder} style={{ flex: 1, height: "100%", display: "flex", alignItems: "center", marginRight: 16 }}>
                        <select
                            className={styles.input}
                            value={value}
                            onChange={onChange}
                        >
                            {options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={clsx(styles.dialogBackdrop, isExiting && styles.dialogBackdropExit)}>
            <div className={clsx(styles.dialog, isExiting ? styles.dialogExit : styles.dialogEnter)}>
                <label className={styles.title}>Thêm thiết bị</label>
                {
                    error && <label className={styles.error}>{error}</label>
                }
                <div>
                    {
                        renderTextInputField(
                            "Mã thiết bị",
                            "Nhập mã thiết bị",
                            deviceId,
                            (e) => setDeviceId(e.target.value),
                            false
                        )
                    }
                    {
                        renderTextInputField(
                            "Mô tả",
                            "Nhập mô tả",
                            description,
                            (e) => setDescription(e.target.value),
                            false
                        )
                    }
                    {
                        renderComboBoxField(
                            "Cấu hình",
                            configurations.map((config) => ({
                                label: config ? config.name : "Chọn",
                                value: config ? config._id : null,
                            })),
                            configurationId,
                            (e) => setConfigurationId(e.target.value),
                            () => {
                                // Handle add new configuration
                                console.log("Add new configuration");
                            }
                        )
                    }
                    {
                        renderTextInputField(
                            "Số điện thoại",
                            "Nhập số điện thoại",
                            phoneNumber,
                            (e) => setPhoneNumber(e.target.value),
                            false
                        )
                    }
                    <div className={styles.dialogActions}>
                        <button type="button" onClick={handleSubmit}>Thêm</button>
                        <button type="button" onClick={handleClose}>Hủy</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddDeviceDialog;