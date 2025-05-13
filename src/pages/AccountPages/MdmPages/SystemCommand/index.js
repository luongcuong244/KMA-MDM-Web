import React, { useEffect, useState } from "react";
import styles from "./system_command.module.scss";
import socket from "../../../../socket/socket";

export default function SystemCommand() {
    const [error, setError] = useState("");
    const [deviceId, setDeviceId] = useState(null);
    const [device, setDevice] = useState(null);

    useEffect(() => {
        socket.connect();
        socket.on("connect", () => {
            socket.emit("web:send:get_push_messages");
        });
        return () => {
            socket.off("connect");
            socket.disconnect();
        }
    }, [])

    return (
        <div id={styles.root}>
            <label className={styles.title}>Lệnh hệ thống</label>
            {
                error && (
                    <div className={styles.error}>
                        <span className={styles.errorText}>{error}</span>
                    </div>
                )
            }
            <div className={styles.searchBarContainer}>
                <input
                    type="text"
                    className={styles.searchBar}
                    placeholder="Nhập mã thiết bị"
                    onChange={(e) => setDeviceId(e.target.value)}
                    value={deviceId}
                />
                <button className={styles.searchButton}>Tìm kiếm</button>
            </div>
        </div>
    );
}