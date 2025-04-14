import React, { useEffect } from "react";
import styles from "./edit_configuration.module.scss";
import { useParams } from "react-router-dom";
import configurationService from "../../../services/configuration.service";

export default function EditConfiguration() {
    const { id } = useParams();
    const [configuration, setConfiguration] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

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

    // const onClickAddVersionButton = () => {
    //     setOpenAddVersionDialog(true);
    // }

    // const onSubmitAddVersion = (version) => {
    //     window.location.reload();
    // }

    // const handleDeleteVersion = (version) => {
    //     if (application.versions.length <= 1) {
    //         alert("Không thể xoá phiên bản này vì đây là phiên bản duy nhất.");
    //         return;
    //     }
    //     const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá phiên bản này không?");
    //     if (confirmDelete) {
    //         applicationService.deleteApkVersion({
    //             packageName: pkg,
    //             versionCode: version.versionCode,
    //         })
    //         .then((response) => {
    //             window.location.reload();
    //         })
    //         .catch((error) => {
    //             if (error.response) {
    //                 setError(error.response.data.message);
    //             } else {
    //                 setError("An error occurred while deleting the version.");
    //             }
    //         });
    //     }
    // }

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
                        {/* {
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
                                                                <td className={styles.actions}>
                                                                    <button 
                                                                    className={styles.delete} 
                                                                    style={{
                                                                        opacity: canNotDelete ? 0.5 : 1,
                                                                        pointerEvents: canNotDelete ? "none" : "auto",
                                                                        cursor: canNotDelete ? "not-allowed" : "pointer"
                                                                    }}
                                                                    onClick={() => handleDeleteVersion(version)}
                                                                    >Xoá</button>
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
                        } */}
                    </>
                )
            }
        </div>
    );
}