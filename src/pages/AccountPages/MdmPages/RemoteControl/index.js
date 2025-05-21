import React, { useEffect, useState, useRef } from "react";
import styles from "./remote_control.module.scss";
import socketRemote from "../../../../socket/socketRemote";
import { WebRTC } from "../../../../utils/webrtc";

function log(level, message, context = {}) {
    console.log(`[${level}] ${message}`, context);
}

export default function RemoteControl() {
    const [error, setError] = useState("dsđasadsadsds");

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

    useEffect(() => {
        webRTC.current = new WebRTC("client-id", streamState.current, onNewTrack);
        webRTC.current.waitForServerOnlineAndConnect();

        return () => {
            if (webRTC.current) {
                webRTC.current.disconnectSocket();
            }
        }
    }, [])

    const onNewState = (key, oldValue, newValue, state) => {
        if (newValue === oldValue) return;
        log('debug', `onNewState: [${key}] ${oldValue} => ${newValue}\n${JSON.stringify(state)}`);

        if (key === 'error' && state.error) {
            log('warn', `onNewState.error: ${state.error}`, { error: state.error });
        }

        // UIElements.startContainer.style.display = (!state.isStreamJoined) ? 'block' : 'none';
        // UIElements.streamWaitContainer.style.display = (state.isStreamJoined && !state.isStreamRunning) ? 'block' : 'none';
        // UIElements.streamingHeader.style.display = (state.isStreamRunning) ? 'block' : 'none';
        // UIElements.videoContainer.style.display = (state.isStreamRunning) ? 'block' : 'none';

        // UIElements.joinButtonLoader.style.display = (!state.isServerAvailable || (state.isServerAvailable && state.isTokenAvailable) || state.isJoiningStream) ? 'block' : 'none';

        // UIElements.streamJoinButton.style.display = (state.isSocketConnected && !state.isJoiningStream) ? 'table-cell' : 'none';

        // UIElements.streamErrorCell.style.display = (state.error) ? 'block' : 'none';

        if (state.error) {
            switch (state.error) {
                case 'ERROR:TURNSTILE:200100':
                    // UIElements.streamErrorCell.innerText = 'Incorrect device clock time. Please adjust and reload the page.';
                    // UIElements.streamJoinCell.style.display = 'none';
                    // UIElements.streamJoinButton.style.display = 'none';
                    // UIElements.joinButtonLoader.style.display = 'none';
                    break;
                case 'ERROR:WRONG_STREAM_ID':
                    //UIElements.streamErrorCell.innerText = 'Wrong stream id';
                    break;
                case 'ERROR:NO_STREAM_HOST_FOUND':
                    //UIElements.streamErrorCell.innerText = 'Stream not found';
                    break;
                case 'ERROR:WRONG_STREAM_PASSWORD':
                    //UIElements.streamErrorCell.innerText = 'Wrong stream password';
                    break;
                default:
                    // UIElements.streamErrorCell.innerText = 'Something went wrong. Reload this page and try again.' + `\n[${state.error}]\n\n`;
                    // UIElements.streamJoinCell.style.display = 'none';
                    // UIElements.streamJoinButton.style.display = 'none';
                    // UIElements.joinButtonLoader.style.display = 'none';
                    break;
            }
        }

        if (key === 'isStreamJoined' && state.isStreamJoined) {
            //UIElements.streamWaitStreamId.innerText = 'Stream Id: {streamId}'.replace('{streamId}', state.streamId);

            //UIElements.streamingContainerText.innerText = 'Stream Id: {streamId}'.replace('{streamId}', state.streamId);
        }

        if (key === 'isStreamRunning') {
            if (state.isStreamRunning) {
                // window.addEventListener('mousemove', streamingContainerOnMouseMove);
                // window.addEventListener('touchstart', streamingContainerOnMouseMove);
                // window.addEventListener('mouseout', streamingContainerOnMouseOut);
                // streamingContainerOnMouseMove();
            } else {
                // if (UIElements.videoElement && UIElements.videoElement.srcObject) {
                //     UIElements.videoElement.srcObject.getTracks().forEach(track => track.stop());
                //     UIElements.videoElement.srcObject = null;
                // }

                // clearTimeout(hideTimeout);
                // window.removeEventListener('mousemove', streamingContainerOnMouseMove);
                // window.removeEventListener('touchstart', streamingContainerOnMouseMove);
                // window.removeEventListener('mouseout', streamingContainerOnMouseOut);
            }
        }
    };

    const onNewTrack = (track) => {
        console.log(`onNewTrack: ${track.id}`, { track_id: track.id });

        // if (!UIElements.videoElement.srcObject) {
        //     UIElements.videoElement.srcObject = new MediaStream();
        // }

        // UIElements.videoElement.srcObject.addTrack(track);
    };

    const handleJoinStream = () => {
        if (!deviceId) {
            setError("Vui lòng nhập mã thiết bị");
            return;
        }
        webRTC.current.joinStream(deviceId, "password");
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
        </div>
    );
}