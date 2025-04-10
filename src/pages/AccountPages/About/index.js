import React from "react";
import styles from "./about.module.scss";

export default function About() {
    return (
        <div id={styles.root}>
            <p className={styles.title}>Giới thiệu</p>
            <p className={styles.content}>
                Hệ thống quản lý thiết bị di động KMA MDM là một hệ thống được phát triển bởi
                sinh viên Khoa Công Nghệ Thông Tin của Học viện Kỹ Thuật Mật Mã.
                Hệ thống được xây dựng nhằm mục đích quản lý và bảo mật các thiết bị di động
                trong môi trường doanh nghiệp.
            </p>
        </div>
    );
}