import React, { useState } from "react";
import styles from "./add_application_dialog.module.scss";
import clsx from "clsx";
import fileService from "../../services/file.service";
import applicationService from "../../services/application.service";

const AddApplicationDialog = ({ isOpen, onClose, onSubmit }) => {
    const [uploadData, setUploadData] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const values = Object.fromEntries(data.entries());

        applicationService.addApplication({
            apkServerPath: uploadData.data.serverPath,
        }).then((response) => {
            onSubmit(values);
            handleClose();
        })
    };

    const handleClose = () => {
        if (uploadData) {
            fileService.cancelUpload(uploadData.data.serverPath)
                .catch((error) => {
                    console.error("Error canceling upload:", error);
                });
        }
        onClose();
    }

    const handleApkFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("apkFile", file);
            // Call the upload function here
            fileService.uploadApk(formData)
                .then((response) => {
                    setUploadData(response.data);
                    console.log("File uploaded successfully:", response.data);
                })
                .catch((error) => {
                    console.error("Error uploading file:", error);
                });
        } else {
            console.log("No file selected");
        }
    };

    const renderTextInputField = (label, placeholder) => {
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <div className={clsx(styles.inputContainer, styles.inputContainerBorder)}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder={placeholder}
                    />
                </div>
            </div>
        );
    };

    const renderCheckboxField = (label) => {
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <div className={styles.inputContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkBox}
                    />
                </div>
            </div>
        );
    };

    const renderFileInputField = (label, handleFileChange) => {
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <div className={clsx(styles.inputContainer, styles.inputContainerBorder)}>
                    <input
                        type="file"
                        accept=".apk"
                        className={styles.input}
                        onChange={handleFileChange}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className={styles.dialogBackdrop}>
            <div className={styles.dialog}>
                <label className={styles.title}>Thêm ứng dụng</label>
                <form onSubmit={handleSubmit}>
                    {
                        renderTextInputField("Tên Package", "Nhập package")
                    }
                    {
                        renderTextInputField("Tên ứng dụng", "Nhập tên ứng dụng")
                    }
                    {
                        renderTextInputField("Phiên bản", "Nhập phiên bản")
                    }
                    {
                        renderCheckboxField("Ứng dụng hệ thống")
                    }
                    {
                        renderFileInputField("Chọn file APK", handleApkFileChange)
                    }
                    {
                        renderCheckboxField("Hiển thị icon")
                    }
                    {
                        renderTextInputField("Tên icon", "(Mặc định)")
                    }
                    {
                        renderFileInputField("Icon")
                    }
                    <div className={styles.dialogActions}>
                        <button type="submit">Thêm</button>
                        <button type="button" onClick={handleClose}>Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddApplicationDialog;