import React, { useState, useEffect } from "react";
import styles from "./application_settings.module.scss";
import AddApplicationAttributeDialog from "../../../../parts/AddApplicationAttributeDialog";
import Converter from "../../../../utils/converter";
import EditApplicationAttributeDialog from "../../../../parts/EditApplicationAttributeDialog";

export default function ApplicationSettings({ configuration }) {
    const [applicationSettings, setApplicationSettings] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [showAddApplication, setShowAddApplication] = useState(false);
    const [appSettingToEdit, setAppSettingToEdit] = useState(null);

    useEffect(() => {
        if (configuration) {
            setApplicationSettings(configuration.applicationSettings);
        }
    }, [])

    const handleSearch = () => {

    }

    const handleAddApplication = () => {
        setShowAddApplication(true);
    }

    const handleSubmit = (appSetting) => {
        setApplicationSettings((prev) => {
            let newConfigs = [...prev];
            newConfigs.push(appSetting);
            configuration.applicationSettings = newConfigs;
            return newConfigs;
        });
    }

    const handleSubmitEdit = (appSetting) => {
        setApplicationSettings((prev) => {
            let newConfigs = [...prev];
            // replace the appSettingToEdit with the new appSetting
            newConfigs = newConfigs.map((app) => {
                if (app.application.pkg === appSettingToEdit.application.pkg && app.attribute === appSettingToEdit.attribute) {
                    return appSetting;
                }
                return app;
            });
            configuration.applicationSettings = newConfigs;
            return newConfigs;
        });
    }

    const handleDeleteAppSetting = (appSetting) => {
        setApplicationSettings((prev) => {
            let newConfigs = [...prev];
            newConfigs = newConfigs.filter((app) => app.application.pkg !== appSetting.application.pkg || app.attribute !== appSetting.attribute);
            // update configuration
            configuration.applicationSettings = newConfigs;
            return newConfigs;
        });
    }

    const handleEditAppSetting = (appSetting) => {
        setAppSettingToEdit(appSetting);
    }

    const filteredApplications = applicationSettings.filter((app) => {
        if (searchTerm === "") {
            return true;
        } else {
            return app.application.name.toLowerCase().includes(searchTerm.toLowerCase()) 
            || app.application.pkg.toLowerCase().includes(searchTerm.toLowerCase())
            || app.attribute.toLowerCase().includes(searchTerm.toLowerCase())
            || app.value.toLowerCase().includes(searchTerm.toLowerCase());
        }
    })

    return (
        <div id={styles.root}>
            <div className={styles.searchBarContainer}>
                <input
                    type="text"
                    className={styles.searchBar}
                    placeholder="Tìm kiếm"
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
                                        <th>Package</th>
                                        <th>Tên ứng dụng</th>
                                        <th>Thuộc tính</th>
                                        <th>Giá trị</th>
                                        <th>Mô tả</th>
                                        <th>Ngày tạo</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filteredApplications.map((appSetting) => {
                                            let app = appSetting.application;
                                            return (
                                                <tr key={app.id}>
                                                    <td>{app.pkg}</td>
                                                    <td>{app.name}</td>
                                                    <td>{appSetting.attribute}</td>
                                                    <td>{appSetting.value}</td>
                                                    <td>{appSetting.comment}</td>
                                                    <td>{Converter.formatDate(appSetting.createdAt)}</td>
                                                    <td>
                                                        <div style={{ display: "flex", gap: 5 }}>
                                                            <button className={styles.signInButton} onClick={() => handleEditAppSetting(appSetting)}>
                                                                <span class="glyphicon glyphicon-pencil"></span>
                                                            </button>
                                                            <button className={styles.signInButton} onClick={() => handleDeleteAppSetting(appSetting)}>
                                                                <span class="glyphicon glyphicon-trash"></span>
                                                            </button>
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
                    <AddApplicationAttributeDialog
                        configuration={configuration}
                        isOpen={showAddApplication}
                        onClose={() => setShowAddApplication(false)}
                        onSubmit={handleSubmit}
                    />
                )
            }
            {
                appSettingToEdit && (
                    <EditApplicationAttributeDialog
                        configuration={configuration}
                        isOpen={appSettingToEdit}
                        onClose={() => setAppSettingToEdit(null)}
                        onSubmit={handleSubmitEdit}
                        applicationSetting={appSettingToEdit}
                    />
                )
            }
        </div>
    );
}