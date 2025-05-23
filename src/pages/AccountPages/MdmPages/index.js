import React from "react";
import styles from "./mdm.module.scss";
import MdmPageNavGenerator from "../../../parts/AccountPageNavGenerator";
import PATH from "../../../enums/path.enum";
import Device from "./Device";
import Application from "./Application";
import Configuration from "./Configuration";
import PushMessage from "./PushMessage";
import RemoteControl from "./RemoteControl";
import SystemCommand from "./SystemCommand";

export default function MdmPages() {
    return (
        <div id={styles.root}>
            <MdmPageNavGenerator
                parentRoute={PATH.root}
                routes={[
                    {
                        path: PATH.device,
                        text: "Thiết bị",
                        page: Device,
                    },
                    {
                        path: PATH.application,
                        text: "Ứng dụng",
                        page: Application,
                    },
                    {
                        path: PATH.configuration,
                        text: "Cấu hình",
                        page: Configuration,
                    },
                    {
                        path: PATH.pushMessage,
                        text: "Tin nhắn đẩy",
                        page: PushMessage,
                    },
                    {
                        path: PATH.remoteControl,
                        text: "Điều khiển từ xa",
                        page: RemoteControl,
                    },
                    {
                        path: PATH.systemCommand,
                        text: "Lệnh hệ thống",
                        page: SystemCommand,
                    },
                ]}
            />
        </div>
    );
}