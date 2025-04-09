import React, { useState } from "react";
import styles from "./create_user_dialog.module.scss";
import Popup from "reactjs-popup";
import CircleLoader from "../../components/CircleLoader";
import AlertError from "../../components/AlertError";
import { IoCloseOutline } from "react-icons/io5";
import InputChecker from "../../utils/input_checker";
import moderatorAccountManagementService from "../../services/moderator_account_management.service";

const CreateUserDialog = ({ setShowDialog }) => {

    const [isSendingRequest, setIsSendingRequest] = useState(false);
    const [warning, setWarning] = useState("");
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    // const [citizenIdentityCard, setCitizenIdentityCard] = useState(null);

    const handleNameChange = (event) => {
        const value = event.target.value;
        if (InputChecker.isAlphanumeric(value)) {
            setUserName(event.target.value.toUpperCase());
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];

    //     const image = new Image();

    //     const reader = new FileReader();
    //     reader.onload = function (readerEvent) {
    //         image.onload = function () {
    //             const width = image.width;
    //             const height = image.height;

    //             const minDimension = 400;
    //             const maxRatio = 4;

    //             if (width < minDimension || height < minDimension) {
    //                 setWarning(
    //                     `Hình ảnh quá nhỏ. Yêu cầu kích thước tối thiểu ${minDimension}x${minDimension}.`
    //                 );
    //                 return setCitizenIdentityCard(null);
    //             } else if (width >= height * maxRatio || height >= width * maxRatio) {
    //                 setWarning(
    //                     `Hình ảnh quá dài. Một chiều không thể có kích thước gấp ${maxRatio} lần chiều còn lại.`
    //                 );
    //                 return setCitizenIdentityCard(null);
    //             } else {
    //                 setWarning("");
    //             }

    //             let newWidth, newHeight;

    //             if (width > height) {
    //                 newHeight = minDimension;
    //                 newWidth = Math.floor((width / height) * minDimension);
    //             } else {
    //                 newWidth = minDimension;
    //                 newHeight = Math.floor((height / width) * minDimension);
    //             }

    //             const canvas = document.createElement("canvas");
    //             canvas.width = newWidth;
    //             canvas.height = newHeight;

    //             const ctx = canvas.getContext("2d");
    //             ctx.drawImage(image, 0, 0, newWidth, newHeight);

    //             const resizedImage = canvas.toDataURL("image/jpeg");

    //             setCitizenIdentityCard(resizedImage);
    //         };

    //         image.src = readerEvent.target.result;
    //     };

    //     if (file) {
    //         reader.readAsDataURL(file);
    //     }
    // };

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
        moderatorAccountManagementService.createNewUser({ 
            userName,
            password,
            // citizenIdentityCard
        })
            .then(() => {
                setShowDialog(false);
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
                {/* <div className={styles.formGroup}>
                    <label htmlFor="image">Căn cước công dân</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="file"
                            accept="image/*"
                            id="image"
                            onChange={handleImageChange}
                        />
                        {
                            citizenIdentityCard &&
                            <img 
                                src={citizenIdentityCard} 
                                alt="Căn cước công dân" 
                                className={styles.citizenIdentityCard}
                                draggable={false}
                            />
                        }
                    </div>
                </div> */}
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

export default CreateUserDialog;
