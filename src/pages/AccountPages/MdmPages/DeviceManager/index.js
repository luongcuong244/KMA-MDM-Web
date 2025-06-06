import React, { useState, useEffect } from "react";
import styles from "./device_manager.module.scss";
import Loader from "../../../../components/Loader";
import AddDeviceDialog from "../../../../parts/AddDeviceDialog";
import deviceService from "../../../../services/device.service";
import PATH from "../../../../enums/path.enum";
import DeviceQRCodeDialog from "../../../../parts/DeviceQRCodeDialog";
import CurrentDeviceStatus from "../../../../parts/CurrentDeviceStatus";
import Converter from "../../../../utils/converter";
import EditDeviceDialog from "../../../../parts/EditDeviceDialog";
import userService from "../../../../services/user.service";
import AddUserDialog from "../../../../parts/AddUserDialog";
import EditUserDialog from "../../../../parts/EditUserDialog";
import ChnageUserPasswordDialog from "../../../../parts/ChangeUserPasswordDialog";
import LockUserDialog from "../../../../parts/LockUserDialog";

export default function DeviceManager() {
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
    const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
    const [changeUserPasswordDialogOpen, setChangeUserPasswordDialogOpen] = useState(false);
    const [lockUserDialogOpen, setLockUserDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        // Fetch applications from the server
        fetchUsers();
    }, [])

    const fetchUsers = () => {
        setLoading(true);
        userService.getAllUsers()
            .then((response) => {
                if (response.data && response.data.data) {
                    setUsers(response.data.data);
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
                <button
                    className={styles.searchButton}
                    onClick={() => {
                        setAddUserDialogOpen(true)
                    }}
                >Thêm</button>
            </div>
            {
                !loading && users.length > 0 && (
                    <>
                        <div className={styles.configTable}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Tên đăng nhập</th>
                                        <th>Ngày tạo</th>
                                        <th>Lần đăng nhập cuối</th>
                                        <th>Thiết bị quản lý</th>
                                        <th>Tình trạng</th>
                                        <th>Lý do khóa</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.map((user) => {
                                            return (
                                                <tr key={user._id}>
                                                    <td>{user.userName}</td>
                                                    <td>{user.createdAt ? Converter.formatDate(user.createdAt) : "--:--"}</td>
                                                    <td>{user.lastLogin ? Converter.formatDate(user.lastLogin) : "--:--"}</td>
                                                    <td>{user.countUsedDevice ?? 0} / {user.maxManagedDevices}</td>
                                                    <td>{user.isBlocked ? "Đang khóa" : "Hoạt động"}</td>
                                                    <td>{user.blockedReason ?? ""}</td>
                                                    <td>
                                                        <div style={{ display: "flex", gap: 5 }}>
                                                            <button
                                                                className={styles.signInButton}
                                                                onClick={() => {
                                                                    setSelectedUser(user);
                                                                    setEditUserDialogOpen(true);
                                                                }}
                                                            >
                                                                <span class="glyphicon glyphicon-pencil"></span>
                                                            </button>
                                                            <button
                                                                className={styles.signInButton}
                                                                onClick={() => {
                                                                    setSelectedUser(user);
                                                                    setChangeUserPasswordDialogOpen(true);
                                                                }}
                                                            >
                                                                <span class="glyphicon glyphicon-refresh"></span>
                                                            </button>
                                                            <button
                                                                className={styles.signInButton}
                                                                onClick={() => {
                                                                    if (user.isBlocked) {
                                                                        if (window.confirm("Bạn có chắc chắn muốn mở khóa tài khoản này?")) {
                                                                            userService.unlockUser(user._id)
                                                                                .then(() => {
                                                                                    alert("Đã mở khóa tài khoản thành công");
                                                                                    fetchUsers();
                                                                                })
                                                                                .catch((err) => {
                                                                                    console.error("Error unlocking user:", err);
                                                                                    if (err.response && err.response.data) {
                                                                                        alert(err.response.data.message);
                                                                                    } else {
                                                                                        alert("Lỗi khi mở khóa tài khoản");
                                                                                    }
                                                                                });
                                                                        }
                                                                    } else {
                                                                        setSelectedUser(user);
                                                                        setLockUserDialogOpen(true);
                                                                    }
                                                                }}
                                                            >
                                                                <span class="glyphicon glyphicon-lock"></span>
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
                users.length === 0 && !loading && (
                    <span className={styles.noData}>Chưa có người dùng nào được tạo</span>
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
                addUserDialogOpen && (
                    <AddUserDialog
                        isOpen={addUserDialogOpen}
                        onClose={() => setAddUserDialogOpen(false)}
                        onSubmit={fetchUsers}
                    />
                )
            }
            {
                editUserDialogOpen && selectedUser && (
                    <EditUserDialog
                        user={selectedUser}
                        isOpen={editUserDialogOpen}
                        onClose={() => setEditUserDialogOpen(false)}
                        onSubmit={fetchUsers}
                    />
                )
            }
            {
                changeUserPasswordDialogOpen && selectedUser && (
                    <ChnageUserPasswordDialog
                        user={selectedUser}
                        isOpen={changeUserPasswordDialogOpen}
                        onClose={() => setChangeUserPasswordDialogOpen(false)}
                        onSubmit={() => {
                            alert("Đã thay đổi mật khẩu thành công");
                        }}
                    />
                )
            }
            {
                lockUserDialogOpen && selectedUser && (
                    <LockUserDialog
                        user={selectedUser}
                        isOpen={lockUserDialogOpen}
                        onClose={() => setLockUserDialogOpen(false)}
                        onSubmit={() => {
                            alert("Đã khóa tài khoản thành công");
                            fetchUsers();
                        }}
                    />
                )
            }
        </div>
    );
}