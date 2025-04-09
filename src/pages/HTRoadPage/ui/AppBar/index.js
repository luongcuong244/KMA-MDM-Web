import React from "react";
import styles from "./app_bar.module.scss";
import AvatarAndCoin from "./AvatarAndCoin";
import Logo from "../../../../assets/imgs/logo.jpeg";

const AppBar = () => {
    return (
        <div id={styles.root}>
            <img src={Logo} alt="profile" className={styles.logo} />
            <AvatarAndCoin />
        </div>
    );
}

export default AppBar;