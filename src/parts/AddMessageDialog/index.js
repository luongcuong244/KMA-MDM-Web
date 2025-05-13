import React, { useEffect, useState } from "react";
import styles from "./add_message_dialog.module.scss";
import clsx from "clsx";

const AddMessageDialog = ({ isOpen, onClose, onSubmit }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [error, setError] = useState("");
    const [deviceId, setDeviceId] = useState("");
    const [allTypes, setAllTypes] = useState([
        {
            name: "configUpdated",
            payloadSample: null,
        },
        {
            name: "runApp",
            payloadSample: '{"pkg": "app.package.id"}'
        },
        {
            name: "uninstallApp",
            payloadSample: '{"pkg": "app.package.id"}'
        },
        {
            name: "reboot",
            payloadSample: null,
        },
        {
            name: "exitKiosk",
            payloadSample: null,
        },
        {
            name: "grantPermission",
            payloadSample: '{"pkg": "app.package.id"}'
        }
    ]);
    const [type, setType] = useState({
        name: "configUpdated",
        payloadSample: null,
    });
    const [payload, setPayload] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        if (!deviceId.trim()) {
            setError("Mã thiết bị không được để trống");
            return;
        }
        if (!type) {
            setError("Loại không được để trống");
            return;
        }
        if (type.payloadSample && !payload.trim()) {
            setError("Dữ liệu đính kèm không được để trống");
            return;
        }
        setError("");

        let payloadData = null;
        if (type.payloadSample) {
            try {
                payloadData = JSON.parse(payload);
            } catch (e) {
                setError("Dữ liệu đính kèm không hợp lệ");
                return;
            }
        }
        const message = {
            deviceId: deviceId,
            messageType: type.name,
            payload: payloadData,
        };
        onSubmit(message);
        handleClose();
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
                <label className={styles.title}>Thêm tin nhắn đẩy</label>
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
                        renderComboBoxField(
                            "Loại",
                            allTypes.map((config) => ({
                                label: config.name,
                                value: config.name,
                            })),
                            type.name,
                            (e) => {
                                let selectedType = allTypes.find((config) => config.name === e.target.value);
                                if (selectedType) {
                                    setType(selectedType);
                                    setPayload(selectedType.payloadSample);
                                }
                            },
                            () => {
                                console.log("Add new configuration");
                            }
                        )
                    }
                    {
                        renderTextInputField(
                            "Dữ liệu đính kèm",
                            "",
                            payload,
                            (e) => setPayload(e.target.value),
                            type.payloadSample === null
                        )
                    }
                    <div className={styles.dialogActions}>
                        <button type="button" onClick={handleSubmit}>Gửi</button>
                        <button type="button" onClick={handleClose}>Hủy</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMessageDialog;