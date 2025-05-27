import React, { useEffect, useState } from "react";
import styles from "./configuration.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchConfigurations, selectConfigurations } from "../../../../slices/configuration.slice";
import Loader from "../../../../components/Loader";
import { useNavigate } from "react-router-dom";
import PATH from "../../../../enums/path.enum";
import configurationService from "../../../../services/configuration.service";
import CopyConfigurationDialog from "../../../../parts/CopyConfigurationDialog";

export default function Configuration() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const configurations = useSelector(selectConfigurations);

    const [searchTerm, setSearchTerm] = useState("");
    const [showCopyDialog, setShowCopyDialog] = useState(false);
    const [selectedConfiguration, setSelectedConfiguration] = useState(null);

    useEffect(() => {
        // Fetch configurations from the server
        dispatch(fetchConfigurations({ searchTerm: "" }));
    }, [])

    const handleSearch = () => {
        dispatch(fetchConfigurations({ searchTerm }));
    }

    const handleEditConfiguration = (configuration) => {
        navigate(PATH.editConfiguration.replace(":id", configuration._id));
    }

    const handleAddConfiguration = () => {
        navigate(PATH.editConfiguration.replace(":id", "new"));
    }

    const handleDeleteConfiguration = (configuration) => {
        const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa cấu hình "${configuration.name}"?`);
        if (!confirmDelete) {
            return;
        }
        configurationService.deleteConfiguration(configuration._id)
            .then(() => {
                // Refresh the configurations after deletion
                dispatch(fetchConfigurations({ searchTerm: "" }));
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    alert(error.response.data.message || "Lỗi khi xóa cấu hình");
                }
            });
    }

    const handleCopyConfiguration = (configuration) => {
        setSelectedConfiguration(configuration);
        setShowCopyDialog(true);
    }

    return (
        <div id={styles.root}>
            <div className={styles.searchBarContainer}>
                <input
                    type="text"
                    className={styles.searchBar}
                    placeholder="Tìm kiếm cấu hình"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                />
                <button className={styles.searchButton} onClick={handleSearch}>Tìm kiếm</button>
                <button className={styles.searchButton} onClick={handleAddConfiguration}>Thêm</button>
            </div>
            {
                configurations.data && !configurations.isLoading && configurations.data.length > 0 && (
                    <div className={styles.configTable}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Tên</th>
                                    <th>Mô tả</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {configurations.data.map((config) => (
                                    <tr key={config.id}>
                                        <td>{config.name}</td>
                                        <td>{config.description}</td>
                                        <td>
                                            <div style={{ display: "flex", gap: 5 }}>
                                                <button className={styles.signInButton} onClick={() => handleEditConfiguration(config)}>
                                                    <span class="glyphicon glyphicon-pencil"></span>
                                                </button>
                                                <button className={styles.signInButton} onClick={() => handleDeleteConfiguration(config)}>
                                                    <span class="glyphicon glyphicon-trash"></span>
                                                </button>
                                                <button className={styles.signInButton} onClick={() => handleCopyConfiguration(config)}>
                                                    <span class="glyphicon glyphicon-duplicate"></span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            }
            {
                configurations.data && configurations.data.length === 0 && !configurations.isLoading && (
                    <span className={styles.noData}>Không cấu hình nào được tìm thấy</span>
                )
            }
            {
                configurations.isLoading && (
                    <div className={styles.loading}>
                        <Loader color="#535353" width="35px" />
                        <span className={styles.loadingText} >Đang tải dữ liệu...</span>
                    </div>
                )
            }
            {
                configurations.errorMessage && !configurations.isLoading && (
                    <div className={styles.error}>
                        <span className={styles.errorText}>{configurations.errorMessage}</span>
                    </div>
                )
            }
            {
                showCopyDialog && selectedConfiguration && (
                    <CopyConfigurationDialog
                        configuration={selectedConfiguration}
                        isOpen={showCopyDialog}
                        onClose={() => setShowCopyDialog(false)}
                        onSubmit={() => {
                            dispatch(fetchConfigurations({ searchTerm: "" }));
                        }}
                    />
                )
            }
        </div>
    );
}