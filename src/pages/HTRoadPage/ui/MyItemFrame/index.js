import React, { useState, useRef, useEffect } from "react";
import styles from "./my_item_frame.module.scss";
import QuestionMark from "../../../../assets/imgs/question_mark.png";
import ITEM from "../../../../enums/item.enum";
import ItemRow from "./ItemRow";
import Scrollable from "../../../../components/Scrollable";
import { selectScrollableManagement } from "../../../../slices/scrollable_management.slice";
import { useSelector } from "react-redux";

const MyItemFrame = () => {

    var items = [
        {
            id: 1,
            iconUrl: "https://i.imgur.com/gtxUdnG.png",
            name: "Thẻ khuyến mại",
            description: "Khuyến mại x1.5 cho lần nạp từ 0 VNĐ",
            quantity: 1,
            type: ITEM.voucher,
            attribute: {
                maxDiscount: 100000,
                minDeposit: 0,
                discountRate: 1.5
            }
        },
        {
            id: 1,
            iconUrl: "https://i.imgur.com/gtxUdnG.png",
            name: "Thẻ khuyến mại",
            description: "Khuyến mại x1.5 cho lần nạp từ 0 VNĐ",
            quantity: 1,
            type: ITEM.voucher,
            attribute: {
                maxDiscount: 100000,
                minDeposit: 0,
                discountRate: 1.5
            }
        },
        {
            id: 1,
            iconUrl: "https://i.imgur.com/gtxUdnG.png",
            name: "Thẻ khuyến mại",
            description: "Khuyến mại x1.5 cho lần nạp từ 0 VNĐ",
            quantity: 1,
            type: ITEM.voucher,
            attribute: {
                maxDiscount: 100000,
                minDeposit: 0,
                discountRate: 1.5
            }
        },
        {
            id: 2,
            iconUrl: "https://i.imgur.com/XFXAaIM.png",
            name: "Vòng quay may mắn",
            description: "Hãy thử vận may của bạn",
            quantity: 3,
            type: ITEM.luckyWheel,
        },
        {
            id: 2,
            iconUrl: "https://i.imgur.com/XFXAaIM.png",
            name: "Vòng quay may mắn",
            description: "Hãy thử vận may của bạn",
            quantity: 3,
            type: ITEM.luckyWheel,
        },
        {
            id: 2,
            iconUrl: "https://i.imgur.com/XFXAaIM.png",
            name: "Vòng quay may mắn",
            description: "Hãy thử vận may của bạn",
            quantity: 3,
            type: ITEM.luckyWheel,
        },
        {
            id: 2,
            iconUrl: "https://i.imgur.com/XFXAaIM.png",
            name: "Vòng quay may mắn",
            description: "Hãy thử vận may của bạn",
            quantity: 3,
            type: ITEM.luckyWheel,
        },
        {
            id: 2,
            iconUrl: "https://i.imgur.com/XFXAaIM.png",
            name: "Vòng quay may mắn",
            description: "Hãy thử vận may của bạn",
            quantity: 3,
            type: ITEM.luckyWheel,
        },
        {
            id: 2,
            iconUrl: "https://i.imgur.com/XFXAaIM.png",
            name: "Vòng quay may mắn",
            description: "Hãy thử vận may của bạn",
            quantity: 3,
            type: ITEM.luckyWheel,
        },
        {
            id: 2,
            iconUrl: "https://i.imgur.com/XFXAaIM.png",
            name: "Vòng quay may mắn",
            description: "Hãy thử vận may của bạn",
            quantity: 3,
            type: ITEM.luckyWheel,
        },
        {
            id: 2,
            iconUrl: "https://i.imgur.com/XFXAaIM.png",
            name: "Vòng quay may mắn",
            description: "Hãy thử vận may của bạn",
            quantity: 3,
            type: ITEM.luckyWheel,
        },
        {
            id: 2,
            iconUrl: "https://i.imgur.com/XFXAaIM.png",
            name: "Vòng quay may mắn",
            description: "Hãy thử vận may của bạn",
            quantity: 3,
            type: ITEM.luckyWheel,
        },
        {
            id: 2,
            iconUrl: "https://i.imgur.com/XFXAaIM.png",
            name: "Vòng quay may mắn",
            description: "Hãy thử vận may của bạn",
            quantity: 3,
            type: ITEM.luckyWheel,
        },
        {
            id: 2,
            iconUrl: "https://i.imgur.com/XFXAaIM.png",
            name: "Vòng quay may mắn",
            description: "Hãy thử vận may của bạn",
            quantity: 3,
            type: ITEM.luckyWheel,
        },
        {
            id: 2,
            iconUrl: "https://i.imgur.com/XFXAaIM.png",
            name: "Vòng quay may mắn",
            description: "Hãy thử vận may của bạn",
            quantity: 3,
            type: ITEM.luckyWheel,
        },
        {
            id: 2,
            iconUrl: "https://i.imgur.com/XFXAaIM.png",
            name: "Vòng quay may mắn",
            description: "Hãy thử vận may của bạn",
            quantity: 3,
            type: ITEM.luckyWheel,
        },
        {
            id: 2,
            iconUrl: "https://i.imgur.com/XFXAaIM.png",
            name: "Vòng quay may mắn",
            description: "Hãy thử vận may của bạn",
            quantity: 3,
            type: ITEM.luckyWheel,
        },
        {
            id: 2,
            iconUrl: "https://i.imgur.com/XFXAaIM.png",
            name: "Vòng quay may mắn",
            description: "Hãy thử vận may của bạn",
            quantity: 3,
            type: ITEM.luckyWheel,
        },
        {
            id: 2,
            iconUrl: "https://i.imgur.com/XFXAaIM.png",
            name: "Vòng quay may mắn",
            description: "Hãy thử vận may của bạn",
            quantity: 3,
            type: ITEM.luckyWheel,
        },
        {
            id: 2,
            iconUrl: "https://i.imgur.com/XFXAaIM.png",
            name: "Vòng quay may mắn",
            description: "Hãy thử vận may của bạn",
            quantity: 3,
            type: ITEM.luckyWheel,
        },
        {
            id: 2,
            iconUrl: "https://i.imgur.com/XFXAaIM.png",
            name: "Vòng quay may mắn",
            description: "Hãy thử vận may của bạn",
            quantity: 3,
            type: ITEM.luckyWheel,
        }
    ]

    const scrollManagement = useSelector(selectScrollableManagement);
    
    console.log(scrollManagement);

    return (
        <div id={styles.root}>
            <div className={styles.header}>
                <span className={styles.title}>
                    Vật phẩm
                </span>
                <img
                    className={styles.question_mark}
                    src={QuestionMark}
                    alt="Question Mark"
                />
            </div>

            <Scrollable
                allowScroll={scrollManagement.allowScrollOnMyItems}
            >
                <ul className={styles.item_list}>
                    {items.map((item, index) => {
                        return (
                            <li key={index}>
                                <ItemRow item={item} />
                            </li>
                        );
                    })}
                </ul>
            </Scrollable>
        </div>
    );
}

export default MyItemFrame;