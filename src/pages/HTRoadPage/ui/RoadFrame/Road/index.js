import React from "react";
import styles from "./road.module.scss";
import RoadBar from "./RoadBar";
import Scrollable from "../../../../../components/Scrollable";
import HourNumber from "./HourNumber";
import GiftList from "./GiftList";
import ITEM from "../../../../../enums/item.enum";
import PresentGif from "../../../../../assets/imgs/present.gif";
import { selectScrollableManagement } from "../../../../../slices/scrollable_management.slice";
import { useSelector } from "react-redux";

const widthItem = 200;

const Road = () => {

    const data = {
        gifts: [
            {
                id: 1,
                requireTimedHours: 1,
                iconUrl: "https://i.imgur.com/63ci3X9.png",
                type: ITEM.money,
                name: "Tiền",
                quantity: 100,
                isClaimed: true
            },
            {
                id: 2,
                requireTimedHours: 2,
                iconUrl: "https://i.imgur.com/63ci3X9.png",
                type: ITEM.money,
                name: "Tiền",
                quantity: 1000,
                isClaimed: true
            },
            {
                id: 3,
                requireTimedHours: 3,
                iconUrl: "https://i.imgur.com/wAGjnpP.png",
                type: ITEM.money,
                name: "Tiền",
                quantity: 2000,
                isClaimed: false
            },
            {
                id: 4,
                requireTimedHours: 4,
                iconUrl: "https://i.imgur.com/wAGjnpP.png",
                type: ITEM.money,
                name: "Tiền",
                quantity: 3000,
                isClaimed: false
            },
            {
                id: 5,
                requireTimedHours: 5,
                iconUrl: "https://i.imgur.com/QiOFRgz.png",
                type: ITEM.money,
                name: "Tiền",
                quantity: 5000,
                isClaimed: true
            },
            {
                id: 5,
                requireTimedHours: 4,
                iconUrl: "https://i.imgur.com/QiOFRgz.png",
                type: ITEM.money,
                name: "Tiền",
                quantity: 10000,
                isClaimed: false
            },
            {
                id: 5,
                requireTimedHours: 5,
                iconUrl: "https://i.imgur.com/QiOFRgz.png",
                type: ITEM.money,
                name: "Tiền",
                quantity: 15000,
                isClaimed: false
            },
            {
                id: 5,
                requireTimedHours: 6,
                iconUrl: "https://i.imgur.com/gtxUdnG.png",
                type: ITEM.voucher,
                name: "Thẻ khuyến mại",
                quantity: 1,
                isClaimed: true
            },
            {
                id: 5,
                requireTimedHours: 7,
                iconUrl: "https://i.imgur.com/XFXAaIM.png",
                type: ITEM.luckyWheel,
                name: "Thẻ khuyến mại",
                quantity: 2,
                isClaimed: false
            },
            {
                id: 5,
                requireTimedHours: 8,
                iconUrl: "https://i.imgur.com/gtxUdnG.png",
                type: "luckyWheel",
                name: "Thẻ khuyến mại",
                quantity: 1,
                isClaimed: false
            }, {
                id: 5,
                requireTimedHours: 9,
                iconUrl: "https://i.imgur.com/XFXAaIM.png",
                type: ITEM.luckyWheel,
                name: "Thẻ khuyến mại",
                quantity: 1,
                isClaimed: false
            },
            {
                id: 5,
                requireTimedHours: 10,
                iconUrl: "https://i.imgur.com/gtxUdnG.png",
                type: "luckyWheel",
                name: "Thẻ khuyến mại",
                quantity: 1,
                isClaimed: false
            },
            {
                id: 5,
                requireTimedHours: 11,
                iconUrl: "https://i.imgur.com/gtxUdnG.png",
                type: "luckyWheel",
                name: "Thẻ khuyến mại",
                quantity: 1,
                isClaimed: false
            },
            {
                id: 5,
                requireTimedHours: 12,
                iconUrl: "https://i.imgur.com/gtxUdnG.png",
                type: "luckyWheel",
                name: "Thẻ khuyến mại",
                quantity: 1,
                isClaimed: false
            }
        ],
        userTimedHours: 8.2
    }

    const scrollManagement = useSelector(selectScrollableManagement);

    return (
        <div id={styles.root}>
            <div className={styles.leftContent} >
                <img src={PresentGif} className={styles.presentGif} />
                <span className={styles.numberOfPlayedHoursText}>Số giờ chơi</span>
            </div>
            <Scrollable 
                allowScroll={scrollManagement.allowScrollOnRoadFrame}
                orientation="horizontal"
            >
                <div className={styles.mainContent}>
                    <GiftList gifts={data.gifts} userTimedHours={data.userTimedHours} widthItem={widthItem} />
                    <RoadBar gifts={data.gifts} userTimedHours={data.userTimedHours} widthItem={widthItem} />
                    <HourNumber gifts={data.gifts} userTimedHours={data.userTimedHours} widthItem={widthItem} />
                </div>
            </Scrollable>
        </div>
    );
}

export default Road;