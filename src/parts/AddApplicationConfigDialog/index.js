import React, { useEffect, useState } from "react";
import styles from "./add_application_config_dialog.module.scss";
import clsx from "clsx";
import applicationService from "../../services/application.service";

const AddApplicationConfigDialog = ({ configuration, isOpen, onClose, onSubmit }) => {
    const [error, setError] = useState("");
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        applicationService.getAvailableApplicationForConfig({
            configId: configuration._id,
        }).then((response) => {
                if (response.data && response.data.data) {
                    setApplications([null, ...applications]);
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

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        
    };

    const handleClose = () => {
        onClose();
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
                {
                    // show search bar here
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