import React from "react";
import styles from "./common_settings.module.scss";
import clsx from "clsx";

export default function CommonSettings({ configuration }) {
    const [name, setName] = React.useState(configuration.name || "");
    const [description, setDescription] = React.useState(configuration.description || "");
    const [adminPassword, setAdminPassword] = React.useState(configuration.adminPassword || "");
    const [showPassword, setShowPassword] = React.useState(false);
    const [gps, setGps] = React.useState(configuration.gps || "Any");
    const [bluetooth, setBluetooth] = React.useState(configuration.bluetooth || "Any");
    const [wifi, setWifi] = React.useState(configuration.wifi || "Any");
    const [mobileData, setMobileData] = React.useState(configuration.mobileData || "Any");
    const [blockUSBStorage, setBlockUSBStorage] = React.useState(configuration.blockUSBStorage || false);
    const [manageScreenTimeout, setManageScreenTimeout] = React.useState(configuration.manageScreenTimeout || false);
    const [screenTimeoutValue, setScreenTimeoutValue] = React.useState(configuration.screenTimeout || 60);
    const [lockVolume, setLockVolume] = React.useState(configuration.lockVolume || false);
    const [manageVolume, setManageVolume] = React.useState(configuration.manageVolume || false);
    const [volumeValue, setVolumeValue] = React.useState(configuration.volumeValue || 50);
    const [disableScreenCapture, setDisableScreenCapture] = React.useState(configuration.disableScreenCapture || false);

    console.log("CommonSettings configuration", configuration);

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

    const renderCheckboxField = (label, value, onChange) => {
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <div className={styles.inputContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkBox}
                        checked={value}
                        onChange={onChange}
                    />
                </div>
            </div>
        );
    };

    return (
        <div id={styles.root}>
            {
                renderTextInputField(
                    "text",
                    "Tên",
                    "Nhập tên",
                    name,
                    (e) => {
                        setName(e.target.value);
                        configuration.name = e.target.value;
                    },
                    false
                )
            }
            {
                renderTextInputField(
                    "text",
                    "Mô tả",
                    "Nhập mô tả",
                    description,
                    (e) => {
                        setDescription(e.target.value);
                        configuration.description = e.target.value;
                    },
                    false
                )
            }
            {
                renderTextInputField(
                    "password",
                    "Mật khẩu quản trị viên",
                    "Nhập mật khẩu quản trị viên",
                    adminPassword,
                    (e) => {
                        setAdminPassword(e.target.value);
                        configuration.adminPassword = e.target.value;
                    },
                    false,
                    showPassword,
                    () => setShowPassword(!showPassword)
                )
            }
            {
                renderRadioGroupField(
                    "GPS",
                    [
                        "Any",
                        "Disabled",
                        "Enabled"
                    ],
                    gps,
                    (e) => {
                        setGps(e.target.value);
                        configuration.gps = e.target.value;
                    }
                )
            }
            {
                renderRadioGroupField(
                    "Bluetooth",
                    [
                        "Any",
                        "Disabled",
                        "Enabled"
                    ],
                    bluetooth,
                    (e) => {
                        setBluetooth(e.target.value);
                        configuration.bluetooth = e.target.value;
                    }
                )
            }
            {
                renderRadioGroupField(
                    "Wi-Fi",
                    [
                        "Any",
                        "Disabled",
                        "Enabled"
                    ],
                    wifi,
                    (e) => {
                        setWifi(e.target.value);
                        configuration.wifi = e.target.value;
                    }
                )
            }
            {
                renderRadioGroupField(
                    "Dữ liệu di động",
                    [
                        "Any",
                        "Disabled",
                        "Enabled"
                    ],
                    mobileData,
                    (e) => {
                        setMobileData(e.target.value)
                        configuration.mobileData = e.target.value;
                    }
                )
            }
            {
                renderCheckboxField(
                    "Chặn USB Storage",
                    blockUSBStorage,
                    (e) => {
                        setBlockUSBStorage(e.target.checked);
                        configuration.blockUSBStorage = e.target.checked;
                    }
                )
            }
            {
                renderCheckboxField(
                    "Quản lý thời gian màn hình chờ",
                    manageScreenTimeout,
                    (e) => {
                        setManageScreenTimeout(e.target.checked);
                        configuration.manageScreenTimeout = e.target.checked;
                    }
                )
            }
            {
                manageScreenTimeout && renderTextInputField(
                    "number",
                    "Thời gian (s)",
                    "Nhập thời gian (s)",
                    screenTimeoutValue,
                    (e) => {
                        setScreenTimeoutValue(e.target.value);
                        configuration.screenTimeout = e.target.value;
                    },
                    false
                )
            }
            {
                renderCheckboxField(
                    "Khóa âm lượng",
                    lockVolume,
                    (e) => {
                        setLockVolume(e.target.checked);
                        configuration.lockVolume = e.target.checked;
                    }
                )
            }
            {
                renderCheckboxField(
                    "Quản lý âm lượng",
                    manageVolume,
                    (e) => {
                        setManageVolume(e.target.checked);
                        configuration.manageVolume = e.target.checked;
                    }
                )
            }
            {
                manageVolume && renderTextInputField(
                    "number",
                    "Giá trị âm lượng",
                    "Nhập giá trị âm lượng (0-100)",
                    volumeValue,
                    (e) => {
                        const value = e.target.value;
                        if (value >= 0 && value <= 100) {
                            setVolumeValue(value);
                            configuration.volumeValue = value;
                        }
                    },
                    false
                )
            }
            {
                renderCheckboxField(
                    "Tắt chụp màn hình",
                    disableScreenCapture,
                    (e) => {
                        setDisableScreenCapture(e.target.checked);
                        configuration.disableScreenCapture = e.target.checked;
                    }
                )
            }
            <div className={styles.field} style={{paddingBottom: 100}}></div>
        </div>
    );
}