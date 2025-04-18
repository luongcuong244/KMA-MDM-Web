import React, { useState, useEffect } from "react";
import styles from "./applications.module.scss";
import Loader from "../../../../components/Loader";
import AddApplicationConfigDialog from "../../../../parts/AddApplicationConfigDialog";

export default function Applications({ configuration }) {
    const [applicationConfigs, setApplicationConfigs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSystemApps, setShowSystemApps] = useState(true);
    const [displayMyApplicationsOnly, setDisplayMyApplicationsOnly] = useState(false);

    const [showAddApplication, setShowAddApplication] = useState(false);

    useEffect(() => {
        if (configuration) {
            setApplicationConfigs(configuration.applications);
        }
    }, [])

    const handleSearch = () => {

    }

    const handleAddApplication = () => {
        setShowAddApplication(true);
    }

    const handleSubmit = (appConfig) => {
        setApplicationConfigs((prev) => {
            let newConfigs = [...prev];
            let index = newConfigs.findIndex((config) => config.application._id === appConfig.application._id);
            if (index !== -1) {
                newConfigs[index] = appConfig;
            } else {
                newConfigs.push(appConfig);
            }
            return newConfigs;
        });
        setShowAddApplication(false);
    }

    const renderComboBoxField = (style, options, value, onChange) => {
        return (
            <div className={styles.inputContainer} style={style}>
                <div className={styles.inputContainerBorder} style={{ flex: 1, height: "100%", display: "flex", alignItems: "center" }}>
                    <select
                        className={styles.input}
                        value={value}
                        onChange={onChange}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }

    const filteredApplications = applicationConfigs.filter((appConfig) => {
        let app = appConfig.application;
        if (displayMyApplicationsOnly) {
            if (app.isSystemApp) {
                return false;
            }
            return true;
        } else {
            if (!showSystemApps) {
                if (app.isSystemApp) {
                    return false;
                }
            }
            return true;
        }
    }).filter((app) => {
        if (searchTerm === "") {
            return true;
        } else {
            return app.application.name.toLowerCase().includes(searchTerm.toLowerCase()) || app.application.pkg.toLowerCase().includes(searchTerm.toLowerCase());
        }
    })

    return (
        <div id={styles.root}>
            <div className={styles.searchBarContainer}>
                <input
                    type="text"
                    className={styles.searchBar}
                    placeholder="Tìm kiếm ứng dụng"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                />
                <button className={styles.searchButton} onClick={handleSearch}>Tìm kiếm</button>
                <button className={styles.searchButton} onClick={handleAddApplication}>Thêm</button>
            </div>
            {
                (
                    <>
                        <div className={styles.configTable}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Tên ứng dụng</th>
                                        <th>Phiên bản</th>
                                        <th>Hành động</th>
                                        <th>Icon</th>
                                        <th>Thứ tự hiển thị</th>
                                        <th>Mở khi cài đặt</th>
                                        <th>Mở khi khởi động máy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filteredApplications.map((appConfig) => {
                                            let app = appConfig.application;
                                            console.log(appConfig);
                                            return (
                                                <tr key={app.id}>
                                                    <td>
                                                        <div className={styles.appInfo}>
                                                            <label>{app.name}</label>
                                                            <label>{app.pkg}</label>
                                                        </div>
                                                    </td>
                                                    <td>{appConfig.version.versionName}</td>
                                                    <td>
                                                        {
                                                            renderComboBoxField(
                                                                appConfig.application.isSystemApp ? { display: "none" } : {},
                                                                [
                                                                    {
                                                                        label: "Cài đặt",
                                                                        value: "install",
                                                                    },
                                                                    {
                                                                        label: "Gỡ cài đặt",
                                                                        value: "uninstall",
                                                                    },
                                                                ],
                                                                appConfig.remove ? "uninstall" : "install",
                                                                e => {
                                                                    let newConfigs = [...applicationConfigs];
                                                                    let index = newConfigs.findIndex((config) => config.application._id === appConfig.application._id);
                                                                    if (index !== -1) {
                                                                        newConfigs[index].remove = e.target.value === "uninstall";
                                                                        setApplicationConfigs(newConfigs);
                                                                    }
                                                                }
                                                            )
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            renderComboBoxField(
                                                                {},
                                                                [
                                                                    {
                                                                        label: "Hiển thị",
                                                                        value: true,
                                                                    },
                                                                    {
                                                                        label: "Ẩn",
                                                                        value: false,
                                                                    },
                                                                ],
                                                                appConfig.showIcon,
                                                                e => {
                                                                    let newConfigs = [...applicationConfigs];
                                                                    let index = newConfigs.findIndex((config) => config.application._id === appConfig.application._id);
                                                                    if (index !== -1) {
                                                                        newConfigs[index].showIcon = e.target.value === "true";
                                                                        setApplicationConfigs(newConfigs);
                                                                    }
                                                                }
                                                            )
                                                        }
                                                    </td>
                                                    <td>
                                                        <div className={styles.inputContainer} style={appConfig.showIcon ? {} : { display: "none" }}>
                                                            <div className={styles.inputContainerBorder} style={{ flex: 1, height: "100%", display: "flex", alignItems: "center" }}>
                                                                <input
                                                                    className={styles.input}
                                                                    type="number"
                                                                    value={appConfig.screenOrder || 0}
                                                                    onChange={(e) => {
                                                                        const newConfigs = [...applicationConfigs];
                                                                        const index = newConfigs.findIndex((config) => config.application._id === appConfig.application._id);
                                                                        if (index !== -1) {
                                                                            newConfigs[index].screenOrder = parseInt(e.target.value) || 0;
                                                                            setApplicationConfigs(newConfigs);
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={styles.inputContainer}>
                                                            <input
                                                                type="checkbox"
                                                                className={styles.checkBox}
                                                                checked={appConfig.runAfterInstall}
                                                                onChange={(e) => {
                                                                    const newConfigs = [...applicationConfigs];
                                                                    const index = newConfigs.findIndex((config) => config.application._id === appConfig.application._id);
                                                                    if (index !== -1) {
                                                                        newConfigs[index].runAfterInstall = e.target.checked;
                                                                        setApplicationConfigs(newConfigs);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={styles.inputContainer}>
                                                            <input
                                                                type="checkbox"
                                                                className={styles.checkBox}
                                                                checked={appConfig.runAtBoot}
                                                                onChange={(e) => {
                                                                    const newConfigs = [...applicationConfigs];
                                                                    const index = newConfigs.findIndex((config) => config.application._id === appConfig.application._id);
                                                                    if (index !== -1) {
                                                                        newConfigs[index].runAtBoot = e.target.checked;
                                                                        setApplicationConfigs(newConfigs);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </>
                )
            }
            {
                showAddApplication && (
                    <AddApplicationConfigDialog
                        configuration={configuration}
                        isOpen={showAddApplication}
                        onClose={() => setShowAddApplication(false)}
                        onSubmit={handleSubmit}
                    />
                )
            }
        </div>
    );
}