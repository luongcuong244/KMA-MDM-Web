import React, { useEffect, useState } from "react";
import styles from "./remote_control.module.scss";
import socket from "../../../../socket/socket";

export default function RemoteControl() {
    const [error, setError] = useState("dsđasadsadsds");

    const [deviceId, setDeviceId] = useState(null);

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
            <label className={styles.title}>Điều khiển thiết bị từ xa</label>
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
                <button className={styles.searchButton}>Điều khiển</button>
            </div>
        </div>
    );
}