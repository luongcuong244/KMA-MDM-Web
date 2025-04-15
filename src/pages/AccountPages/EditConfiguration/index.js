import React, { useEffect } from "react";
import styles from "./edit_configuration.module.scss";
import { useParams } from "react-router-dom";
import configurationService from "../../../services/configuration.service";
import clsx from "clsx";
import CommonSettings from "./CommonSettings";

export default function EditConfiguration() {
    const { id } = useParams();
    const [configuration, setConfiguration] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState("common");

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
            .catch((error) => {
                if (error.response) {
                    setError(error.response.data.message);
                } else {
                    setError("An error occurred while fetching the application version.");
                }
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

    const renderTabContent = () => {
        switch (activeTab) {
            case "common":
                return <CommonSettings />;
            case "design":
                return <div>Design Settings Component</div>;
            case "apps":
                return <div>Applications Component</div>;
            case "mdm":
                return <div>MDM Settings Component</div>;
            case "app-settings":
                return <div>Application Settings Component</div>;
            case "files":
                return <div>Files Component</div>;
            default:
                return null;
        }
    };

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
                !loading && !error && (
                    <>
                        <p className={styles.title}><p className={styles.subTitle}>Cấu hình </p>"{configuration?.name ?? ""}"</p>
                        <ul className={styles.navContainer}>
                            {NavItem("common", "Cài đặt chung")}
                            {NavItem("design", "Cài đặt giao diện")}
                            {NavItem("apps", "Ứng dụng được phép")}
                            {NavItem("mdm", "Cài đặt quản lý thiết bị")}
                            {NavItem("app-settings", "Cài đặt cho ứng dụng")}
                            {NavItem("files", "Tệp đính kèm")}
                        </ul>
                        <div className={styles.routes}>
                            {renderTabContent()}
                        </div>
                    </>
                )
            }
        </div>
    );
}