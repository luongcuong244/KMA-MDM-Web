import React from "react";
import styles from "./go_to_home.module.scss";
import PATH from "../../enums/path.enum";

export default function GoToHomePage({ message = null }) {
    return (
        <div id={styles.root}>
            {
                message && (
                    <label>{message}</label>
                )
            }
            <a href={PATH.root} className={styles.button}>
                Đi đến trang chủ
            </a>
        </div>
    );
}