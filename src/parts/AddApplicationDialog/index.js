import React, { useEffect, useState } from "react";
import styles from "./add_application_dialog.module.scss";
import clsx from "clsx";
import fileService from "../../services/file.service";
import applicationService from "../../services/application.service";
import AddIconDialog from "../AddIconDialog";

const AddApplicationDialog = ({ isOpen, onClose, onSubmit }) => {
    const [error, setError] = useState("");
    const [apkFileName, setApkFileName] = useState("");
    const [apkUploadData, setApkUploadData] = useState(null);
    const [packageName, setPackageName] = useState("");
    const [appName, setAppName] = useState("");
    const [version, setVersion] = useState("");
    const [isSystemApp, setIsSystemApp] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    const [iconName, setIconName] = useState("");

    const [openAddNewIconDialog, setOpenAddNewIconDialog] = useState(false);
    const [appIcons, setAppIcons] = useState([null]);
    const [iconId, setIconId] = useState(null);

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

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        if (!appName.trim()) {
            setError("Tên ứng dụng không được để trống");
            return;
        }
        if (isSystemApp) {
            if (!packageName.trim()) {
                setError("Tên package không được để trống");
                return;
            }
        } else {
            if (!apkUploadData) {
                setError("Vui lòng tải lên file APK");
                return;
            }
        }
        setError("");

        applicationService.addApplication({
            apkServerPath: apkUploadData ? apkUploadData.data.serverPath : null,
            appName: appName,
            packageName: isSystemApp ? packageName : apkUploadData.data.fileDetails.pkg,
            versionName: isSystemApp ? "0" : apkUploadData.data.fileDetails.version,
            versionCode: isSystemApp ? 0 : apkUploadData.data.fileDetails.versionCode,
            isSystemApp: isSystemApp,
            showIcon: showIcon,
            iconId: showIcon ? iconId : null,
            iconName: showIcon ? (!iconName ? null : iconName) : null,
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
        console.log("Closing dialog");

        if (apkUploadData) {
            fileService.cancelUpload(apkUploadData.data.serverPath)
                .catch((error) => {
                    console.error("Error canceling upload:", error);
                    setError("Error canceling upload");
                });
        }
        onClose();
    }

    const handleClearApkFile = () => {
        if (!apkUploadData || !apkUploadData.data) return;
        fileService.cancelUpload(apkUploadData.data.serverPath)
            .then(() => {
                setApkFileName("");
                setApkUploadData(null);
                setError("");
            })
            .catch((error) => {
                console.error("Error canceling upload:", error);
                setError("Error canceling upload");
            });
    }

    const handleApkFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // get file name
            setApkFileName(file.name);

            const formData = new FormData();
            formData.append("apkFile", file);
            // Call the upload function here
            fileService.uploadApk(formData)
                .then((response) => {
                    setApkUploadData(response.data);
                    setError("");
                    console.log("File uploaded successfully:", response.data);
                })
                .catch((error) => {
                    console.error("Error uploading file:", error);
                    if (error.response && error.response.data) {
                        setError(error.response.data.message);
                    } else {
                        setError("Error uploading file");
                    }
                });
        } else {
            console.log("No file selected");
        }
    };

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

    return (
        <div className={styles.dialogBackdrop}>
            <div className={styles.dialog}>
                <label className={styles.title}>Thêm ứng dụng</label>
                {
                    error && <label className={styles.error}>{error}</label>
                }
                <div>
                    {
                        renderTextInputField(
                            "Tên Package",
                            "Nhập package",
                            isSystemApp ? packageName : (apkUploadData && apkUploadData.data.fileDetails.pkg) ?? packageName,
                            (e) => setPackageName(e.target.value),
                            isSystemApp ? false : apkUploadData && apkUploadData.data.fileDetails.pkg
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
                            isSystemApp ? "0" : (apkUploadData && apkUploadData.data.fileDetails.version) ?? version,
                            (e) => setVersion(e.target.value),
                            true
                        )
                    }
                    {
                        renderCheckboxField(
                            "Ứng dụng hệ thống",
                            isSystemApp,
                            (e) => setIsSystemApp(e.target.checked)
                        )
                    }
                    {
                        !isSystemApp && renderFileInputField(
                            ".apk",
                            "Chọn file APK", 
                            handleApkFileChange,
                            apkUploadData,
                            apkFileName,
                            handleClearApkFile,
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
                                    value: icon ? icon._id : null,
                                };
                            }),
                            iconId,
                            (e) => setIconId(e.target.value),
                            () => setOpenAddNewIconDialog(true),
                        )
                    }
                    <div className={styles.dialogActions}>
                        <button type="button" onClick={handleSubmit}>Thêm</button>
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

export default AddApplicationDialog;