import React, { useEffect, useState } from "react";
import styles from "./edit_application_dialog.module.scss";
import clsx from "clsx";
import applicationService from "../../services/application.service";
import AddIconDialog from "../AddIconDialog";

const EditApplicationDialog = ({ isOpen, onClose, onSubmit, application }) => {
    const [error, setError] = useState("");
    const [packageName, setPackageName] = useState(application.pkg ?? "");
    const [appName, setAppName] = useState(application.name ?? "");
    const [showIcon, setShowIcon] = useState(application.showIcon ?? false);
    const [iconName, setIconName] = useState(application.iconText ?? "");

    const [openAddNewIconDialog, setOpenAddNewIconDialog] = useState(false);
    const [appIcons, setAppIcons] = useState([null]);
    const [iconId, setIconId] = useState(application.icon ?? null);

    useEffect(() => {
        applicationService.getAppIcon()
            .then((response) => {
                if (response.data && response.data.data) {
                    setAppIcons([null, ...response.data.data]);
                } else {
                    console.error("No data found in response");
                }
            })
            .catch((error) => {
                console.error("Error fetching app icons:", error);
            });
    }, []);

    if (!isOpen || !application) return null;

    const handleSubmit = (e) => {
        if (!appName.trim()) {
            setError("Tên ứng dụng không được để trống");
            return;
        }
        if (application.isSystemApp) {
            if (!packageName.trim()) {
                setError("Tên package không được để trống");
                return;
            }
        }
        setError("");

        console.log("iconID", iconId);
        console.log("iconName", iconName)

        applicationService.editApplication({
            id: application._id,
            appName: appName,
            packageName: application.isSystemApp ? packageName : application.pkg,
            showIcon: showIcon,
            iconId: showIcon ? iconId : null,
            iconName: showIcon ? (!iconName ? null : iconName) : null,
            isSystemApp: application.isSystemApp,
        }).then((response) => {
            if (response.data) {
                console.log("Application added successfully:", response.data.message);
                onSubmit(response.data.data);
                handleClose();
            }
        }).catch((error) => {
            console.error("Error adding application:", error);
            if (error.response && error.response.data) {
                setError(error.response.data.message);
            } else {
                setError("Error adding application");
            }
        });
    };

    const handleClose = () => {
        onClose();
    }

    const handleAddNewIcon = (icon) => {
        setAppIcons((prevIcons) => [...prevIcons, icon]);
    }

    const renderTextInputField = (label, placeholder, value, onChange, disable) => {
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <div className={clsx(styles.inputContainer, styles.inputContainerBorder)}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        disabled={disable}
                    />
                </div>
            </div>
        );
    };

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

    const renderFileInputField = (accept, label, handleFileChange, showClearButton, fileName, onClear) => {
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                {
                    showClearButton ? (
                        <div className={styles.inputContainer}>
                            <label className={styles.fileName}>{fileName}</label>
                            <button className={styles.clearButton} onClick={onClear}>Xoá</button>
                        </div>
                    ) : (
                        <div className={clsx(styles.inputContainer, styles.inputContainerBorder)}>
                            <input
                                type="file"
                                accept={accept}
                                className={styles.input}
                                onChange={handleFileChange}
                            />
                        </div>
                    )
                }
            </div>
        );
    };

    const renderComboBoxField = (label, options, value, onChange, onAddNew) => {
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <div className={styles.inputContainer}>
                    <div className={styles.inputContainerBorder} style={{ flex: 1, height: "100%", display: "flex", alignItems: "center", marginRight: 16 }}>
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
                    <button className={styles.clearButton} onClick={onAddNew}>Thêm</button>
                </div>
            </div>
        );
    }

    const lastestVersion = application.versions.length > 0 ? application.versions.reduce((latest, current) =>
        current.versionCode > latest.versionCode ? current : latest
    ) : {
        versionCode: 0,
        versionName: "0",
        url: "",
    };

    return (
        <div className={styles.dialogBackdrop}>
            <div className={styles.dialog}>
                <label className={styles.title}>Sửa ứng dụng</label>
                {
                    error && <label className={styles.error}>{error}</label>
                }
                <div>
                    {
                        renderTextInputField(
                            "Tên Package",
                            "Nhập package",
                            application.isSystemApp ? packageName : application.pkg,
                            (e) => setPackageName(e.target.value),
                            !application.isSystemApp,
                        )
                    }
                    {
                        renderTextInputField(
                            "Tên ứng dụng",
                            "Nhập tên ứng dụng",
                            appName,
                            (e) => setAppName(e.target.value),
                            false
                        )
                    }
                    {
                        renderTextInputField(
                            "Phiên bản",
                            "Nhập phiên bản",
                            lastestVersion.versionName,
                            null,
                            true
                        )
                    }
                    {
                        renderCheckboxField(
                            "Ứng dụng hệ thống",
                            application.isSystemApp,
                            null,
                            true
                        )
                    }
                    {
                        renderCheckboxField(
                            "Hiển thị icon",
                            showIcon,
                            (e) => setShowIcon(e.target.checked)
                        )
                    }
                    {
                        showIcon && renderTextInputField(
                            "Tên icon",
                            "(Mặc định)",
                            iconName,
                            (e) => setIconName(e.target.value),
                            false
                        )
                    }
                    {
                        showIcon && renderComboBoxField(
                            "Icon",
                            appIcons.map((icon) => {
                                return {
                                    label: icon ? icon.name : "(Mặc định)",
                                    value: icon ? icon._id : "default",
                                };
                            }),
                            iconId ?? "default",
                            e => {
                                const value = e.target.value === "default" ? null : e.target.value;
                                setIconId(value);
                            },
                            () => setOpenAddNewIconDialog(true),
                        )
                    }
                    <div className={styles.dialogActions}>
                        <button type="button" onClick={handleSubmit}>Cập nhật</button>
                        <button type="button" onClick={handleClose}>Hủy</button>
                    </div>
                </div>
            </div>
            {
                openAddNewIconDialog && <AddIconDialog isOpen={openAddNewIconDialog} onClose={() => setOpenAddNewIconDialog(false)} onSubmit={handleAddNewIcon} />
            }
        </div>
    );
};

export default EditApplicationDialog;