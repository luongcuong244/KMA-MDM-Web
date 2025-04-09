import React, { useEffect, useState } from "react";
import styles from "./gift_item.module.scss";
import CardLock from "../../../../../../../assets/imgs/card_lock.png";
import ClaimBanner from "../../../../../../../assets/imgs/claim_banner.png";
import ITEM from "../../../../../../../enums/item.enum";
import Converter from "../../../../../../../utils/converter";
import clsx from "clsx";
import RingHighlight from "../../../../../../../assets/imgs/ring_highlight.png";
import ReceiverGiftDialog from "../ReceiverGiftDialog";
import { setAllowScrollOnRoadFrame } from "../../../../../../../slices/scrollable_management.slice";
import { useDispatch } from "react-redux";

const GiftItem = ({ gift, userTimedHours, index, widthItem }) => {

    const dispatch = useDispatch();

    const [showReceiverGiftDialog, setShowReceiverGiftDialog] = useState(false);

    useEffect(() => {
        // Prevent scrolling on road frame when receiver gift dialog is shown
        dispatch(setAllowScrollOnRoadFrame(!showReceiverGiftDialog));
    }, [showReceiverGiftDialog]);

    const isReached = userTimedHours >= gift.requireTimedHours;
    const isReachedButNotClaimed = isReached && !gift.isClaimed;

    let quantityText = `x${gift.quantity}`;
    if (gift.type == ITEM.money) {
        quantityText = Converter.formatCurrency(gift.quantity);
    }

    const claimGift = () => {
        if (isReachedButNotClaimed) {
            setShowReceiverGiftDialog(true);
        }
    }

    return (
        <li key={index} className={styles.item} style={{ width: widthItem }}>
            {
                isReachedButNotClaimed &&
                <img src={RingHighlight} className={styles.ringHighlight} draggable={false} />
            }
            <div
                className={
                    clsx([
                        styles.box,
                        isReachedButNotClaimed && styles.notClaimedBox
                    ])
                }
                onClick={claimGift}
            >
                <div
                    className={
                        clsx([
                            styles.itemBackground,
                            isReachedButNotClaimed && styles.notClaimedItemBackground
                        ])
                    }
                />
                {
                    !isReached &&
                    <img src={CardLock} className={styles.cardLock} draggable={false} />
                }
                <span
                    className={
                        clsx([
                            styles.itemQuantity,
                            isReachedButNotClaimed && styles.notClaimedItemQuantity
                        ])
                    }
                >{quantityText}</span>
                <img src={gift.iconUrl} className={styles.itemIcon} draggable={false} />
                {
                    isReached && gift.isClaimed &&
                    <img src={ClaimBanner} className={styles.claimBanner} draggable={false} />
                }
                {
                    showReceiverGiftDialog && 
                    <ReceiverGiftDialog 
                        gift={gift} 
                        setShowDialog={setShowReceiverGiftDialog} />
                }
            </div>
        </li>
    );
}

export default GiftItem;