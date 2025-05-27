import styles from "./mdm.module.scss";
import MdmPageNavGenerator from "../../../parts/AccountPageNavGenerator";
import PATH from "../../../enums/path.enum";
import Device from "./Device";
import Application from "./Application";
import Configuration from "./Configuration";
import PushMessage from "./PushMessage";
import RemoteControl from "./RemoteControl";
import SystemCommand from "./SystemCommand";
import { selectUser } from "../../../slices/user.slice";
import ROLE from "../../../enums/role.enum";
import DeviceManager from "./DeviceManager";
import { useSelector } from "react-redux";

export default function MdmPages() {
    const user = useSelector(selectUser);

    const routes = user?.role === ROLE.admin ? [
        {
            path: PATH.deviceManager,
            text: "Người quản lý thiết bị",
            page: DeviceManager,
        },
    ] : [
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
    ];

    return (
        <div id={styles.root}>
            <MdmPageNavGenerator
                parentRoute={PATH.root}
                routes={routes}
            />
        </div>
    );
}