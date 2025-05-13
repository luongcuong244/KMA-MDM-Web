import React, { useEffect, useState } from "react";
import styles from "./push_message.module.scss";
import socket from "../../../../socket/socket";
import AddMessageDialog from "../../../../parts/AddMessageDialog";
import Converter from "../../../../utils/converter";

export default function PushMessage() {
    const [error, setError] = useState(null);
    const [pushMessages, setPushMessages] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [openAddMessageDialog, setOpenAddMessageDialog] = useState(false);

    useEffect(() => {
        socket.connect();
        socket.on("connect", () => {
            socket.emit("web:send:get_push_messages");
        });
        socket.on("web:receive:get_push_messages", (data) => {
            if (data.error) {
                setError(data.error);
            } else {
                setPushMessages(data.data);
            }
        });
        socket.on("web:receive:push_message", (data) => {
            if (data.status === "error" && data.message) {
                alert(data.message);
            } else if (data.status === "success" && data.data) {
                setPushMessages((prev) => [data.data, ...prev]);
            }
        });

        return () => {
            socket.off("connect");
            socket.off("web:receive:get_push_messages");
            socket.off("web:receive:push_message");
            socket.disconnect();
        }
    }, [])

    const handleSearch = () => {
        
    }

    const handleAddApplication = () => {
        setOpenAddMessageDialog(true);
    }

    const handleSubmit = (message) => {
        socket.emit("web:send:push_message", message);
    };

    const filteredPushMessages = pushMessages.filter((message) => {
        return (
            message.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.messageType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (message.payload && JSON.stringify(message.payload).toLowerCase().includes(searchTerm.toLowerCase())) ||
            Converter.formatDate(message.createdAt).toLowerCase().includes(searchTerm.toLowerCase())
        );
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
                filteredPushMessages.length > 0 && (
                    <>
                        <div className={styles.configTable}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Thời gian</th>
                                        <th>Thiết bị</th>
                                        <th>Loại</th>
                                        <th>Dữ liệu đính kèm</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filteredPushMessages.map((device) => {
                                            return (
                                                <tr key={device._id}>
                                                    <td>{Converter.formatDate(device.createdAt)}</td>
                                                    <td>{device.deviceId}</td>
                                                    <td>{device.messageType}</td>
                                                    <td>{device.payload ? JSON.stringify(device.payload) : ""}</td>
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
                filteredPushMessages.length === 0 && (
                    <span className={styles.noData}>Không có dữ liệu</span>
                )
            }
            {
                error && (
                    <div className={styles.error}>
                        <span className={styles.errorText}>{error}</span>
                    </div>
                )
            }
            {
                openAddMessageDialog &&
                <AddMessageDialog
                    isOpen={openAddMessageDialog}
                    onClose={() => setOpenAddMessageDialog(false)}
                    onSubmit={handleSubmit}
                />
            }
        </div>
    );
}