import React, { useEffect, useState } from "react";
import styles from "./lock_user_dialog.module.scss";
import clsx from "clsx";
import userService from "../../services/user.service";

const LockUserDialog = ({ user, isOpen, onClose, onSubmit }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [error, setError] = useState("");
    const [blockedReason, setBlockedReason] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        setError("");
        userService.lockUser({
            userId: user._id,
            reason: blockedReason.trim(),
        })
            .then(() => {
                onSubmit();
                handleClose();
            })
            .catch((err) => {
                console.error("Error creating user:", err);
                if (err.response && err.response.data) {
                    setError(err.response.data.message);
                } else {
                    setError("Lỗi khi tạo người dùng");
                }
            });
    };

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
        }, 500);
    }

    const renderTextInputField = (type, label, placeholder, value, onChange, disable, showPassword, onClickEyeButton) => {
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <div className={clsx(styles.inputContainer, styles.inputContainerBorder)}>
                    <input
                        type={type === "password" && showPassword ? "text" : type}
                        className={styles.input}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        disabled={disable}
                        min={type === "number" ? 1 : undefined}
                        max={type === "number" ? 100 : undefined}
                        pattern={type === "number" ? "[0-9]*" : undefined}
                    />
                </div>
                {
                    type === "password" && (
                        <button
                            className={styles.eyeButton}
                            onClick={onClickEyeButton}
                        >
                            <span className={"glyphicon " + (showPassword ? "glyphicon-eye-close" : "glyphicon-eye-open")}></span>
                        </button>
                    )
                }
            </div>
        );
    };

    return (
        <div className={clsx(styles.dialogBackdrop, isExiting && styles.dialogBackdropExit)}>
            <div className={clsx(styles.dialog, isExiting ? styles.dialogExit : styles.dialogEnter)}>
                <label className={styles.title}>Khóa tài khoản</label>
                {
                    error && <label className={styles.error}>{error}</label>
                }
                <div>
                    {
                        renderTextInputField(
                            "text",
                            "Lý do khóa",
                            "Nhập lý do khóa tài khoản",
                            blockedReason,
                            (e) => setBlockedReason(e.target.value),
                            false,
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

export default LockUserDialog;