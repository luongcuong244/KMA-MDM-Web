import React, { useState } from "react";
import styles from "./change_moderator_password.module.scss";
import Popup from "reactjs-popup";
import CircleLoader from "../../components/CircleLoader";
import AlertError from "../../components/AlertError";
import { IoCloseOutline } from "react-icons/io5";
import adminAccountManagementService from "../../services/admin_account_management.service";

const ChangeModeratorPasswordDialog = ({ setShowDialog, user }) => {
    const [isSendingRequest, setIsSendingRequest] = useState(false);
    const [warning, setWarning] = useState("");
    const [password, setPassword] = useState('');

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!password) {
            return setWarning("Mật khẩu không hợp lệ!");
        }
        setWarning("");

        setIsSendingRequest(true);

        adminAccountManagementService.changeUserPassword(user.userId, password)
            .then(() => {
                setShowDialog(false);
            })
            .catch((error) => {
                let errorMessage = error?.response?.data?.message
                if (errorMessage) {
                    setWarning(errorMessage);
                } else {
                    setWarning("Đã có lỗi xảy ra!");
                }
            })
            .finally(() => {
                setIsSendingRequest(false);
            });
    };

    const closeDialog = () => {
        setShowDialog(false);
    }

    return <Popup
        modal
        open
        overlayStyle={{ background: "#00000080" }}
        onClose={closeDialog}
        closeOnDocumentClick={false}
    >
        <div className={styles.formContainer}>
            <h2>{`Đổi mật khẩu ( ${user.userName} )`}</h2>
            {
                warning &&
                <AlertError
                    text={warning}
                    style={{ marginBottom: 10 }}
                    textSize="0.875rem"
                    showIcon={false}
                />
            }
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Mật khẩu mới</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="password"
                            id="password"
                            placeholder="Nhập mật khẩu mới"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                </div>
                <div className={styles.confirmButton} onClick={handleSubmit}>
                    {
                        isSendingRequest
                            ? <CircleLoader size="15px" strokeWidth="2px" color="transparent" />
                            : <label htmlFor="confirm">Hoàn tất</label>
                    }
                </div>
            </form>
            <div className={styles.closeButton} onClick={closeDialog}>
                <IoCloseOutline color="#000" size={30} />
            </div>
        </div>
    </Popup>
}

export default ChangeModeratorPasswordDialog;