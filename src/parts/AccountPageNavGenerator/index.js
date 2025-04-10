import React from "react";
import styles from "./mdm_page_nav_generator.module.scss";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import clsx from "clsx";
import Converter from "../../utils/converter.js";

const MdmPageNavGenerator = ({ routes, parentRoute }) => {
    const NavLinkItem = (path, text) => {
        return (
            <li>
                <NavLink to={path} style={{textDecoration: "none"}}>
                    {({ isActive, isPending }) => (
                        <>
                            <div className={clsx(styles.navLink, isActive ? styles.activeNavLink : styles.inactiveNavLink)}>
                                <span
                                    className={clsx(
                                        styles.navText,
                                        isActive ? styles.activeColor : styles.inactiveColor
                                    )}
                                    autoCorrect="false"
                                >
                                    {text}
                                </span>
                            </div>
                        </>
                    )}
                </NavLink>
            </li>
        );
    };

    return (
        <div id={styles.root}>
            <ul className={styles.navContainer}>
                <li className={styles.emptyNavLink} style={{width: 32}}></li>
                {routes.map((route) => {
                    return NavLinkItem(
                        route.path,
                        route.text,
                    );
                })}
                <li className={styles.emptyNavLink} style={{flex: 1}}></li>
            </ul>
            <div className={styles.routes}>
                <Routes>
                    {routes.map((route, index) => {
                        return (
                            <Route
                                path={`${Converter.formatPath(parentRoute, route.path)}/*`}
                                element={<route.page />}
                            />
                        );
                    })}
                    <Route path="*" element={<Navigate to={routes[0].path} />} />
                </Routes>
            </div>
        </div>
    );
};

export default MdmPageNavGenerator;