import { useEffect, useState } from "react";
import styles from "./push_message.module.scss";
import socket from "../../../../socket/socket";
import AddMessageDialog from "../../../../parts/AddMessageDialog";
import Converter from "../../../../utils/converter";
import Loader from "../../../../components/Loader";

export default function PushMessage() {
    const [message, setMessage] = useState(null);
    const [mesType, setMesType] = useState("error"); // [error, warning, success]
    const [isLoading, setIsLoading] = useState(false);
    const [pushMessages, setPushMessages] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [openAddMessageDialog, setOpenAddMessageDialog] = useState(false);

    useEffect(() => {
        socket.connect();
        socket.on("connect", () => {
            socket.emit("web:send:get_push_messages");
        });
        // on error
        socket.on("connect_error", (err) => {
            console.error("Connection error:", err);
            setMessage("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại ip.");
            setMesType("error");
        });
        socket.on("web:receive:get_push_messages", (data) => {
            if (data.error) {
                setMesType("error");
                setMessage(data.error);
            } else {
                setPushMessages(data.data);
            }
        });

        return () => {
            socket.off("connect");
            socket.off("web:receive:get_push_messages");
            socket.disconnect();
        }
    }, [])

    const handleSearch = () => {
        
    }

    const handleAddApplication = () => {
        setOpenAddMessageDialog(true);
    }

    const handleSubmit = (message) => {
        setIsLoading(true);
        socket.timeout(6000).emit("web:send:push_message", message, (error, response) => {
            if (error) {
                setMessage(error.message);
                setMesType("error");
                setIsLoading(false);
            } else {
                if (response.message) {
                    setMessage(response.message);
                }
                if (response.status === "error") {
                    setMesType("error");
                } else if (response.status === "warning") {
                    setMesType("warning");
                } else if (response.status === "success" && response.data) {
                    setMesType("success");
                    setPushMessages((prev) => [response.data, ...prev]);
                } else {
                    setMesType("error");
                    setMessage("Đã có lỗi xảy ra. Không nhận được dữ liệu trả về từ máy chủ.");
                }
                setIsLoading(false);
            }
        });
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
            {
                !isLoading && message && (
                    <div className={styles.error}>
                        <span 
                            style={{
                                color: mesType === "error" ? "red" : mesType === "warning" ? "orange" : "green"
                            }}
                            className={styles.errorText}
                        >{message}</span>
                    </div>
                )
            }
            {
                isLoading && (
                    <div className={styles.loaderContainer}>
                        <Loader />
                    </div>
                )
            }
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