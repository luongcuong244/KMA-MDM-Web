import React, { useEffect, useState } from "react";
import styles from "./receiver_gift_dialog.module.scss";
import Popup from "reactjs-popup";
import Loader from "../../../../../../../components/Loader";
import RingHighlight from "../../../../../../../assets/imgs/ring_highlight.png";
import FloatingButton from "../../../../../../../components/FloatingButton";

const ReceiverGiftDialog = ({ gift, setShowDialog }) => {

    const [waitingForClaim, setWaitingForClaim] = useState(true);

    useEffect(() => {
        // call api to claim gift
        setTimeout(() => {
            setWaitingForClaim(false);
        }, 500);
    }, []);

    const closeDialog = () => {
        setShowDialog(false);
    }

    return (
        <Popup
            modal
            open
            overlayStyle={{ background: "rgba(0,0,0,0.8)" }}
            onClose={closeDialog}
            closeOnDocumentClick={false}
        >
            <div className={styles.container}>
                {
                    waitingForClaim &&
                    <div className={styles.loading}>
                        <Loader color="white" />
                    </div>
                }
                {
                    !waitingForClaim &&
                    <div className={styles.claimedContainer}>
                        <label className={styles.claimedText}>Nhận quà</label>
                        <label className={styles.giftName}>{gift.name}</label>
                        <label className={styles.giftQuantity}>x{gift.quantity}</label>
                        <FloatingButton 
                            onClick={() => {
                                setShowDialog(false);
                            }}
                            text={"Đóng"}
                            style={{
                                position: "absolute",
                                bottom: "-5%",
                                left: 0,
                                right: 0,
                                margin: "auto",
                            }}
                            startColor="#31D9FD"
                            endColor="#30A7F6"
                            colorLayer1="#2F67B4"
                            colorLayer2="#91FCFF"
                        />
                    </div>
                }
                {
                    !waitingForClaim &&
                    <>
                        <img src={RingHighlight} className={styles.ringHighlight} draggable={false} />
                        <img src={gift.iconUrl} className={styles.giftIcon} draggable={false} />
                    </>
                }
            </div>
        </Popup>
    );
}

export default ReceiverGiftDialog;