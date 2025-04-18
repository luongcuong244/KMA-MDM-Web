import React, { useState, useEffect } from "react";
import styles from "./applications.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplications, selectApplications } from "../../../../slices/application.slice";
import Loader from "../../../../components/Loader";
import AddApplicationConfigDialog from "../../../../parts/AddApplicationConfigDialog";

export default function Applications({ configuration }) {
    const dispatch = useDispatch();
    const applications = useSelector(selectApplications);

    const [applicationConfigs, setApplicationConfigs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSystemApps, setShowSystemApps] = useState(false);
    const [displayMyApplicationsOnly, setDisplayMyApplicationsOnly] = useState(false);

    const [showAddApplication, setShowAddApplication] = useState(false);

    useEffect(() => {
        // Fetch applications from the server
        dispatch(fetchApplications({ searchTerm: "" }));
    }, [])

    useEffect(() => {
        if (applications.data) {
            setApplicationConfigs(applications.data.map((app) => {
                let lastestVersion = (app.versions ?? []).length > 0 ? app.versions.reduce((latest, current) =>
                    current.versionCode > latest.versionCode ? current : latest
                ) : {
                    versionCode: 0,
                    versionName: "0",
                    url: "",
                };
                return {
                    application: app,
                    version: lastestVersion,
                    screenOrder: 0,
                    showIcon: false,
                    remove: false,
                    runAfterInstall: false,
                    runAtBoot: false,
                }
            }));
        }
    }, applications.data)

    const handleSearch = () => {
        
    }

    const handleAddApplication = () => {
        setShowAddApplication(true);
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
                !applications.isLoading && filteredApplications.length > 0 && (
                    <>
                        <div className={styles.filterContainer}>
                            <div className={styles.filter}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={showSystemApps}
                                    onChange={(e) => setShowSystemApps(e.target.checked)}
                                />
                                <label>Hiện ứng dụng hệ thống</label>
                            </div>
                            {/* <div className={styles.filter}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={displayMyApplicationsOnly}
                                    onChange={(e) => setDisplayMyApplicationsOnly(e.target.checked)}
                                />
                                <label>Chỉ hiện ứng dụng của tôi</label>
                            </div> */}
                        </div>
                        <div className={styles.configTable}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Tên ứng dụng</th>
                                        <th>Phiên bản</th>
                                        <th>Đường dẫn</th>
                                        <th>Icon</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filteredApplications.map((appConfig) => {
                                            let app = appConfig.application;
                                            return (
                                                <tr key={app.id}>
                                                    <td>
                                                        <div className={styles.appInfo}>
                                                            <label>{app.name}</label>
                                                            <label>{app.pkg}</label>
                                                        </div>
                                                    </td>
                                                    <td>{appConfig.version.versionName}</td>
                                                    <td>{appConfig.version.url ?? ""}</td>
                                                    <td>{app.showIcon ? "+" : ""}</td>
                                                    <td className={styles.actions}>
                                                        <button className={styles.edit}>Phiên bản</button>
                                                        <button className={styles.copy}>Sửa</button>
                                                        <button className={styles.delete}>Xóa</button>
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
                filteredApplications.length === 0 && !applications.isLoading && (
                    <span className={styles.noData}>Không cấu hình nào được tìm thấy</span>
                )
            }
            {
                applications.isLoading && (
                    <div className={styles.loading}>
                        <Loader color="#535353" width="35px" />
                        <span className={styles.loadingText} >Đang tải dữ liệu...</span>
                    </div>
                )
            }
            {
                applications.errorMessage && !applications.isLoading && (
                    <div className={styles.error}>
                        <span className={styles.errorText}>{applications.errorMessage}</span>
                    </div>
                )
            }
            {
                showAddApplication && (
                    <AddApplicationConfigDialog configuration={configuration} isOpen={showAddApplication} onClose={() => setShowAddApplication(false)} />
                )
            }
        </div>
    );
}