import React, { useEffect, useState } from "react";
import styles from "./add_application_config_dialog.module.scss";
import clsx from "clsx";
import applicationService from "../../services/application.service";

const AddApplicationConfigDialog = ({ configuration, isOpen, onClose, onSubmit }) => {
    const [error, setError] = useState("");
    const [applications, setApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [action, setAction] = useState("install");
    const [showIcon, setShowIcon] = useState(true);
    const dropdownRef = React.useRef();

    useEffect(() => {
        applicationService.getAvailableApplicationForConfig({
            configId: configuration._id,
        }).then((response) => {
                if (response.data && response.data.data) {
                    setApplications([null, ...response.data.data]);
                } else {
                    console.error("No data found in response");
                }
            })
            .catch((error) => {
                console.error("Error fetching apps:", error);
                if (error.response && error.response.data) {
                    setError(error.response.data.message);
                } else {
                    setError("Error fetching apps");
                }
            });
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        if (!selectedApp) {
            setError("Vui lòng chọn ứng dụng");
            return;
        }
        let lastestVersion = selectedApp.versions.length > 0 ? selectedApp.versions.reduce((latest, current) =>
            current.versionCode > latest.versionCode ? current : latest
        ) : {
            versionCode: 0,
            versionName: "0",
            url: "",
        };
        onSubmit({
            application: selectedApp,
            version: lastestVersion,
            screenOrder: 0,
            showIcon: showIcon === "true",
            remove: action === "uninstall",
            runAfterInstall: false,
            runAtBoot: false,
        })
    };

    const handleClose = () => {
        onClose();
    }

    const renderComboBoxField = (label, options, value, onChange) => {
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <div className={styles.inputContainer}>
                    <div className={styles.inputContainerBorder} style={{ flex: 1, height: "100%", display: "flex", alignItems: "center"}}>
                        <select
                            className={styles.input}
                            value={value}
                            onChange={onChange}
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
        <div className={styles.dialogBackdrop}>
            <div className={styles.dialog}>
                {
                    error && <label className={styles.error}>{error}</label>
                }
                <label className={styles.title}>Cấu hình</label>
                <div className={styles.field}>
                    <div className={clsx(styles.inputContainer, styles.inputContainerBorder)} style={{ width: "100%" }}>
                        <input
                            type="text"
                            className={styles.input}
                            value={configuration && configuration.name ? configuration.name : ""}
                            disabled={true}
                        />
                    </div>
                </div>
                <div className={styles.field} ref={dropdownRef}>
                    <label className={styles.label}>Tên ứng dụng</label>
                    <div className={clsx(styles.inputContainer, styles.inputContainerBorder)} style={{ position: "relative" }}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Nhập tên ứng dụng..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSelectedApp(null);
                                setShowIcon(true);
                                setAction("install");
                                setSearchTerm(e.target.value);
                                setShowDropdown(true);
                            }}
                            onFocus={() => setShowDropdown(true)}
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
                                    zIndex: 10
                                }}>
                                    {
                                        applications
                                            .filter(app => app && app.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map((app, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => {
                                                        setSelectedApp(app);
                                                        setSearchTerm(app.name);
                                                        setShowDropdown(false);
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
                {
                    selectedApp && !selectedApp.isSystemApp && renderComboBoxField(
                        "Hành động",
                        [
                            {
                                label: "Cài đặt",
                                value: "install",
                            },
                            {
                                label: "Gỡ cài đặt",
                                value: "uninstall",
                            },
                        ],
                        action,
                        e => setAction(e.target.value),
                    )
                }
                {
                    selectedApp && renderComboBoxField(
                        "Icon",
                        [
                            {
                                label: "Hiển thị",
                                value: true,
                            },
                            {
                                label: "Ẩn",
                                value: false,
                            },
                        ],
                        showIcon,
                        e => {
                            setShowIcon(e.target.value);
                        },
                    )
                }
                <div className={styles.dialogActions}>
                    <button type="button" onClick={handleSubmit}>Thêm</button>
                    <button type="button" onClick={handleClose}>Hủy</button>
                </div>
            </div>
        </div>
    );

};
export default AddApplicationConfigDialog;