import React, { useState, useEffect } from "react";
import styles from "./device.module.scss";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../components/Loader";
import AddDeviceDialog from "../../../../parts/AddDeviceDialog";
import deviceService from "../../../../services/device.service";
import PATH from "../../../../enums/path.enum";

export default function Device() {
    const [error, setError] = useState(null);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [openAddDeviceDialog, setOpenAddDeviceDialog] = useState(false);

    useEffect(() => {
        // Fetch applications from the server
        fetchDevices();
    }, [])

    const fetchDevices = () => {
        setLoading(true);
        deviceService.getDeviceList()
            .then((response) => {
                if (response.data && response.data.data) {
                    setDevices(response.data.data);
                    setError(null);
                } else {
                    console.error("No data found in response");
                    setError("No data found");
                }
            })
            .catch((error) => {
                console.error("Error fetching app icons:", error);
                if (error.response && error.response.data) {
                    setError(error.response.data.message);
                } else {
                    setError("Error fetching devices");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleSearch = () => {
        // dispatch(fetchApplications({ searchTerm }));
    }

    const handleAddApplication = () => {
        setOpenAddDeviceDialog(true);
    }

    const handleSubmit = (newDevice) => {
        setDevices((prevDevices) => [...prevDevices, newDevice]);
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
                !loading && devices.length > 0 && (
                    <>
                        <div className={styles.configTable}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Trạng thái</th>
                                        <th>Thời gian</th>
                                        <th>Mã thiết bị</th>
                                        <th>Cấu hình</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        devices.map((device) => {
                                            return (
                                                <tr key={device._id}>
                                                    <td>{device.status}</td>
                                                    <td>{device.enrollDate ?? "unknown"}</td>
                                                    <td>{device.deviceId}</td>
                                                    <td>
                                                        <a
                                                            href={PATH.editConfiguration.replace(":id", device.configuration._id)}
                                                        >{device.configuration.name}</a>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: "flex", gap: 5 }}>
                                                            <button className={styles.signInButton}>
                                                                <span class="glyphicon glyphicon-pencil"></span>
                                                            </button>
                                                            <button className={styles.signInButton}>
                                                                <span class="glyphicon glyphicon-trash"></span>
                                                            </button>
                                                            <button className={styles.signInButton}>
                                                                <span class="glyphicon glyphicon-qrcode"></span>
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
                devices.length === 0 && !loading && (
                    <span className={styles.noData}>Không cấu hình nào được tìm thấy</span>
                )
            }
            {
                loading && (
                    <div className={styles.loading}>
                        <Loader color="#535353" width="35px" />
                        <span className={styles.loadingText} >Đang tải dữ liệu...</span>
                    </div>
                )
            }
            {
                error && !loading && (
                    <div className={styles.error}>
                        <span className={styles.errorText}>{error}</span>
                    </div>
                )
            }
            {
                openAddDeviceDialog &&
                <AddDeviceDialog
                    isOpen={openAddDeviceDialog}
                    onClose={() => setOpenAddDeviceDialog(false)}
                    onSubmit={handleSubmit}
                />
            }
        </div>
    );
}