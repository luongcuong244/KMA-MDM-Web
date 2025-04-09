import React, { useEffect, useState } from "react";
import styles from "./moderator_permission.module.scss";
import Popup from "reactjs-popup";
import CircleLoader from "../../components/CircleLoader";
import AlertError from "../../components/AlertError";
import { IoCloseOutline } from "react-icons/io5";
import adminAccountManagementService from "../../services/admin_account_management.service";

const ModeratorPermissionDialog = ({ setShowDialog, user }) => {
    const [isSendingRequest, setIsSendingRequest] = useState(false);
    const [permissions, setPermissions] = useState([]);
    const [warning, setWarning] = useState("");

    useEffect(() => {
        setIsSendingRequest(true);
        adminAccountManagementService.fetchModeratorPermission(user.userId)
            .then((data) => {
                setPermissions(data);
                console.log(data);
            })
            .catch((error) => {
                setShowDialog(false);
                let errorMessage = error?.response?.data?.message
                if (errorMessage) {
                    alert(errorMessage);
                } else {
                    alert("Đã có lỗi xảy ra!");
                }
            })
            .finally(() => {
                setIsSendingRequest(false);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        let changedPermission = permissions.filter((permission) => permission.checked !== permission.granted);

        if (changedPermission.length === 0) {
            setWarning("Không có thay đổi nào được thực hiện!");
            return;
        }

        setWarning("");

        console.log(changedPermission);

        setIsSendingRequest(true);
        adminAccountManagementService.changeModeratorPermission(user.userId, changedPermission)
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
            <h2>{`Cấp quyền ( ${user.userName} )`}</h2>
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
                    {
                        permissions.map((permission, index) => {
                            return <div key={index} className={styles.permissionItem}>
                                <label>
                                    <input 
                                        type="checkbox"
                                        onChange={() => {
                                            const newPermissions = [...permissions];
                                            newPermissions[index].checked = !newPermissions[index].checked;
                                            setPermissions(newPermissions);
                                        }}
                                        checked={permission.checked}
                                    /> 
                                    {permission.description}
                                </label>
                            </div>
                        })
                    }
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

export default ModeratorPermissionDialog;