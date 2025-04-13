import React, { useState } from "react";
import styles from "./add_icon_dialog.module.scss";
import clsx from "clsx";
import fileService from "../../services/file.service";
import applicationService from "../../services/application.service";

const AddIconDialog = ({ isOpen, onClose, onSubmit }) => {
    const [error, setError] = useState("");
    const [fileName, setFileName] = useState("");
    const [uploadData, setUploadData] = useState(null);
    const [name, setName] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        if (!name.trim()) {
            setError("Tên ứng dụng không được để trống");
            return;
        }
        if (!uploadData) {
            setError("Vui lòng chọn file");
            return;
        }
        applicationService.addAppIcon({
            name: name,
            serverPath: uploadData.serverPath,
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

        if (uploadData) {
            fileService.cancelUpload(uploadData.serverPath)
                .catch((error) => {
                    console.error("Error canceling upload:", error);
                    setError("Error canceling upload");
                });
        }
        onClose();
    }

    const handleClearFile = () => {
        if (!uploadData) return;
        fileService.cancelUpload(uploadData.serverPath)
            .then(() => {
                setFileName("");
                setUploadData(null);
            })
            .catch((error) => {
                console.error("Error canceling upload:", error);
                setError("Error canceling upload");
            });
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // must be small than 10MB
            if (file.size > 5 * 1024 * 1024) {
                setError("Dung lượng file không được lớn hơn 10MB");
                // clear the input
                e.target.value = null;
                return;
            }
            // check image dimension, must be square
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                if (img.width !== img.height) {
                    setError("Kích thước icon phải là hình vuông");
                    // clear the input
                    e.target.value = null;
                    return;
                }
                setError("");
                // get file name
                setFileName(file.name);

                const formData = new FormData();
                formData.append("file", file);
                // Call the upload function here
                fileService.uploadFile(formData)
                    .then((response) => {
                        setUploadData(response.data);
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
            }
            img.onerror = () => {
                setError("Kích thước file không đúng");
                return;
            }
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
        <div className={styles.dialogBackdrop}>
            <div className={styles.dialog}>
                <label className={styles.title}>Thêm icon</label>
                {
                    error && <label className={styles.error}>{error}</label>
                }
                <div>
                    {
                        renderTextInputField(
                            "Tên",
                            "Nhập tên",
                            name,
                            (e) => setName(e.target.value),
                            false
                        )
                    }
                    {
                        renderFileInputField(
                            ".png",
                            "Chọn file",
                            handleFileChange,
                            uploadData,
                            fileName,
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

export default AddIconDialog;