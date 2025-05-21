import React, { useEffect, useState, useRef } from "react";
import styles from "./remote_control.module.scss";
import socketRemote from "../../../../socket/socketRemote";
import { WebRTC } from "../../../../utils/webrtc";
import deviceService from "../../../../services/device.service";
import Loader from "../../../../components/Loader";

function log(level, message, context = {}) {
    console.log(`[${level}] ${message}`, context);
}

export default function RemoteControl() {
    const [error, setError] = useState("");

    const [device, setDevice] = useState(null);
    const [deviceId, setDeviceId] = useState(null);

    const webRTC = useRef(null);
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
        webRTC.current = new WebRTC("client-id", streamState.current, onNewTrack);
        webRTC.current.waitForServerOnlineAndConnect();

        uiElementsRef.current = {
            startContainer: document.getElementById('start-container'),
            streamIdInput: document.getElementById('stream-id'),
            passwordInput: document.getElementById('stream-password'),
            streamJoinButton: document.getElementById('streamJoinButton'),
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

        UIElements.streamJoinButton?.style && (UIElements.streamJoinButton.style.display = (state.isSocketConnected && !state.isJoiningStream) ? 'table-cell' : 'none');

        UIElements.streamErrorCell?.style && (UIElements.streamErrorCell.style.display = (state.error) ? 'block' : 'none');

        UIElements.remoteContainer?.style && (UIElements.remoteContainer.style.display = (state.isStreamRunning) ? 'block' : 'none');

        if (state.error) {
            uiElementsRef.current.remoteContainer.style.display = 'none';

            const errorCell = UIElements.streamErrorCell;
            const joinCell = UIElements.streamJoinCell;
            const joinButton = UIElements.streamJoinButton;
            const loader = UIElements.joinButtonLoader;

            switch (state.error) {
                case 'ERROR:TURNSTILE:200100':
                    setError("Incorrect device clock time. Please adjust and reload the page.")    

                    errorCell && (errorCell.innerText = 'Incorrect device clock time. Please adjust and reload the page.');
                    joinCell?.style && (joinCell.style.display = 'none');
                    joinButton?.style && (joinButton.style.display = 'none');
                    loader?.style && (loader.style.display = 'none');
                    break;
                case 'ERROR:WRONG_STREAM_ID':
                    setError("Thiết bị chưa được thêm hoặc đang không hoạt động ( Wrong stream id )");
                    errorCell && (errorCell.innerText = 'Wrong stream id');
                    break;
                case 'ERROR:NO_STREAM_HOST_FOUND':
                    setError("Thiết bị chưa được thêm hoặc đang không hoạt động ( Stream not found )");
                    errorCell && (errorCell.innerText = 'Stream not found');
                    break;
                case 'ERROR:WRONG_STREAM_PASSWORD':
                    setError("Sai mật khẩu stream");
                    errorCell && (errorCell.innerText = 'Wrong stream password');
                    break;
                default:
                    setError("Có lỗi xảy ra. Vui lòng tải lại trang và thử lại");
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
        uiElementsRef.current.remoteContainer.style.display = 'block';
        uiElementsRef.current.remoteLoader.style.display = 'flex';
        deviceService.getDeviceById(deviceId)
            .then((res) => {
                if (res.status === 200) {
                    setDevice(res.data.data);
                    setError("");
                    // join stream
                    webRTC.current.joinStream(deviceId, "password");

                    console.log("Full screen size: ", device.fullScreenWidth, " x ",device.fullScreenHeight);
                    console.log("Display size: ", device.displayScreenWidth, " x ",device.displayScreenHeight);
                    console.log("Status bar height: ", device.statusBarHeight);
                    console.log("Navigation bar height: ", device.navigationBarHeight);
                } else {
                    setError("Thiết bị chưa được thêm hoặc đang không hoạt động");
                }
            })
            .catch((err) => {
                console.log(err);
                setError("Thiết bị chưa được thêm hoặc đang không hoạt động");
                uiElementsRef.current.remoteContainer.style.display = 'none';
            })
            .finally(() => {
                uiElementsRef.current.remoteLoader.style.display = 'none';
            });
    };

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
                <button className={styles.leaveStreamButton} onClick={() => {
                    webRTC.current.leaveStream(true);
                }}>Ngắt kết nối</button>
                <div id={"remote-loader"} className={styles.loaderContainer}>
                    <Loader color="#535353" width="45px" />
                </div>
            </div>
        </div>
    );
}