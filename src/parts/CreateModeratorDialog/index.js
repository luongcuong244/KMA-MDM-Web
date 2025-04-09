import React, { useState } from "react";
import styles from "./create_moderator_dialog.module.scss";
import Popup from "reactjs-popup";
import CircleLoader from "../../components/CircleLoader";
import AlertError from "../../components/AlertError";
import { IoCloseOutline } from "react-icons/io5";
import InputChecker from "../../utils/input_checker";
import adminAccountManagementService from "../../services/admin_account_management.service";
import { fetchModeratorAccountTableData } from "../../slices/moderator_account_table_data.slice";
import { useDispatch } from "react-redux";

const CreateModeratorDialog = ({ setShowDialog }) => {

    const dispatch = useDispatch();

    const [isSendingRequest, setIsSendingRequest] = useState(false);
    const [warning, setWarning] = useState("");
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleNameChange = (event) => {
        const value = event.target.value;
        if (InputChecker.isAlphanumeric(value)) {
            setUserName(event.target.value.toUpperCase());
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!userName) {
            return setWarning("Tên đăng nhập không được để trống!");
        }

        if (!password) {
            return setWarning("Mật khẩu không được để trống!");
        }

        setWarning("");

        setIsSendingRequest(true);
        adminAccountManagementService.createNewUser({ 
            userName,
            password,
        })
            .then(() => {
                setShowDialog(false);
                dispatch(fetchModeratorAccountTableData({
                    pageNo: 1,
                    searchTerm: '',
                }));
            })
            .catch((err) => {
                const message = err?.response?.data?.message;
                if (message) {
                    setWarning(message);
                } else {
                    setWarning("Đã có lỗi xảy ra. Hãy thử lại sau ít phút!");
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
            <h2>Tạo tài khoản</h2>
            {
                warning && 
                <AlertError 
                    text={warning} 
                    style={{marginBottom: 10}} 
                    textSize="0.875rem"
                    showIcon={false}
                />
            }
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Tên đăng nhập</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            id="name"
                            placeholder="Nhập tên đăng nhập"
                            value={userName}
                            onChange={handleNameChange}
                        />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Mật khẩu</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="password"
                            id="password"
                            placeholder="Nhập mật khẩu"
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

export default CreateModeratorDialog;
