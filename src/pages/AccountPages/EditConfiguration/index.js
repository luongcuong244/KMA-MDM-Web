import React, { useEffect, useMemo } from "react";
import styles from "./edit_configuration.module.scss";
import { useParams } from "react-router-dom";
import configurationService from "../../../services/configuration.service";
import clsx from "clsx";
import CommonSettings from "./CommonSettings";
import DesignSettings from "./DesignSettings";
import Applications from "./Applications";
import MdmSettings from "./MdmSettings";
import ApplicationSettings from "./ApplicationSettings";

export default function EditConfiguration() {
    const { id } = useParams();
    const [configuration, setConfiguration] = React.useState({});
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState("common");

    const commonTab = useMemo(() => <CommonSettings configuration={configuration} />, [configuration]);
    const designTab = useMemo(() => <DesignSettings configuration={configuration} />, [configuration]);
    const appsTab = useMemo(() => <Applications configuration={configuration} />, [configuration]);
    const mdmTab = useMemo(() => <MdmSettings configuration={configuration} />, [configuration]);
    const appSettingsTab = useMemo(() => <ApplicationSettings configuration={configuration} />, [configuration]);
    const filesTab = useMemo(() => <div>Files Component</div>, []);

    useEffect(() => {
        console.log("Fetching configuration for id:", id);
        setLoading(true);
        configurationService.getConfiguration(id)
            .then((response) => {
                if (response.data.data) {
                    setConfiguration(response.data.data);
                }
                setError(null);
            })
            .catch((_) => {
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const NavItem = (key, text) => {
        const isActive = activeTab === key;
        return (
            <li key={key} onClick={() => setActiveTab(key)}>
                <div className={clsx(styles.navLink, isActive ? styles.activeNavLink : styles.inactiveNavLink)}>
                    <span
                        className={clsx(
                            styles.navText,
                            isActive ? styles.activeColor : styles.inactiveColor
                        )}
                    >
                        {text}
                    </span>
                </div>
            </li>
        );
    };

    const clickSave = () => {
        // check name
        if (!configuration.name) {
            setError("Tên cấu hình không được để trống");
            setActiveTab("common");
            return;
        }
        // check admin password
        if (!configuration.adminPassword) {
            setError("Mật khẩu quản trị viên không được để trống");
            setActiveTab("common");
            return;
        }
        if (!configuration.mdmApp) {
            setError("Ứng dụng quản lý thiết bị không được để trống");
            setActiveTab("mdm");
            return;
        }
        if (!configuration.mdmChecksum) {
            setError("Checksum của ứng dụng quản lý thiết bị không được để trống");
            setActiveTab("mdm");
            return;
        }
        if (!configuration.adminReceiverClass) {
            setError("Admin Receiver Class không được để trống");
            setActiveTab("mdm");
            return;
        }
        if (configuration.kioskMode && (!configuration.kioskApps || configuration.kioskApps.length == 0)) {
            setError("Chế độ Kiosk yêu cầu ít nhất một ứng dụng được chọn");
            setActiveTab("mdm");
            return;
        }

        configurationService.saveConfiguration({
            configuration: configuration,
        }).then(() => {
            window.history.back();
        }).catch((error) => {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("An error occurred while saving the configuration.");
            }
        });
    }

    const clickBack = () => {
        window.history.back();
    }

    return (
        <div id={styles.root}>
            {
                loading ? (
                    <div className={styles.loader}>Loading...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : null
            }
            {
                !loading && (
                    <>
                        <p className={styles.title}><p className={styles.subTitle}>Cấu hình </p>"{configuration?.name ?? ""}"</p>
                        <ul className={styles.navContainer}>
                            {NavItem("common", "Cài đặt chung")}
                            {NavItem("design", "Cài đặt giao diện")}
                            {NavItem("apps", "Ứng dụng")}
                            {NavItem("mdm", "Cài đặt quản lý thiết bị")}
                            {NavItem("app-settings", "Cài đặt cho ứng dụng")}
                            {/* {NavItem("files", "Tệp đính kèm")} */}
                            <li className={styles.emptyNavLink} style={{ flex: 1 }}></li>
                        </ul>
                        <div className={styles.routes}>
                            <div style={{ display: activeTab === "common" ? "flex" : "none" }}>
                                {commonTab}
                            </div>
                            <div style={{ display: activeTab === "design" ? "flex" : "none" }}>
                                {designTab}
                            </div>
                            <div style={{ display: activeTab === "apps" ? "flex" : "none" }} className={styles.flex}>
                                {appsTab}
                            </div>
                            <div style={{ display: activeTab === "mdm" ? "flex" : "none" }}>
                                {mdmTab}
                            </div>
                            <div style={{ display: activeTab === "app-settings" ? "flex" : "none" }}>
                                {appSettingsTab}
                            </div>
                            {/* <div style={{ display: activeTab === "files" ? "flex" : "none" }}>
                                {filesTab}
                            </div> */}
                        </div>
                        <div className={styles.footer}>
                            <button onClick={clickSave}>Lưu</button>
                            <button onClick={clickBack}>Đóng</button>
                        </div>
                    </>
                )
            }
        </div>
    );
}