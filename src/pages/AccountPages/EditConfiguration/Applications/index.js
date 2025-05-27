import React, { useState, useEffect } from "react";
import styles from "./applications.module.scss";
import AddApplicationConfigDialog from "../../../../parts/AddApplicationConfigDialog";

export default function Applications({ configuration }) {
    const [applicationConfigs, setApplicationConfigs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSystemApps, setShowSystemApps] = useState(true);
    const [displayMyApplicationsOnly, setDisplayMyApplicationsOnly] = useState(false);

    const [showAddApplication, setShowAddApplication] = useState(false);

    console.log("Applications configuration", configuration);

    useEffect(() => {
        if (configuration.applications) {
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
            configuration.applications = newConfigs;
            return newConfigs;
        });
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

    const updateApplicationConfigs = (newConfigs) => {
        setApplicationConfigs(newConfigs);
        configuration.applications = newConfigs;
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
                                        <th></th>
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
                                                    <td>
                                                        {
                                                            appConfig.application.isSystemApp ? (
                                                                <>{appConfig.version.versionName}</>
                                                            ) :
                                                                (
                                                                    renderComboBoxField(
                                                                        {},
                                                                        appConfig.application.versions.map((version) => ({
                                                                            label: version.versionName,
                                                                            value: version._id,
                                                                        })),
                                                                        appConfig.version._id,
                                                                        e => {
                                                                            const newConfigs = [...applicationConfigs];
                                                                            const index = newConfigs.findIndex((config) => config.application._id === appConfig.application._id);
                                                                            if (index !== -1) {
                                                                                const selectedVersion = appConfig.application.versions.find(
                                                                                    (version) => version._id === e.target.value
                                                                                );
                                                                                if (selectedVersion) {
                                                                                    newConfigs[index].version = selectedVersion;
                                                                                    updateApplicationConfigs(newConfigs);
                                                                                }
                                                                            }
                                                                        }
                                                                    )
                                                                )
                                                        }
                                                    </td>
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
                                                                        updateApplicationConfigs(newConfigs);
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
                                                                        updateApplicationConfigs(newConfigs);
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
                                                                            updateApplicationConfigs(newConfigs);
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
                                                                        updateApplicationConfigs(newConfigs);
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
                                                                        updateApplicationConfigs(newConfigs);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className={styles.signInButton}
                                                            onClick={() => {
                                                                const confirmed = window.confirm(`Bạn có chắc chắn muốn xoá ứng dụng "${app.name}" không?`);
                                                                if (!confirmed) return;

                                                                // Kiểm tra xem có đang được dùng trong application settings
                                                                const isUsedInSettings = configuration.applicationSettings.some((setting) => {
                                                                    return setting.application && setting.application._id === appConfig.application._id;
                                                                });

                                                                if (isUsedInSettings) {
                                                                    alert(`Ứng dụng "${app.name}" đang được sử dụng trong cài đặt ứng dụng và không thể xoá.`);
                                                                    return;
                                                                }

                                                                // Kiểm tra xem có đang được đặt là mdm app không
                                                                const isUsedAsMdmApp = configuration.mdmApp == appConfig.application.pkg;
                                                                if (isUsedAsMdmApp) {
                                                                    alert(`Ứng dụng "${app.name}" đang được đặt là ứng dụng MDM và không thể xoá.`);
                                                                    return;
                                                                }

                                                                // Kiểm tra trong kisok app
                                                                const isUsedInKiosk = configuration.kioskApps.some((kioskAppPkg) => {
                                                                    return kioskAppPkg === appConfig.application.pkg;
                                                                });
                                                                if (isUsedInKiosk) {
                                                                    alert(`Ứng dụng "${app.name}" đang được sử dụng trong chế độ kiosk và không thể xoá.`);
                                                                    return;
                                                                }

                                                                const newConfigs = applicationConfigs.filter(
                                                                    (config) => config.application._id !== appConfig.application._id
                                                                );
                                                                updateApplicationConfigs(newConfigs);
                                                            }}
                                                        >
                                                            <span class="glyphicon glyphicon-trash"></span>
                                                        </button>
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