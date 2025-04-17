import React from "react";
import styles from "./common_settings.module.scss";
import clsx from "clsx";

export default function CommonSettings() {
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [adminPassword, setAdminPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [gps, setGps] = React.useState("Any");
    const [bluetooth, setBluetooth] = React.useState("Any");
    const [wifi, setWifi] = React.useState("Any");
    const [mobileData, setMobileData] = React.useState("Any");
    const [blockUSBStorage, setBlockUSBStorage] = React.useState(false);
    const [manageScreenTimeout, setManageScreenTimeout] = React.useState(false);
    const [screenTimeoutValue, setScreenTimeoutValue] = React.useState("");
    const [lockVolume, setLockVolume] = React.useState(false);
    const [manageVolume, setManageVolume] = React.useState(false);
    const [volumeValue, setVolumeValue] = React.useState("50");
    const [disableScreenCapture, setDisableScreenCapture] = React.useState(false);

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
            {
                renderRadioGroupField(
                    "GPS",
                    [
                        "Any",
                        "Disabled",
                        "Enabled"
                    ],
                    gps,
                    (e) => setGps(e.target.value)
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
                    (e) => setBluetooth(e.target.value)
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
                    (e) => setWifi(e.target.value)
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
                    (e) => setMobileData(e.target.value)
                )
            }
            {
                renderCheckboxField(
                    "Chặn USB Storage",
                    blockUSBStorage,
                    (e) => setBlockUSBStorage(e.target.checked)
                )
            }
            {
                renderCheckboxField(
                    "Quản lý thời gian màn hình chờ",
                    manageScreenTimeout,
                    (e) => setManageScreenTimeout(e.target.checked)
                )
            }
            {
                manageScreenTimeout && renderTextInputField(
                    "text",
                    "Thời gian (s)",
                    "Nhập thời gian (s)",
                    screenTimeoutValue,
                    (e) => setScreenTimeoutValue(e.target.value),
                    false
                )
            }
            {
                renderCheckboxField(
                    "Khóa âm lượng",
                    lockVolume,
                    (e) => setLockVolume(e.target.checked)
                )
            }
            {
                renderCheckboxField(
                    "Quản lý âm lượng",
                    manageVolume,
                    (e) => setManageVolume(e.target.checked)
                )
            }
            {
                manageVolume && renderTextInputField(
                    "text",
                    "Giá trị âm lượng",
                    "Nhập giá trị âm lượng (0-100)",
                    volumeValue,
                    (e) => setVolumeValue(e.target.value),
                    false
                )
            }
            {
                renderCheckboxField(
                    "Tắt chụp màn hình",
                    disableScreenCapture,
                    (e) => setDisableScreenCapture(e.target.checked)
                )
            }
            <div className={styles.field} style={{paddingBottom: 100}}></div>
        </div>
    );
}