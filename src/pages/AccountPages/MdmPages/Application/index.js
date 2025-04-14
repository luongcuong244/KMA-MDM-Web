import React, { useState, useEffect } from "react";
import styles from "./application.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplications, selectApplications } from "../../../../slices/application.slice";
import Loader from "../../../../components/Loader";
import AddApplicationDialog from "../../../../parts/AddApplicationDialog";
import EditApplicationDialog from "../../../../parts/EditApplicationDialog";

export default function Application() {
    const dispatch = useDispatch();
    const applications = useSelector(selectApplications);

    const [searchTerm, setSearchTerm] = useState("");
    const [showSystemApps, setShowSystemApps] = useState(false);
    const [displayMyApplicationsOnly, setDisplayMyApplicationsOnly] = useState(false);

    const [openAddApplicationDialog, setOpenAddApplicationDialog] = useState(false);
    const [openEditApplicationDialog, setOpenEditApplicationDialog] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    useEffect(() => {
        // Fetch applications from the server
        dispatch(fetchApplications({ searchTerm: "" }));
    }, [])

    const handleSearch = () => {
        dispatch(fetchApplications({ searchTerm }));
    }

    const handleAddApplication = () => {
        setOpenAddApplicationDialog(true);
    }

    const handleEditApplication = (application) => {
        setOpenEditApplicationDialog(true);
        setSelectedApplication(application);
    }

    const filteredApplications = (applications.data ?? []).filter((app) => {
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
    })

    const handleSubmit = (newApplication) => {
        dispatch(fetchApplications({ searchTerm: "" }));
    };

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
                            <div className={styles.filter}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={displayMyApplicationsOnly}
                                    onChange={(e) => setDisplayMyApplicationsOnly(e.target.checked)}
                                />
                                <label>Chỉ hiện ứng dụng của tôi</label>
                            </div>
                        </div>
                        <div className={styles.configTable}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Package</th>
                                        <th>Tên ứng dụng</th>
                                        <th>Phiên bản</th>
                                        <th>Đường dẫn</th>
                                        <th>Icon</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filteredApplications.map((config) => {
                                            let lastestVersion = config.versions.length > 0 ? config.versions.reduce((latest, current) =>
                                                current.versionCode > latest.versionCode ? current : latest
                                            ) : {
                                                versionCode: 0,
                                                versionName: "0",
                                                url: "",
                                            };
                                            return (
                                                <tr key={config.id}>
                                                    <td>{config.pkg}</td>
                                                    <td>{config.name}</td>
                                                    <td>{lastestVersion.versionName}</td>
                                                    <td>{lastestVersion.url ?? ""}</td>
                                                    <td>{config.showIcon ? "+" : ""}</td>
                                                    <td className={styles.actions}>
                                                        <button className={styles.edit}>Phiên bản</button>
                                                        <button className={styles.copy} onClick={() => handleEditApplication(config)}>Sửa</button>
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
                openAddApplicationDialog && 
                    <AddApplicationDialog 
                        isOpen={openAddApplicationDialog} 
                        onClose={() => setOpenAddApplicationDialog(false)} 
                        onSubmit={handleSubmit} 
                    />
            }
            {
                selectedApplication && openEditApplicationDialog && 
                    <EditApplicationDialog 
                    isOpen={openEditApplicationDialog} 
                    onClose={() => {
                        setOpenEditApplicationDialog(false);
                        setSelectedApplication(null);
                    }} 
                    onSubmit={handleSubmit}
                    application={selectedApplication}
                />
            }
        </div>
    );
}