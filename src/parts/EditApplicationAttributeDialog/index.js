import React, { useEffect, useState } from "react";
import styles from "./edit_application_attribute_dialog.module.scss";
import clsx from "clsx";

const EditApplicationAttributeDialog = ({ isOpen, onClose, onSubmit, configuration, applicationSetting }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [error, setError] = useState(null);
    const [attribute, setAttribute] = useState("");
    const [value, setValue] = useState("");
    const [comment, setComment] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const dropdownRef = React.useRef();

    useEffect(() => {
        setAttribute(applicationSetting?.attribute || "");
        setValue(applicationSetting?.value || "");
        setComment(applicationSetting?.comment || "");
        setShowDropdown(false);
        setSearchTerm(applicationSetting?.application?.pkg || "");
        setSelectedApp(applicationSetting?.application || null);
    }, [])

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        if (!selectedApp) {
            setError("Vui lòng chọn ứng dụng");
            return;
        }
        if (!attribute) {
            setError("Vui lòng nhập thuộc tính");
            return;
        }
        if (!value) {
            setError("Vui lòng nhập giá trị");
            return;
        }
        if (attribute != applicationSetting?.attribute) {
            // can't duplicate attribute and package name together
            const existingAppSetting = configuration.applicationSettings.find(appSetting => {
                return appSetting.application.pkg === selectedApp.pkg && appSetting.attribute === attribute;
            });
            if (existingAppSetting) {
                setError("Ứng dụng đã tồn tại thuộc tính này");
                return;
            }
        }
        onSubmit({
            application: selectedApp,
            attribute,
            value,
            comment,
            createdAt: Date.now(),
        });
        handleClose();
    };

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
        }, 500);
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

    return (
        <div className={clsx(styles.dialogBackdrop, isExiting && styles.dialogBackdropExit)}>
            <div className={clsx(styles.dialog, isExiting ? styles.dialogExit : styles.dialogEnter)}>
                {
                    error && <label className={styles.error}>{error}</label>
                }
                <div>
                    <div className={styles.field} ref={dropdownRef}>
                        <label className={styles.label}>Tên ứng dụng</label>
                        <div className={clsx(styles.inputContainer, styles.inputContainerBorder)} style={{ position: "relative" }}>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Tìm và chọn ứng dụng..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSelectedApp(null);
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
                                            configuration.applications
                                                .map(app => app.application)
                                                .filter(app => app && app.pkg?.toLowerCase().includes(searchTerm.toLowerCase()))
                                                .map((app, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => {
                                                            setSelectedApp(app);
                                                            setSearchTerm(app.pkg);
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
                                                        {app.pkg}
                                                    </div>
                                                ))
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    {
                        renderTextInputField(
                            "Thuộc tính",
                            "",
                            attribute,
                            (e) => setAttribute(e.target.value),
                            false
                        )
                    }
                    {
                        renderTextInputField(
                            "Giá trị",
                            "",
                            value,
                            (e) => setValue(e.target.value),
                            false
                        )
                    }
                    {
                        renderTextInputField(
                            "Mô tả",
                            "",
                            comment,
                            (e) => setComment(e.target.value),
                            false
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

export default EditApplicationAttributeDialog;