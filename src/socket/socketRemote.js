// src/socket.js
import { io } from "socket.io-client";
import CONSTANT from "../utils/constant";

const socketRemote = io(CONSTANT.socketUrl + "/remote", {
    auth: {
        clientToken: "YOUR_TOKEN_HERE",
    },
    transports: ['websocket'],
    autoConnect: true,
});

export default socketRemote;