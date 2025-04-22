import React from "react";
import styles from "./device_qr_code_dialog.module.scss";
import clsx from "clsx";
import CONSTANT from "../../utils/constant";

const DeviceQRCodeDialog = ({ isOpen, onClose, device }) => {
    const [isExiting, setIsExiting] = React.useState(false);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
        }, 500);
    }

    return (
        <div className={clsx(styles.dialogBackdrop, isExiting && styles.dialogBackdropExit)}>
            <div className={clsx(styles.dialog, isExiting ? styles.dialogExit : styles.dialogEnter)}>
                <label className={styles.title}>Mã QR</label>
                <div>
                    <img
                        src={`${CONSTANT.baseUrl}/${device.qrCode}`}
                        alt="QR Code"
                        className={styles.qrCode}
                    />
                </div>
            </div>
        </div>
    );
};

export default DeviceQRCodeDialog;