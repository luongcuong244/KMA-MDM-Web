import React, { useState, useRef, useEffect } from "react";
import styles from "./management_page_header.module.scss";
import ProfileInactiveIcon from "../../assets/icons/ic_profile_inactive.svg";
import authService from "../../services/auth.service";
import PATH from "../../enums/path.enum";

const ManagementPageHeader = ({ onClickSignOut }) => {

  const [openPopup, setOpenPopup] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      const { target } = event;

      if (!wrapperRef.current) return;

      if (!wrapperRef.current.contains(target)) {
        if (openPopup) {
          setOpenPopup(false);
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [openPopup]);

  const onClickUserAvatar = () => {
    setOpenPopup(!openPopup);
  };

  const onSignOut = () => {
    setOpenPopup(false);
    authService.signOut()
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        window.location.href = PATH.root;
      });
  };

  return (
    <div id={styles.root}>
      <div className={styles.userAvatarAndPopupMenu} ref={wrapperRef}>
        {openPopup && (
          <div className={styles.popupMenu}>
            <ul className={styles.popupItemList}>
              <li>
                <button className={styles.popupItem} onClick={onSignOut}>
                  <span style={{ paddingTop: 2.5 }}>Đăng xuất</span>
                  <></>
                </button>
              </li>
            </ul>
          </div>
        )}
        <button className={styles.userAvatarButton} onClick={onClickUserAvatar}>
          <img
            alt=""
            className={styles.userWithoutAvatar}
            src={ProfileInactiveIcon}
          />
        </button>
      </div>
    </div>
  );
};

export default ManagementPageHeader;
