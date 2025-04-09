import React, { useEffect, useState } from "react";
import styles from "./lucky_wheel_receive_gift.module.scss";
import Popup from "reactjs-popup";
import FloatingButton from "../../components/FloatingButton";
import DuckMoney from "../../assets/imgs/duck_money.gif";
import Converter from "../../utils/converter";
import clsx from "clsx";

const LuckyWheelReceiveGiftPopup = ({ gift, setShowDialog }) => {

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true);
        }, 100);
    }, []);

    const closeDialog = () => {
        setShowDialog(false);
    }

    return (
        <Popup
            modal
            open
            overlayStyle={{ 
                background: "rgba(0,0,0,0.7)", 
                transition: "all 0.3s ease-in-out",
                opacity: isVisible ? 1 : 0,
            }}
            onClose={closeDialog}
            closeOnDocumentClick={false}
        >
            <div className={clsx([styles.container, isVisible && styles.visible])}>
                <div className={styles.claimedContainer}>
                    <label className={styles.claimedText}>Nhận quà</label>
                    <img src={DuckMoney} className={styles.gift} draggable={false} />
                    <label className={styles.giftName}>{gift.name}</label>
                    <label className={styles.giftQuantity}>x {Converter.formatCurrency(gift.quantity)}</label>
                    <div className={styles.closeButton}>
                        <FloatingButton
                            onClick={() => {
                                setShowDialog(false);
                            }}
                            text={"Đóng"}
                            startColor="#31D9FD"
                            endColor="#30A7F6"
                            colorLayer1="#2F67B4"
                            colorLayer2="#91FCFF"
                        />
                    </div>
                </div>
            </div>
        </Popup>
    );
}

export default LuckyWheelReceiveGiftPopup;