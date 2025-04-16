import React from "react";
import styles from "./common_settings.module.scss";
import clsx from "clsx";

export default function CommonSettings() {
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [adminPassword, setAdminPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);

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

    const renderRadioGroupField = (label, options, selectedValue, onChange) => {
        
    }

    return (
        <div id={styles.root}>
            {
                renderTextInputField(
                    "text",
                    "Tên",
                    "Nhập tên",
                    name,
                    (e) => setName(e.target.value),
                    false
                )
            }
            {
                renderTextInputField(
                    "text",
                    "Mô tả",
                    "Nhập mô tả",
                    description,
                    (e) => setDescription(e.target.value),
                    false
                )
            }
            {
                renderTextInputField(
                    "password",
                    "Mật khẩu quản trị viên",
                    "Nhập mật khẩu quản trị viên",
                    adminPassword,
                    (e) => setAdminPassword(e.target.value),
                    false,
                    showPassword,
                    () => setShowPassword(!showPassword)
                )
            }
        </div>
    );
}