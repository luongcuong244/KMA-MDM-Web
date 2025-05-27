import React, { useState, useEffect } from "react";
import styles from "./profile.module.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../../../slices/user.slice";
import Loader from "../../../components/Loader";
import AlertError from "../../../components/AlertError";
import userService from "../../../services/user.service";

export default function Profile() {
    const [user, setUser] = useState(useSelector(selectUser));
    const [waitingForServer, setWaitingForServer] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [warning, setWarning] = useState("");

    useEffect(() => {
        userService.getCurrentUser()
            .then((res) => {
                if (res) {
                    setUser(res);
                } else {
                    setWarning("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.");
                }
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
                setWarning("Đã có lỗi xảy ra khi lấy thông tin người dùng. Vui lòng thử lại sau.");
            });
    }, []);

    const handleOldPasswordChange = (event) => {
        setOldPassword(event.target.value);
    }

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    }

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    }

    const renderLabelField = (label, value) => {
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <p className={styles.value}>{value}</p>
            </div>
        );
    };

    const renderPasswordInputField = (label, placeholder, onChange) => {
        return (
            <div className={styles.field}>
                <label className={styles.label}>{label}</label>
                <div className={styles.inputContainer}>
                    <input
                        type="password"
                        className={styles.input}
                        placeholder={placeholder}
                        onChange={onChange}
                    />
                </div>
            </div>
        );
    };

    const onClickSaveButton = () => {
        if (!oldPassword) {
            return setWarning("Mật khẩu cũ không được để trống!");
        }
        if (!newPassword) {
            return setWarning("Mật khẩu mới không được để trống!");
        }
        if (!confirmPassword) {
            return setWarning("Nhập lại mật khẩu mới không được để trống!");
        }
        if (newPassword !== confirmPassword) {
            return setWarning("Mật khẩu mới không khớp!");
        }
        if (newPassword === oldPassword) {
            return setWarning("Mật khẩu mới không được giống mật khẩu cũ!");
        }
        setWarning("");
        setWaitingForServer(true);
        // Call the change password API here
        userService.changePassword(oldPassword, newPassword)
            .then((res) => {
                if (res.status === 200) {
                    window.location.reload();
                } else {
                    setWarning("Đã có lỗi xảy ra. Hãy thử lại sau ít phút!");
                }
            })
            .catch((error) => {
                if (error.response && error.response.data?.message) {
                    const message = error.response.data.message;
                    setWarning(message);
                } else {
                    setWarning("Đã có lỗi xảy ra. Hãy thử lại sau ít phút!");
                }
            })
            .finally(() => {
                setWaitingForServer(false);
            });
    }

    return (
        <div id={styles.root}>
            <div className={styles.field} style={{ justifyContent: "end", paddingLeft: 32 }}>
                <div style={{ width: "70%" }}>
                    <p className={styles.title}>Thông tin cá nhân</p>
                </div>
            </div>
            {
                renderLabelField("Tên người dùng", user.userName)
            }
            {
                renderLabelField("Vai trò", user.role)
            }
            {
                renderLabelField("Giới hạn thiết bị", `${user.managedDevicesCount ?? "-"} / ${user.maxManagedDevices ?? "-"}`)
            }
            {/* {
                renderLabelField("Giới hạn bộ nhớ", "45 / 100 GB")
            } */}
            <div className={styles.field} style={{ justifyContent: "end", paddingLeft: 32 }}>
                <div style={{ width: "70%" }}>
                    <p className={styles.title}>Đổi mật khẩu</p>
                </div>
            </div>
            {
                renderPasswordInputField("Mật khẩu cũ", "Nhập mật khẩu cũ", handleOldPasswordChange)
            }
            {
                renderPasswordInputField("Mật khẩu mới", "Nhập mật khẩu mới", handleNewPasswordChange)
            }
            {
                renderPasswordInputField("Nhập lại mật khẩu mới", "Nhập lại mật khẩu mới", handleConfirmPasswordChange)
            }
            <>{warning && <AlertError text={warning} style={{ backgroundColor: "transparent", color: "red" }} />}</>
            <div className={styles.field} style={{ justifyContent: "start" }}>
                <div style={{ width: "31%", display: "flex", justifyContent: "end" }}>
                    <button
                        className={styles.saveButton}
                        onClick={onClickSaveButton}
                        disabled={waitingForServer}
                    >
                        {waitingForServer ? <Loader /> : "Lưu"}
                    </button>
                </div>
            </div>
        </div>
    );
}