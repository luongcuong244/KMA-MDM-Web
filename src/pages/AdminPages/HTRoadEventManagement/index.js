import React from "react";
import styles from "./ht_road_event_management.module.scss";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import PATH from "../../../enums/path.enum";
import Converter from "../../../utils/converter";
import OngoingEvent from "./OngoingEvent";

const routes = [
    {
        path: PATH.ht_road_event_ongoing,
        text: "Đang/Sắp diễn ra",
        page: OngoingEvent,
    },
    {
        path: PATH.ht_road_event_history,
        text: "Lịch sử",
        page: OngoingEvent,
    }
]

const HTRoadEventManagement = () => {

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
        <h1>Sự kiện HT Road</h1>
        <div className={styles.divider} />
        <nav className={styles.navContainer}>
            {routes.map((route) => {
                return NavLinkItem(
                    route.path,
                    route.text,
                );
            })}
        </nav>
        <div className={styles.divider} />
        <div className={styles.routes}>
            <Routes>
                {routes.map((route) => {
                    return (
                        <Route
                            path={Converter.formatPath(PATH.ht_road_event, route.path)}
                            element={<route.page />}
                        />
                    );
                })}
                <Route path="*" element={<Navigate to={routes[0].path} />} />
            </Routes>
        </div>
    </div>;
}

export default HTRoadEventManagement;