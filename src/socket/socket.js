// src/socket.js
import { io } from "socket.io-client";
import CONSTANT from "../utils//constant";

const socket = io(CONSTANT.socketUrl, {
    auth: {
        clientToken: "YOUR_TOKEN_HERE",
    },
    transports: ['websocket'],
    autoConnect: true,
});

export default socket;