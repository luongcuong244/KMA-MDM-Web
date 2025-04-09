import React from "react";
import styles from "./menu_popup.module.scss";

const MenuPopup = ({ menuButtons } ) => {
    return (
        <div id={styles.root}>
            {
                menuButtons.map((menuButton, index) => {
                    return (
                        <div key={index} className={styles.menuButton} onClick={menuButton.onClick}>
                            {
                                menuButton.icon && (
                                    <img src={menuButton.icon} className={styles.menuIcon} draggable={false} />
                                )
                            }
                            <span className={styles.menuText} >{menuButton.text}</span>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default MenuPopup;