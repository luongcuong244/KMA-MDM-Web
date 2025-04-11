import React, { useEffect, useState } from "react";
import styles from "./configuration.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchConfigurations, selectConfigurations } from "../../../../slices/configuration.slice";
import Loader from "../../../../components/Loader";

export default function Configuration() {
    const dispatch = useDispatch();
    const configurations = useSelector(selectConfigurations);

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Fetch configurations from the server
        dispatch(fetchConfigurations({ searchTerm: "" }));
    }, [])

    const handleSearch = () => {
        dispatch(fetchConfigurations({ searchTerm }));
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
                <button className={styles.searchButton}>Thêm</button>
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
                                        <td className={styles.actions}>
                                            <button className={styles.edit}>Sửa</button>
                                            <button className={styles.delete}>Xóa</button>
                                            <button className={styles.copy}>Sao chép</button>
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
        </div>
    );
}