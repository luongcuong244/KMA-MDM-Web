import React from "react";
import styles from "./topup_request.module.scss";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import PATH from "../../../enums/path.enum";
import Converter from "../../../utils/converter";
import WaitingTopupRequest from "./WaitingTopupRequest";
import TopupRequestHistory from "./TopupRequestHistory";

const routes = [
    {
        path: PATH.waiting_topup_request,
        text: "Chờ duyệt",
        page: WaitingTopupRequest,
    },
    {
        path: PATH.topup_request_history,
        text: "Lịch sử",
        page: TopupRequestHistory,
    }
]

const TopupRequest = () => {

    const NavLinkItem = (path, text) => {
        return (
            <NavLink to={path} className={styles.navLink}>
                {({ isActive, isPending }) => (
                    <span
                        className={isActive ? styles.navActiveStyle : styles.navInactiveStyle}
                        autoCorrect="false"
                    >
                        {text}
                    </span>
                )}
            </NavLink>
        );
    };

    return <div id={styles.root}>
        <h1>Yêu cầu nạp tiền</h1>
        <div className={styles.divider} />
        <p className={styles.tip}>* Tip: Nạp tiền vào tài khoản hội viên ở máy tính tiền trước rồi mới duyệt để tránh quên.</p>
        <nav className={styles.navContainer}>
            {routes.map((route) => {
                return NavLinkItem(
                    route.path,
                    route.text,
                );
            })}
        </nav>
        <div className={styles.divider} style={{marginTop: 12, marginBottom: 12}} />
        <div className={styles.routes}>
            <Routes>
                {routes.map((route) => {
                    return (
                        <Route
                            path={Converter.formatPath(PATH.approval_topup_request, route.path)}
                            element={<route.page />}
                        />
                    );
                })}
                <Route path="*" element={<Navigate to={routes[0].path} />} />
            </Routes>
        </div>
    </div>;
}

export default TopupRequest;