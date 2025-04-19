import React from "react";
import styles from "./design_settings.module.scss";
import clsx from "clsx";

export default function DesignSettings({ configuration }) {
    const [useDefaultDesign, setUseDefaultDesign] = React.useState(configuration.useDefaultDesign || false);
    const [backgroundColor, setBackgroundColor] = React.useState(configuration.backgroundColor || "#FFFFFF");
    const [appNameColor, setAppNameColor] = React.useState(configuration.textColor || "#000000");
    const [backgroundImageUrl, setBackgroundImageUrl] = React.useState(configuration.backgroundImageUrl || "");
    const [iconSize, setIconSize] = React.useState(configuration.iconSize || 100);
    const [lockOrientation, setLockOrientation] = React.useState(configuration.orientation || 0);
    const [displayTimeAndBatteryState, setDisplayTimeAndBatteryState] = React.useState(configuration.displayTimeAndBatteryState || false);

    console.log("DesignSettings configuration", configuration);

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
                    (e) => {
                        setUseDefaultDesign(e.target.checked);
                        configuration.useDefaultDesign = e.target.checked;
                    },
                    false,
                )
            }
            {
                renderTextInputField(
                    "text",
                    "Màu nền",
                    "Nhập màu nền",
                    backgroundColor,
                    (e) => {
                        setBackgroundColor(e.target.value);
                        configuration.backgroundColor = e.target.value;
                    },
                    useDefaultDesign
                )
            }
            {
                renderTextInputField(
                    "text",
                    "Màu tên ứng dụng",
                    "Nhập màu tên ứng dụng",
                    appNameColor,
                    (e) => {
                        setAppNameColor(e.target.value);
                        configuration.textColor = e.target.value;
                    },
                    useDefaultDesign
                )
            }
            {
                renderTextInputField(
                    "text",
                    "Hình nền",
                    "Nhập URL hình nền",
                    backgroundImageUrl,
                    (e) => {
                        setBackgroundImageUrl(e.target.value);
                        configuration.backgroundImageUrl = e.target.value;
                    },
                    useDefaultDesign
                )
            }
            {
                renderComboBoxField(
                    "Kích thước Icon",
                    [
                        {
                            label: "Nhỏ",
                            value: 100,
                        },
                        {
                            label: "Vừa (+ 20%)",
                            value: 120,
                        },
                        {
                            label: "Lớn (+ 40%)",
                            value: 140,
                        }
                    ],
                    iconSize,
                    e => {
                        setIconSize(parseInt(e.target.value));
                        configuration.iconSize = parseInt(e.target.value);
                    },
                    useDefaultDesign
                )
            }
            {
                renderComboBoxField(
                    "Khoá xoay màn hình",
                    [
                        {
                            label: "Không khoá",
                            value: 0,
                        },
                        {
                            label: "Khoá theo chiều dọc",
                            value: 1,
                        },
                        {
                            label: "Khoá theo chiều ngang",
                            value: 2,
                        }
                    ],
                    lockOrientation,
                    e => {
                        setLockOrientation(parseInt(e.target.value));
                        configuration.orientation = parseInt(e.target.value);
                    },
                    false
                )
            }
            {
                renderCheckboxField(
                    "Hiển thị thời gian và trạng thái pin",
                    displayTimeAndBatteryState,
                    (e) => {
                        setDisplayTimeAndBatteryState(e.target.checked);
                        configuration.displayTimeAndBatteryState = e.target.checked;
                    },
                    false
                )
            }
            <div className={styles.field} style={{ paddingBottom: 100 }}></div>
        </div>
    );
}