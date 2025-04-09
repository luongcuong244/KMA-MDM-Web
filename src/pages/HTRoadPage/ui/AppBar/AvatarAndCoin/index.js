import React, { useRef, useEffect, useState } from "react";
import styles from "./avatar_and_coin.module.scss";
import Converter from "../../../../../utils/converter";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../slices/user.slice";
import ProfileInactiveIcon from "../../../../../assets/icons/ic_profile_inactive.svg";
import authService from "../../../../../services/auth.service";
import PATH from "../../../../../enums/path.enum";

const AvatarAndCoin = () => {

    const user = useSelector(selectUser);

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
        <div className={styles.userInfoContainer}>
            <button className={styles.coinButton}>
                {Converter.formatMoney(user.amount)}
            </button>
            <div className={styles.userAvatarAndPopupMenu} ref={wrapperRef}>
                {openPopup && (
                    <div className={styles.popupMenu}>
                        <button
                            className={styles.popupItem}
                            onClick={onSignOut}
                        >Đăng xuất</button>
                    </div>
                )}
                <button
                    className={styles.userAvatarButton}
                    onClick={onClickUserAvatar}
                >
                    <img
                        alt=""
                        className={styles.userWithoutAvatar}
                        src={ProfileInactiveIcon}
                    />
                </button>
            </div>
        </div>
    )
}

export default AvatarAndCoin;