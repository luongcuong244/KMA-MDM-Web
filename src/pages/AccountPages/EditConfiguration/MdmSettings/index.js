import React, { useEffect } from "react";
import styles from "./mdm_settings.module.scss";
import clsx from "clsx";

export default function MdmSettings({ configuration }) {
    const [kioskMode, setKiosMode] = React.useState(configuration.kioskMode || false);

    const [mdmApp, setMdmApp] = React.useState(configuration.mdmApp || null);
    const [searchTermMdmApp, setSearchTermMdmApp] = React.useState(configuration.mdmApp || "");
    const [showDropdownMdmApp, setShowDropdownMdmApp] = React.useState(false);

    const [adminReceiverClass, setAdminReceiverClass] = React.useState(configuration.adminReceiverClass || "");

    const [selectedKioskApps, setSelectedKioskApps] = React.useState([]);
    const [searchTermKioskApp, setSearchTermKioskApp] = React.useState("");
    const [showDropdownKisokApp, setShowDropdownKisokApp] = React.useState(false);

    const [showKioskExitButton, setShowKioskExitButton] = React.useState(configuration.showKioskExitButton || false);
    const [lockThePowerButton, setLockThePowerButton] = React.useState(configuration.lockThePowerButton || false);
    const [wifiSSID, setWifiSSID] = React.useState(configuration.wifiSSID || "");
    const [wifiPassword, setWifiPassword] = React.useState(configuration.wifiPassword || "");
    const [restrictions, setRestrictions] = React.useState(configuration.restrictions || "");

    useEffect(() => {
        if (configuration.kioskApps) {
            setSelectedKioskApps(
                configuration.applications
                    .map((appConfig) => appConfig.application)
                    .filter(app => app && configuration.kioskApps.includes(app.pkg))
            );
        }
    }, []);

    console.log("MdmSettings configuration", configuration);

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

    const renderApplicationSearchInputField = (label, placeholder, value, onChange, disable, showDropdown, searchTerm, onClickItem) => {
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <div className={clsx(styles.inputContainer, styles.inputContainerBorder)} style={{ position: "relative" }}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        disabled={disable}
                    />
                    {
                        showDropdown && searchTerm !== "" && (
                            <div style={{
                                position: "absolute",
                                top: "36px",
                                left: 0,
                                right: 0,
                                backgroundColor: "#fff",
                                border: "1px solid #ccc",
                                borderTop: "none",
                                borderRadius: "0 0 4px 4px",
                                maxHeight: "200px",
                                overflowY: "auto",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                                zIndex: 10
                            }}>
                                {
                                    configuration.applications
                                        .map((appConfig) => appConfig.application)
                                        .filter(app => app && app.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((app, index) => (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    onClickItem(app);
                                                }}
                                                style={{
                                                    padding: "8px 12px",
                                                    cursor: "pointer",
                                                    borderBottom: "1px solid #eee"
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                                                onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                                            >
                                                {app.name}
                                            </div>
                                        ))
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        );
    };

    const renderMultiApplicationSearchInputField = (
        label,
        placeholder,
        selectedApps,
        searchTerm,
        onChangeSearch,
        showDropdown,
        onClickItem,
        onRemoveItem
    ) => {
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <div
                    className={clsx(styles.inputContainer, styles.inputContainerBorder)}
                    style={{ position: "relative", flexWrap: "wrap", minHeight: "34px" }}
                >
                    {/* Hiển thị các app đã chọn */}
                    {
                        selectedApps.map((app, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    background: "#e1ecf4",
                                    borderRadius: "16px",
                                    padding: "2px 8px",
                                    margin: "4px",
                                }}
                            >
                                <span style={{ marginRight: "8px" }}>{app.name}</span>
                                <button
                                    onClick={() => onRemoveItem(app)}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        fontWeight: "bold"
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))
                    }

                    {/* Input để search */}
                    <input
                        type="text"
                        className={styles.input}
                        style={{ minWidth: "150px", flex: 1 }}
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={onChangeSearch}
                    />

                    {/* Dropdown search */}
                    {
                        showDropdown && searchTerm !== "" && (
                            <div style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                right: 0,
                                backgroundColor: "#fff",
                                border: "1px solid #ccc",
                                borderTop: "none",
                                borderRadius: "0 0 4px 4px",
                                maxHeight: "200px",
                                overflowY: "auto",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                                zIndex: 10
                            }}>
                                {
                                    configuration.applications
                                        .map((appConfig) => appConfig.application)
                                        .filter(app => app && app.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .filter(app => !selectedApps.some(a => a.pkg === app.pkg)) // Loại trùng
                                        .map((app, index) => (
                                            <div
                                                key={index}
                                                onClick={() => onClickItem(app)}
                                                style={{
                                                    padding: "8px 12px",
                                                    cursor: "pointer",
                                                    borderBottom: "1px solid #eee"
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                                                onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                                            >
                                                {app.name}
                                            </div>
                                        ))
                                }
                            </div>
                        )
                    }
                </div>
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
                renderCheckboxField(
                    "Chế độ Kiosk",
                    kioskMode,
                    (e) => {
                        setKiosMode(e.target.checked);
                        configuration.kioskMode = e.target.checked;
                    }
                )
            }
            {
                renderApplicationSearchInputField(
                    "Ứng dụng MDM",
                    "Tìm và chọn ứng dụng",
                    searchTermMdmApp,
                    (e) => {
                        setMdmApp(null);
                        configuration.mdmApp = null;

                        setShowDropdownMdmApp(true);
                        setSearchTermMdmApp(e.target.value);
                    },
                    false,
                    showDropdownMdmApp,
                    searchTermMdmApp,
                    (app) => {
                        setMdmApp(app.pkg);
                        configuration.mdmApp = app.pkg;

                        setSearchTermMdmApp(app.name);
                        setShowDropdownMdmApp(false);
                    }
                )
            }
            {
                renderTextInputField(
                    "text",
                    "Admin Receiver Class",
                    "Nhập admin receiver class",
                    adminReceiverClass,
                    (e) => {
                        setAdminReceiverClass(e.target.value);
                        configuration.adminReceiverClass = e.target.value;
                    },
                    false
                )
            }
            {
                kioskMode && renderMultiApplicationSearchInputField(
                    "Ứng dụng trong chế độ kiosk",
                    "Tìm và chọn ứng dụng",
                    selectedKioskApps,
                    searchTermKioskApp,
                    (e) => {
                        setSearchTermKioskApp(e.target.value);
                        setShowDropdownKisokApp(true);
                    },
                    showDropdownKisokApp,
                    (app) => {
                        setSelectedKioskApps([...selectedKioskApps, app]);
                        configuration.kioskApps = [...selectedKioskApps, app].map(app => app.pkg);

                        setSearchTermKioskApp("");
                        setShowDropdownKisokApp(false);
                    },
                    (appToRemove) => {
                        setSelectedKioskApps(selectedKioskApps.filter(app => app.pkg !== appToRemove.pkg));
                        configuration.kioskApps = selectedKioskApps.filter(app => app.pkg !== appToRemove.pkg).map(app => app.pkg);
                    }
                )
            }
            {
                kioskMode && renderCheckboxField(
                    "Hiện nút thoát chế độ kiosk",
                    showKioskExitButton,
                    (e) => {
                        setShowKioskExitButton(e.target.checked);
                        configuration.showKioskExitButton = e.target.checked;
                    }
                )
            }
            {
                kioskMode && renderCheckboxField(
                    "Khóa nút nguồn",
                    lockThePowerButton,
                    (e) => {
                        setLockThePowerButton(e.target.checked);
                        configuration.lockThePowerButton = e.target.checked;
                    }
                )
            }
            {
                renderTextInputField(
                    "text",
                    "SSID Wi - Fi",
                    "Nhập ssid wifi - bỏ trống nếu nhập thủ công",
                    wifiSSID,
                    (e) => {
                        setWifiSSID(e.target.value);
                        configuration.wifiSSID = e.target.value;
                    },
                    false
                )
            }
            {
                renderTextInputField(
                    "text",
                    "Mật khẩu Wifi",
                    "Nhập mật khẩu wifi - bỏ trống nếu nhập thủ công",
                    wifiPassword,
                    (e) => {
                        setWifiPassword(e.target.value);
                        configuration.wifiPassword = e.target.value;
                    },
                    false
                )
            }
            {
                <div className={styles.field}>
                    <label className={styles.label}>
                        Hạn chế
                        <br/>
                        <a 
                            href="https://developer.android.com/reference/android/os/UserManager" 
                            target="_blank"
                            style={{fontSize: "0.8rem"}}
                        >Thêm...</a>
                    </label>
                    <div className={clsx(styles.inputContainer, styles.inputContainerBorder)} style={{ height: "60px" }}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={"Là các User Restriction trong android, ngăn cách bởi dấu phẩy, ví dụ: no_sms,no_outgoing_calls,no_uninstall_apps,..."}
                            value={restrictions}
                            onChange={(e) => {
                                setRestrictions(e.target.value);
                                configuration.restrictions = e.target.value;
                            }}
                        />
                    </div>
                </div>
            }
            {/* Placeholder for future fields */}
            <div className={styles.field} style={{ paddingBottom: 100 }}></div>
        </div>
    );
}