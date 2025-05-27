import React, { useEffect } from "react";
import styles from "./application_version.module.scss";
import { useParams } from "react-router-dom";
import applicationService from "../../../services/application.service";
import AddApplicationVersionDialog from "../../../parts/AddApplicationVersionDialog";

export default function ApplicationVersion() {
    const { pkg } = useParams();
    const [application, setApplication] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    
    const [openAddVersionDialog, setOpenAddVersionDialog] = React.useState(false);

    useEffect(() => {
        console.log("Fetching application version for id:", pkg);
        setLoading(true);
        applicationService.getApplication(pkg)
            .then((response) => {
                setApplication(response.data.data);
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

    const onClickAddVersionButton = () => {
        setOpenAddVersionDialog(true);
    }

    const onSubmitAddVersion = (version) => {
        window.location.reload();
    }

    const handleDeleteVersion = (version) => {
        if (application.versions.length <= 1) {
            alert("Không thể xoá phiên bản này vì đây là phiên bản duy nhất.");
            return;
        }
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá phiên bản này không?");
        if (confirmDelete) {
            applicationService.deleteApkVersion({
                packageName: pkg,
                versionCode: version.versionCode,
            })
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {
                if (error.response) {
                    setError(error.response.data.message);
                } else {
                    setError("An error occurred while deleting the version.");
                }
            });
        }
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
                application && (
                    <>
                        <p className={styles.title}>"{application.name}"</p>
                        {
                            application.versions.length > 0 && (
                                <div className={styles.addVersionContainer}>
                                    <button
                                        className={styles.addVersion}
                                        onClick={onClickAddVersionButton}
                                    >
                                        Thêm
                                    </button>
                                </div>
                            )
                        }
                        {
                            application.versions.length > 0 ? (
                                <div className={styles.configTable}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Tên phiên bản</th>
                                                <th>Mã phiên bản</th>
                                                <th>Đường dẫn</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                application.versions.map(
                                                    (version) => {
                                                        let canNotDelete = application.versions.length <= 1;
                                                        return (
                                                            <tr key={version.versionCode}>
                                                                <td>{version.versionName}</td>
                                                                <td>{version.versionCode}</td>
                                                                <td>{version.url}</td>
                                                                <td>
                                                                    <button 
                                                                        className={styles.signInButton} 
                                                                    style={{
                                                                        opacity: canNotDelete ? 0.5 : 1,
                                                                        pointerEvents: canNotDelete ? "none" : "auto",
                                                                        cursor: canNotDelete ? "not-allowed" : "pointer"
                                                                    }}
                                                                    onClick={() => handleDeleteVersion(version)}
                                                                    >
                                                                        <span class="glyphicon glyphicon-trash"></span>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <span className={styles.noVersion}>Không có phiên bản nào được tìm thấy</span>
                            )
                        }
                    </>
                )
            }
            {
                openAddVersionDialog && 
                    <AddApplicationVersionDialog 
                        isOpen={openAddVersionDialog}
                        onClose={() => setOpenAddVersionDialog(false)}
                        onSubmit={onSubmitAddVersion}
                        packageName={pkg}
                    />
            }
        </div>
    );
}