import React from "react";
import styles from "./design_settings.module.scss";
import clsx from "clsx";
import { HexColorPicker } from "react-colorful";

export default function DesignSettings({ configuration }) {
    const [useDefaultDesign, setUseDefaultDesign] = React.useState(configuration.useDefaultDesign || false);
    const [backgroundColor, setBackgroundColor] = React.useState(configuration.backgroundColor || "#FFFFFF");
    const [showBackgroundColorPicker, setShowBackgroundColorPicker] = React.useState(false);
    const [appNameColor, setAppNameColor] = React.useState(configuration.textColor || "#000000");
    const [showAppNameColorPicker, setShowAppNameColorPicker] = React.useState(false);
    const [backgroundImageUrl, setBackgroundImageUrl] = React.useState(configuration.backgroundImageUrl || "");
    const [iconSize, setIconSize] = React.useState(configuration.iconSize || 100);
    const [lockOrientation, setLockOrientation] = React.useState(configuration.orientation || 0);
    const [displayTimeAndBatteryState, setDisplayTimeAndBatteryState] = React.useState(configuration.displayTimeAndBatteryState || false);

    console.log("DesignSettings configuration", configuration);

    const backgroundColorInputRef = React.useRef(null);
    const appNameColorInputRef = React.useRef(null);

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

    const renderColorInputField = (label, placeholder, value, onChange, disable, showBackgroundColorPicker, setShowBackgroundColorPicker, inputRef) => {
        let keepFocus = false;
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <div className={clsx(styles.inputContainer, styles.inputContainerBorder)}>
                    <input
                        ref={inputRef}
                        type="text"
                        className={styles.input}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => {
                            if (e.target.value.length !== 7 || e.target.value[0] !== "#") {
                                return;
                            }
                            onChange(e.target.value);
                        }}
                        disabled={disable}
                        minLength={7}
                        maxLength={7}
                        onFocus={() => setShowBackgroundColorPicker(true)}
                        onBlur={(e) => {
                            // Delay một chút để chờ click hoàn tất
                            setTimeout(() => {
                                if (keepFocus) {
                                    inputRef.current?.focus();
                                } else {
                                    setShowBackgroundColorPicker(false);
                                }
                            }, 0);
                        }}
                    />
                    {
                        showBackgroundColorPicker &&
                        <div className={styles.colorPickerContainer}>
                            <HexColorPicker
                                color={value}
                                onChange={(value) => {
                                    keepFocus = true;
                                    onChange(value);
                                }} />
                        </div>
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
                renderColorInputField(
                    "Màu nền",
                    "Nhập màu nền",
                    backgroundColor,
                    (value) => {
                        setBackgroundColor(value);
                        configuration.backgroundColor = value;
                    },
                    useDefaultDesign,
                    showBackgroundColorPicker,
                    setShowBackgroundColorPicker,
                    backgroundColorInputRef,
                )
            }
            {
                renderColorInputField(
                    "Màu tên ứng dụng",
                    "Nhập màu tên ứng dụng",
                    appNameColor,
                    (value) => {
                        setAppNameColor(value);
                        configuration.textColor = value;
                    },
                    useDefaultDesign,
                    showAppNameColorPicker,
                    setShowAppNameColorPicker,
                    appNameColorInputRef,
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
                        if (e.target.value) {
                            configuration.backgroundImageUrl = e.target.value;
                        } else {
                            configuration.backgroundImageUrl = null;
                        }
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
            {/* {
                renderCheckboxField(
                    "Hiển thị thời gian và trạng thái pin",
                    displayTimeAndBatteryState,
                    (e) => {
                        setDisplayTimeAndBatteryState(e.target.checked);
                        configuration.displayTimeAndBatteryState = e.target.checked;
                    },
                    false
                )
            } */}
            <div className={styles.field} style={{ paddingBottom: 100 }}></div>
        </div>
    );
}