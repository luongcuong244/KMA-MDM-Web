import React from "react";
import styles from "./design_settings.module.scss";
import clsx from "clsx";

export default function DesignSettings() {
    const [useDefaultDesign, setUseDefaultDesign] = React.useState(false);
    const [backgroundColor, setBackgroundColor] = React.useState("#ffffff");
    const [appNameColor, setAppNameColor] = React.useState("#000000");
    const [backgroundImageUrl, setBackgroundImageUrl] = React.useState("");
    const [iconSize, setIconSize] = React.useState("small");
    const [lockOrientation, setLockOrientation] = React.useState("no");
    const [displayTimeAndBatteryState, setDisplayTimeAndBatteryState] = React.useState(false);

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
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <div className={clsx(styles.inputContainerRadio)}>
                    {
                        options.map((option) => {
                            return <div className={styles.radioContainer}>
                                <label className={styles.radioLabel}>{option}</label>
                                <input
                                    key={option.value}
                                    type="radio"
                                    className={styles.radioInput}
                                    name={label}
                                    value={option}
                                    checked={selectedValue === option}
                                    onChange={onChange}
                                />
                            </div>
                        })
                    }
                </div>
            </div>
        );
    }

    const renderCheckboxField = (label, value, onChange, disable) => {
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <div className={styles.inputContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkBox}
                        checked={value}
                        onChange={onChange}
                        disabled={disable}
                    />
                </div>
            </div>
        );
    };

    const renderComboBoxField = (label, options, value, onChange, disable) => {
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <div className={styles.inputContainer}>
                    <div className={styles.inputContainerBorder} style={{ flex: 1, height: "100%", display: "flex", alignItems: "center", marginRight: 16 }}>
                        <select
                            className={styles.input}
                            value={value}
                            onChange={onChange}
                            disabled={disable}
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
        <div id={styles.root}>
            {
                renderCheckboxField(
                    "Sử dụng mặc định",
                    useDefaultDesign,
                    (e) => setUseDefaultDesign(e.target.checked),
                    false,
                )
            }
            {
                renderTextInputField(
                    "text",
                    "Màu nền",
                    "Nhập màu nền",
                    backgroundColor,
                    (e) => setBackgroundColor(e.target.value),
                    useDefaultDesign
                )
            }
            {
                renderTextInputField(
                    "text",
                    "Màu tên ứng dụng",
                    "Nhập màu tên ứng dụng",
                    appNameColor,
                    (e) => setAppNameColor(e.target.value),
                    useDefaultDesign
                )
            }
            {
                renderTextInputField(
                    "text",
                    "Hình nền",
                    "Nhập URL hình nền",
                    backgroundImageUrl,
                    (e) => setBackgroundImageUrl(e.target.value),
                    useDefaultDesign
                )
            }
            {
                renderComboBoxField(
                    "Kích thước Icon",
                    [
                        {
                            label: "Nhỏ",
                            value: "small",
                        },
                        {
                            label: "Vừa (+ 20%)",
                            value: "medium",
                        },
                        {
                            label: "Lớn (+ 40%)",
                            value: "large",
                        }
                    ],
                    iconSize,
                    e => setIconSize(e.target.value),
                    useDefaultDesign
                )
            }
            {
                renderComboBoxField(
                    "Khoá xoay màn hình",
                    [
                        {
                            label: "Không khoá",
                            value: "no",
                        },
                        {
                            label: "Khoá theo chiều dọc",
                            value: "portrait",
                        },
                        {
                            label: "Khoá theo chiều ngang",
                            value: "landscape",
                        }
                    ],
                    lockOrientation,
                    e => setLockOrientation(e.target.value),
                    false
                )
            }
            {
                renderCheckboxField(
                    "Hiển thị thời gian và trạng thái pin",
                    displayTimeAndBatteryState,
                    (e) => setDisplayTimeAndBatteryState(e.target.checked),
                    false
                )
            }
            <div className={styles.field} style={{ paddingBottom: 100 }}></div>
        </div>
    );
}