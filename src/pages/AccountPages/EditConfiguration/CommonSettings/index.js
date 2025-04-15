import React from "react";
import styles from "./common_settings.module.scss";

export default function CommonSettings() {
    return (
        <div id={styles.root}>
            <p className={styles.title}>Cài đặt chung</p>
        </div>
    );
}