import React, { useState } from "react";
import styles from "./signin.module.scss";
import clsx from "clsx";
import Loader from "../../components/Loader";
import AlertDialog from "../../components/AlertDialog";
import AlertError from "../../components/AlertError";
import authService from "../../services/auth.service";
import Logo from "../../assets/imgs/logo.png";

const SignInPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");

  const [waitingForServer, setWaitingForServer] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

  const onClickSignInButton = () => {
    if (!userName) {
      return setWarning("Tên đăng nhập không được để trống!");
    }
    if (!password) {
      return setWarning("Mật khẩu không được để trống!");
    }

    setWarning("");
    setWaitingForServer(true);

    authService.signIn(userName, password)
      .then((response) => {
        if (response?.data) {
          window.location.href = "/";
        } else {
          setWarning("Something went wrong!");
        }
      })
      .catch((error) => {
        const message = error?.response?.data?.message;
        if (message) {
          setWarning(message);
        } else {
          setWarning("Đã có lỗi xảy ra. Hãy thử lại sau ít phút!");
        }
      })
      .finally(() => {
        setWaitingForServer(false);
      });
  };

  const onUserNameChange = (event) => {
    const inputValue = event.target.value;
    setUserName(inputValue);
  };

  const onPasswordChange = (event) => {
    const inputValue = event.target.value;
    setPassword(inputValue);
  };

  return (
    <div id={styles.root}>
      <div className={styles.signInContainer}>
        <div className={styles.title}>
          <img
            className={styles.logo}
            src={Logo}
            alt="Logo"
          />
          <p className={styles.titleText}>KMA MDM</p>
        </div>
        <div className={styles.signInForm}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Tên người dùng</label>
            <input
              className={clsx(
                styles.inputCell,
                warning && !userName && styles.inputWarning
              )}
              aria-invalid="false"
              type="text"
              placeholder="Nhập tên người dùng"
              autoCorrect="off"
              value={userName}
              disabled={waitingForServer}
              onChange={onUserNameChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Mật khẩu</label>
            <input
              className={clsx(
                styles.inputCell,
                warning && !password && styles.inputWarning
              )}
              aria-invalid="false"
              type="password"
              placeholder="Nhập mật khẩu"
              autoCorrect="off"
              value={password}
              disabled={waitingForServer}
              onChange={onPasswordChange}
            />
          </div>
          <>{warning && <AlertError text={warning} />}</>
          <div className={styles.buttonGroup}>
            <p
              className={styles.forgotPasswordText}
              onClick={() => {
                if (waitingForServer) {
                  return;
                }
                setOpenDialog(true);
              }}
            >
              Quên mật khẩu?
            </p>
            <button
              className={styles.signInButton}
              onClick={onClickSignInButton}
              disabled={waitingForServer}
            >
              {waitingForServer ? <Loader /> : "Đăng nhập"}
            </button>
          </div>
        </div>
      </div>
      <AlertDialog
        title={"Thông báo"}
        message={"Liên hệ với Admin để đổi mật khẩu!"}
        isOpen={openDialog}
        onClickPositiveButton={() => {
          setOpenDialog(false);
        }}
      />
    </div>
  );
};

export default SignInPage;
