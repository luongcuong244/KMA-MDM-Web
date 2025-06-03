import React, { useEffect, useState, useRef } from "react";
import styles from "./remote_control.module.scss";
import { WebRTC } from "../../../../utils/webrtc";
import deviceService from "../../../../services/device.service";
import Loader from "../../../../components/Loader";
import socket from "../../../../socket/socket";
import { DeviceGestureHandler } from "../../../../utils/device.gesture.handler";

function log(level, message, context = {}) {
    console.log(`[${level}] ${message}`, context);
}

export default function RemoteControl() {
    const [error, setError] = useState("");

    const [device, setDevice] = useState(null);
    const [deviceId, setDeviceId] = useState(null);

    const webRTC = useRef(null);
    const deviceGestureHandler = useRef(null);
    const streamState = useRef(
        new Proxy({
            isServerAvailable: false,
            isTokenAvailable: false,
            isSocketConnected: false,
            isJoiningStream: false,
            streamId: null,
            isStreamJoined: false,
            isStreamRunning: false,
            error: null,
            isRemoteControlEnabled: false,
            readyForRemoteControl: false,
        }, {
            set(target, key, value) {
                const oldValue = target[key];
                target[key] = value;
                onNewState(key, oldValue, value, target);
                return true;
            }
        })
    )
    const uiElementsRef = useRef(null)

    useEffect(() => {
        socket.connect();
        socket.on("connect", () => {
            console.log("Socket connected");
        })
        // on error
        socket.on("connect_error", (err) => {
            console.error("Connection error:", err);
            setError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại ip.");
        });

        webRTC.current = new WebRTC("client-id", streamState.current, onNewTrack);
        webRTC.current.waitForServerOnlineAndConnect();

        uiElementsRef.current = {
            startContainer: document.getElementById('start-container'),
            streamIdInput: document.getElementById('stream-id'),
            passwordInput: document.getElementById('stream-password'),
            joinStreamContainer: document.getElementById('join-stream-container'),
            streamJoinButton: document.getElementById('streamJoinButton'),
            streamJoinErrorMessage: document.getElementById('streamJoinErrorMessage'),
            joinButtonLoader: document.getElementById('joinButtonLoader'),
            streamJoinCell: document.getElementById('stream-join'),
            streamErrorCell: document.getElementById('stream-error'),
            streamWaitContainer: document.getElementById('stream-wait-container'),
            streamWaitStreamId: document.getElementById('stream-wait-stream-id'),
            streamingHeader: document.getElementById('streaming-header'),
            streamingContainerText: document.getElementById('streaming-container-text'),
            videoContainer: document.getElementById('video-container'),
            videoElement: document.getElementById('video-element'),
            remoteContainer: document.getElementById('remote-container'),
            remoteLoader: document.getElementById('remote-loader'),
            leaveStreamButton: document.getElementById('leave-stream-button'),
            closeButton: document.getElementById('close-button'),
        };

        const beforeUnloadHandler = () => {
            webRTC.current.leaveStream(false);
        }

        window.addEventListener('beforeunload', beforeUnloadHandler);

        return () => {
            if (webRTC.current) {
                webRTC.current.disconnectSocket();
            }
            window.removeEventListener('beforeunload', beforeUnloadHandler);

            socket.off("connect");
            socket.disconnect();
        }
    }, [])

    const onNewState = (key, oldValue, newValue, state) => {
        if (newValue === oldValue) return;
        log('debug', `onNewState: [${key}] ${oldValue} => ${newValue}\n${JSON.stringify(state)}`);

        if (key === 'error' && state.error) {
            log('warn', `onNewState.error: ${state.error}`, { error: state.error });
        }

        const UIElements = uiElementsRef.current;
        if (!UIElements) return;

        UIElements.startContainer?.style && (UIElements.startContainer.style.display = (!state.isStreamJoined) ? 'block' : 'none');
        UIElements.streamWaitContainer?.style && (UIElements.streamWaitContainer.style.display = (state.isStreamJoined && !state.isStreamRunning) ? 'block' : 'none');
        UIElements.streamingHeader?.style && (UIElements.streamingHeader.style.display = (state.isStreamRunning) ? 'block' : 'none');
        UIElements.videoContainer?.style && (UIElements.videoContainer.style.display = (state.isStreamRunning) ? 'block' : 'none');

        UIElements.joinButtonLoader?.style && (UIElements.joinButtonLoader.style.display = (!state.isServerAvailable || (state.isServerAvailable && state.isTokenAvailable) || state.isJoiningStream) ? 'block' : 'none');

        UIElements.remoteLoader?.style && (UIElements.remoteLoader.style.display = (state.isRemoteControlEnabled && !state.readyForRemoteControl) ? 'flex' : 'none');

        UIElements.streamJoinButton?.style && (UIElements.streamJoinButton.style.display = (state.isSocketConnected && !state.isJoiningStream && !state.isStreamRunning) ? 'table-cell' : 'none');

        UIElements.streamErrorCell?.style && (UIElements.streamErrorCell.style.display = (state.error) ? 'block' : 'none');
        UIElements.streamJoinErrorMessage?.style && (UIElements.streamJoinErrorMessage.style.display = (state.error) ? 'block' : 'none');

        UIElements.leaveStreamButton?.style && (UIElements.leaveStreamButton.style.display = (state.isStreamRunning) ? 'block' : 'none');

        UIElements.closeButton?.style && (UIElements.closeButton.style.display = (state.isRemoteControlEnabled && !state.isStreamRunning) ? 'block' : 'none');

        UIElements.remoteContainer?.style && (UIElements.remoteContainer.style.display = (state.isRemoteControlEnabled) ? 'block' : 'none');

        if (state.error) {
            const errorCell = UIElements.streamErrorCell;
            const joinCell = UIElements.streamJoinCell;
            const joinButton = UIElements.streamJoinButton;
            const loader = UIElements.joinButtonLoader;
            const streamJoinErrorMessage = UIElements.streamJoinErrorMessage;

            switch (state.error) {
                case 'ERROR:TURNSTILE:200100':
                    // setError("Incorrect device clock time. Please adjust and reload the page.")    
                    streamJoinErrorMessage && (streamJoinErrorMessage.innerText = 'Incorrect device clock time. Please adjust and reload the page.');
                    errorCell && (errorCell.innerText = 'Incorrect device clock time. Please adjust and reload the page.');
                    joinCell?.style && (joinCell.style.display = 'none');
                    joinButton?.style && (joinButton.style.display = 'none');
                    loader?.style && (loader.style.display = 'none');
                    break;
                case 'ERROR:WRONG_STREAM_ID':
                    // setError("Thiết bị chưa được thêm hoặc đang không hoạt động ( Wrong stream id )");
                    streamJoinErrorMessage && (streamJoinErrorMessage.innerText = 'Thiết bị chưa được thêm hoặc đang không hoạt động ( Wrong stream id )');
                    errorCell && (errorCell.innerText = 'Wrong stream id');
                    break;
                case 'ERROR:NO_STREAM_HOST_FOUND':
                    // setError("Thiết bị chưa được thêm hoặc đang không hoạt động ( Stream not found )");
                    streamJoinErrorMessage && (streamJoinErrorMessage.innerText = 'Thiết bị chưa được thêm hoặc đang không hoạt động ( Stream not found )');
                    errorCell && (errorCell.innerText = 'Stream not found');
                    break;
                case 'ERROR:WRONG_STREAM_PASSWORD':
                    // setError("Sai mật khẩu stream");
                    streamJoinErrorMessage && (streamJoinErrorMessage.innerText = 'Sai mật khẩu stream');
                    errorCell && (errorCell.innerText = 'Wrong stream password');
                    break;
                default:
                    // setError("Có lỗi xảy ra. Vui lòng tải lại trang và thử lại");
                    streamJoinErrorMessage && (streamJoinErrorMessage.innerText = "Có lỗi xảy ra. Vui lòng tải lại trang và thử lại");
                    errorCell && (errorCell.innerText = 'Something went wrong. Reload this page and try again.' + `\n[${state.error}]\n\n`);
                    joinCell?.style && (joinCell.style.display = 'none');
                    joinButton?.style && (joinButton.style.display = 'none');
                    loader?.style && (loader.style.display = 'none');
                    break;
            }
        } else {
            setError("");
        }

        if (key === 'isStreamJoined' && state.isStreamJoined) {
            UIElements.streamWaitStreamId && (UIElements.streamWaitStreamId.innerText = `Stream Id: ${state.streamId}`);
            UIElements.streamingContainerText && (UIElements.streamingContainerText.innerText = `Stream Id: ${state.streamId}`);
        }

        if (key === 'isStreamRunning') {
            if (state.isStreamRunning) {
                // window.addEventListener('mousemove', streamingContainerOnMouseMove);
                // window.addEventListener('touchstart', streamingContainerOnMouseMove);
                // window.addEventListener('mouseout', streamingContainerOnMouseOut);
                // streamingContainerOnMouseMove();
            } else {
                if (UIElements.videoElement && UIElements.videoElement.srcObject) {
                    UIElements.videoElement.srcObject.getTracks().forEach(track => track.stop());
                    UIElements.videoElement.srcObject = null;
                }

                // clearTimeout(hideTimeout);
                // window.removeEventListener('mousemove', streamingContainerOnMouseMove);
                // window.removeEventListener('touchstart', streamingContainerOnMouseMove);
                // window.removeEventListener('mouseout', streamingContainerOnMouseOut);
            }
        }
    };

    const onNewTrack = (track) => {
        console.log(`onNewTrack: ${track.id}`, { track_id: track.id });

        const UIElements = uiElementsRef.current;

        if (!UIElements.videoElement.srcObject) {
            UIElements.videoElement.srcObject = new MediaStream();
        }

        UIElements.videoElement.srcObject.addTrack(track);
    };

    const handleJoinStream = () => {
        if (!deviceId) {
            setError("Vui lòng nhập mã thiết bị");
            return;
        }
        streamState.current.readyForRemoteControl = false;
        streamState.current.isRemoteControlEnabled = true;
        deviceService.getDeviceByIdForRemoteControl(deviceId)
            .then((res) => {
                if (res.status === 200) {
                    const device = res.data.data;
                    setDevice(device);
                    setError("");

                    const { deviceInfo } = device;
                    console.log("Full screen size: ", deviceInfo.fullScreenWidth, " x ", deviceInfo.fullScreenHeight);
                    console.log("Display size: ", deviceInfo.displayScreenWidth, " x ", deviceInfo.displayScreenHeight);
                    console.log("Status bar height: ", deviceInfo.statusBarHeight);
                    console.log("Navigation bar height: ", deviceInfo.navigationBarHeight);

                    initDeviceGestureHandler(
                        deviceInfo.fullScreenWidth,
                        deviceInfo.fullScreenHeight
                    );

                    if (socket.connected) {
                        console.log("Requesting remote control for device:", deviceId);
                        // we need to wait for the user confirmation ( max 10s )
                        socket.timeout(15000).emit("web:send:request_remote_control", {
                            deviceId: deviceId,
                        }, (error, response) => {
                            if (error) {
                                streamState.current.isRemoteControlEnabled = false;
                                streamState.current.readyForRemoteControl = false;
                                console.error("Error requesting remote control:", error);
                                setError(error.message || "Không thể kết nối đến máy chủ điều khiển từ xa");
                                return;
                            }
                            if (response.status == "error") {
                                streamState.current.isRemoteControlEnabled = false;
                                streamState.current.readyForRemoteControl = false;
                                setError(response.message || "Không thể kết nối đến máy chủ điều khiển từ xa");
                            } else {
                                streamState.current.readyForRemoteControl = true;
                            }
                        })
                    } else {
                        streamState.current.isRemoteControlEnabled = false;
                        setError("Không thể kết nối đến máy chủ điều khiển từ xa");
                    }
                } else {
                    streamState.current.isRemoteControlEnabled = false;
                    setError("Thiết bị chưa được thêm hoặc đang không hoạt động");
                }
            })
            .catch((err) => {
                console.log(err);
                streamState.current.isRemoteControlEnabled = false;
                if (err.response && err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError("Thiết bị chưa được thêm hoặc đang không hoạt động");
                }
            });
    };

    const initDeviceGestureHandler = (fullScreenDeviceWidth, fullScreenDeviceHeight) => {
        if (deviceGestureHandler.current) {
            deviceGestureHandler.current.clearAllListeners();
        }

        const videoElement = document.getElementById('video-container');
        if (!videoElement) {
            console.error("Video element not found");
            return;
        }

        console.log("Initializing DeviceGestureHandler with full screen size: ", fullScreenDeviceWidth, " x ", fullScreenDeviceHeight);

        deviceGestureHandler.current = new DeviceGestureHandler(videoElement, fullScreenDeviceWidth, fullScreenDeviceHeight);
        deviceGestureHandler.current.setOnClick(
            (x, y) => {
                console.log(`Click at: ${x}, ${y}`);
                webRTC.current.sendClickEvent(x, y);
            }
        );
        deviceGestureHandler.current.setOnSwipe(
            (start, end, duration) => {
                console.log(`Swipe from: ${start.x}, ${start.y} to ${end.x}, ${end.y} in ${duration}ms`);
                webRTC.current.sendSwipeEvent(start, end, duration);
            }
        );
    }

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
                <button className={styles.searchButton} onClick={handleJoinStream}>Điều khiển</button>
            </div>
            <div id={"remote-container"} style={{ display: 'none' }}>
                <div id={"video-container"} style={{ display: 'none' }}>
                    <video id={"video-element"} muted autoPlay playsInline controls></video>
                </div>
                <button id={"leave-stream-button"} className={styles.leaveStreamButton} onClick={() => {
                    webRTC.current.leaveStream(true);
                }}>Ngắt kết nối</button>
                <button id={"close-button"} className={styles.leaveStreamButton} onClick={() => {
                    webRTC.current.leaveStream(true);
                    streamState.current.isRemoteControlEnabled = false;
                }}>Đóng</button>
                <div id={"remote-loader"} className={styles.loaderContainer}>
                    <Loader color="#ffffff" width="45px" />
                </div>
                <div id={"join-stream-container"} className={styles.joinStreamContainer}>
                    <span id={"streamJoinErrorMessage"} className={styles.errorMessage}></span>
                    <button id={"streamJoinButton"} className={styles.joinStreamButton} onClick={() => {
                        // join stream
                        webRTC.current.joinStream(deviceId, "password");
                    }}>Bắt đầu điều khiển thiết bị</button>
                </div>
            </div>
        </div>
    );
}