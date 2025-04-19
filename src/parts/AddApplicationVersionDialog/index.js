import React, { useState } from "react";
import styles from "./add_application_version_dialog.module.scss";
import clsx from "clsx";
import fileService from "../../services/file.service";
import applicationService from "../../services/application.service";

const AddApplicationVersionDialog = ({ isOpen, onClose, onSubmit, packageName }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [error, setError] = useState("");
    const [apkFileName, setApkFileName] = useState("");
    const [apkUploadData, setApkUploadData] = useState(null);
    const [version, setVersion] = useState("Chưa phát hiện");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        if (!apkUploadData) {
            setError("Vui lòng chọn file");
            return;
        }
        if (packageName !== apkUploadData.data.fileDetails.pkg) {
            setError("Tên gói không khớp với file apk");
            return;
        }
        applicationService.addApkVersion({
            apkServerPath: apkUploadData.data.serverPath,
            packageName: packageName,
            versionName: apkUploadData.data.fileDetails.version,
            versionCode: apkUploadData.data.fileDetails.versionCode,
        }).then((response) => {
            console.log("Icon added successfully:", response.data.data);
            onSubmit(response.data.data);
            handleClose();
        }).catch((error) => {
            console.error("Error adding icon:", error);
            if (error.response && error.response.data) {
                setError(error.response.data.message);
            }
        });
    };

    const handleClose = () => {
        console.log("Closing dialog");

        if (apkUploadData) {
            fileService.cancelUpload(apkUploadData.data.serverPath)
                .catch((error) => {
                    console.error("Error canceling upload:", error);
                });
        }
        setIsExiting(true);
        setTimeout(() => {
            onClose();
        }, 500);
    }

    const handleClearFile = () => {
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

    const handleFileChange = (e) => {
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

    return (
        <div className={clsx(styles.dialogBackdrop, isExiting && styles.dialogBackdropExit)}>
            <div className={clsx(styles.dialog, isExiting ? styles.dialogExit : styles.dialogEnter)}>
                <label className={styles.title}>Thêm phiên bản</label>
                {
                    error && <label className={styles.error}>{error}</label>
                }
                <div>
                    {
                        renderTextInputField(
                            "Tên gói",
                            "Nhập tên",
                            packageName,
                            null,
                            true,
                        )
                    }
                    {
                        renderTextInputField(
                            "Phiên bản",
                            "Nhập tên",
                            (apkUploadData && apkUploadData.data.fileDetails.version) ?? version,
                            null,
                            true,
                        )
                    }
                    {
                        renderFileInputField(
                            ".apk",
                            "Chọn file",
                            handleFileChange,
                            apkUploadData,
                            apkFileName,
                            handleClearFile,
                        )
                    }
                    <div className={styles.dialogActions}>
                        <button type="button" onClick={handleSubmit}>Thêm</button>
                        <button type="button" onClick={handleClose}>Hủy</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddApplicationVersionDialog;