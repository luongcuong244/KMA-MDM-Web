import React, { useEffect, useState } from "react";
import styles from "./copy_configuration_dialog.module.scss";
import clsx from "clsx";
import configurationService from "../../services/configuration.service";

const CopyConfigurationDialog = ({ configuration, isOpen, onClose, onSubmit }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        if (!name.trim()) {
            setError("Tên cấu hình không được để trống");
            return;
        }
        setError("");

        configurationService.copyConfiguration({
            configurationId: configuration._id,
            name: name.trim(),
            description: description.trim()
        })
            .then(() => {
                onSubmit();
                handleClose();
            })
            .catch((err) => {
                if (err.response && err.response.data) {
                    setError(err.response.data.message || "Lỗi khi sao chép cấu hình");
                } else {
                    setError("Lỗi không xác định khi sao chép cấu hình");
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

    return (
        <div className={clsx(styles.dialogBackdrop, isExiting && styles.dialogBackdropExit)}>
            <div className={clsx(styles.dialog, isExiting ? styles.dialogExit : styles.dialogEnter)}>
                <label className={styles.title}>Sao chép cấu hình</label>
                {
                    error && <label className={styles.error}>{error}</label>
                }
                <div>
                    {
                        renderTextInputField(
                            "Tên cấu hình",
                            "Nhập tên cấu hình mới",
                            name,
                            (e) => setName(e.target.value),
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
                    <div className={styles.dialogActions}>
                        <button type="button" onClick={handleSubmit}>Sao chép</button>
                        <button type="button" onClick={handleClose}>Hủy</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CopyConfigurationDialog;