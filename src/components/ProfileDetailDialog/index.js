import React, { useState } from "react";
import Popup from "reactjs-popup";
import styles from "./profile_detail_dialog.module.scss";
import { IoCloseOutline } from "react-icons/io5";
import AlertError from "../AlertError";
import AvatarPicker from "../AvatarPicker";
import Loader from "../Loader";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setAvatar, setUserPublicName } from "../../slices/user.slice";

const ProfileDetailDialog = ({
  setShouldShowProfileDetailDialog,
  setErrorText,
  errorText,
  base64Avatar,
  setBase64Avatar,
  onClickPickImage,
  onClickDeleteImage,
}) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const [userName, setUserName] = useState(user.name ?? "");
  const [waitingForServer, setWaitingForServer] = useState(false);

  const onSave = () => {
    const finalName = userName.trim();

    if (!finalName) {
      return setErrorText("Tên không được để trống.");
    }

    setUserName(finalName);

    setWaitingForServer(true);

    setTimeout(() => {
      setWaitingForServer(false);

      // gửi ảnh và tên lên server, nếu thành công sẽ trả về ảnh và tên mới ( không nên lấy của client vì có thể dialog bị đóng đột ngột dẫn đến name và avatar bị mất )
      dispatch(setUserPublicName(finalName));
      dispatch(setAvatar(base64Avatar));

      closeDialog();
    }, 1000);
  };

  const onUserNameChange = (event) => {
    const inputValue = event.target.value;
    setUserName(inputValue);
  };

  const closeDialog = () => {
    setShouldShowProfileDetailDialog(false);
  };

  return (
    <Popup
      modal
      open
      overlayStyle={{ background: "#00000080" }}
      onClose={closeDialog}
    >
      <div className={styles.profileDetailDialog}>
        <div className={styles.dialogHeader}>
          <span className={styles.dialogTitle}>Chi tiết hồ sơ</span>
          <button className={styles.closeButton} onClick={closeDialog}>
            <IoCloseOutline size={30} color="white" />
          </button>
        </div>
        {errorText && (
          <AlertError
            text={errorText}
            style={{ borderRadius: 4, marginBottom: 24 }}
          />
        )}
        <div className={styles.dialogBody}>
          <AvatarPicker
            size={180}
            allowDeleteAvatar
            onClickPickImage={onClickPickImage}
            onClickDeleteAvatar={onClickDeleteImage}
            image={base64Avatar ?? user.avatar}
            activeHover={!waitingForServer}
          />
          <div className={styles.editTextWrapper}>
            <input
              className={styles.inputCell}
              aria-invalid="false"
              type="text"
              placeholder="Nhập tên của bạn"
              autoCorrect="off"
              value={userName}
              maxLength={30}
              disabled={waitingForServer}
              onChange={onUserNameChange}
            />
            <button
              className={styles.saveButton}
              onClick={onSave}
              disabled={waitingForServer}
            >
              {waitingForServer ? <Loader color="#535353" /> : "Lưu"}
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default ProfileDetailDialog;
