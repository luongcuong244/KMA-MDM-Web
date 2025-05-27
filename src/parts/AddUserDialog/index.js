import React, { useEffect, useState } from "react";
import styles from "./add_user_dialog.module.scss";
import clsx from "clsx";
import userService from "../../services/user.service";

const AddUserDialog = ({ isOpen, onClose, onSubmit }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [error, setError] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [maxDevices, setMaxDevices] = useState(10);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        if (!userName.trim() || !password.trim()) {
            setError("Vui lòng nhập tên đăng nhập và mật khẩu");
            return;
        }
        if (maxDevices < 1 || maxDevices > 100) {
            setError("Số thiết bị tối đa phải nằm trong khoảng từ 1 đến 100");
            return;
        }
        setError("");
        
        userService.createUser({
            userName: userName.trim(),
            password: password.trim(),
            maxManagedDevices: parseInt(maxDevices, 10),
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
                <label className={styles.title}>Thêm quản lý</label>
                {
                    error && <label className={styles.error}>{error}</label>
                }
                <div>
                    {
                        renderTextInputField(
                            "text",
                            "Tên đăng nhập",
                            "Nhập tên đăng nhập",
                            userName,
                            (e) => setUserName(e.target.value),
                            false
                        )
                    }
                    {
                        renderTextInputField(
                            "password",
                            "Mật khẩu",
                            "Nhập mật khẩu",
                            password,
                            (e) => setPassword(e.target.value),
                            false,
                            showPassword,
                            () => setShowPassword(!showPassword)
                        )
                    }
                    {
                        renderTextInputField(
                            "number",
                            "Số thiết bị tối đa",
                            "Nhập số thiết bị tối đa",
                            maxDevices,
                            (e) => setMaxDevices(e.target.value),
                            false
                        )
                    }
                    <div className={styles.dialogActions}>
                        <button type="button" onClick={handleSubmit}>Tạo</button>
                        <button type="button" onClick={handleClose}>Hủy</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUserDialog;