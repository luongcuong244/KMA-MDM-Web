import React, { useEffect, useState } from "react";
import styles from "./edit_device_dialog.module.scss";
import clsx from "clsx";
import configurationService from "../../services/configuration.service";
import deviceService from "../../services/device.service";

const EditDeviceDialog = ({ device, isOpen, onClose, onSubmit }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [error, setError] = useState("");
    const [configurations, setConfigurations] = useState([]);
    const [deviceId, setDeviceId] = useState(device.deviceId || "");
    const [description, setDescription] = useState(device.description || "");
    const [configurationId, setConfigurationId] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(device.phoneNumber || "");

    useEffect(() => {
        configurationService.getConfigurations("")
            .then((response) => {
                if (response.data && response.data.data) {
                    setConfigurations([null, ...response.data.data]);
                    console.log("device u: ", device);
                    const config = response.data.data.find(config => config._id === device.configuration._id);
                    setConfigurationId(config ? config._id : null);
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

        deviceService.updateDeviceById({
            deviceId: deviceId,
            description: description,
            configurationId: configurationId,
            phoneNumber: phoneNumber,
        }).then((response) => {
            if (response.data) {
                console.log("Device updated successfully:", response.data.message);
                onSubmit(response.data.data);
                handleClose();
            }
        }).catch((error) => {
            console.error("Error updating device:", error);
            if (error.response && error.response.data) {
                setError(error.response.data.message);
            } else {
                setError("Error updating device");
            }
        });
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
                <label className={styles.title}>Sửa thiết bị</label>
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
                            true
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
                        <button type="button" onClick={handleSubmit}>Cập nhật</button>
                        <button type="button" onClick={handleClose}>Hủy</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditDeviceDialog;