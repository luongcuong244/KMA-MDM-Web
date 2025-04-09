import React, { useState, forwardRef, useImperativeHandle } from "react";
import styles from "./wheel.module.scss";
import WheelNeedle from "../../../assets/imgs/wheel_needle.png";
import BackgroundLuckyWheelBottomLayer from "../../../assets/imgs/bg_lucky_wheel_1.png";
import BackgroundLuckyWheelRotatableLayer from "../../../assets/imgs/bg_lucky_wheel_2.png";
import Converter from "../../../utils/converter";
import CoinIcon from "../../../assets/imgs/img_one_coin.png";
import LuckyWheelReceiveGiftPopup from "../../LuckyWheelReceiveGiftPopup";

const Wheel = forwardRef(
    (props, ref) => {
        
        const wheelContent = [
            {
                name: "Tiền",
                quantity: 100,
                iconUrl: CoinIcon,
            },
            {
                name: "Tiền",
                quantity: 200,
                iconUrl: CoinIcon,
            },
            {
                name: "Tiền",
                quantity: 500,
                iconUrl: CoinIcon,
            },
            {
                name: "Tiền",
                quantity: 1000,
                iconUrl: CoinIcon,
            },
            {
                name: "Tiền",
                quantity: 5000,
                iconUrl: CoinIcon,
            },
            {
                name: "Tiền",
                quantity: 10000,
                iconUrl: CoinIcon,
            },
            {
                name: "Tiền",
                quantity: 20000,
                iconUrl: CoinIcon,
            },
            {
                name: "Tiền",
                quantity: 50000,
                iconUrl: CoinIcon,
            },
        ]

        const minLoops = 4;
        const spinDuration = 3000;

        const [showDialogReceiveGift, setShowDialogReceiveGift] = useState(false);
        const [gift, setGift] = useState(null);
        const [spinning, setSpinning] = useState(false);

        useImperativeHandle(ref, () => ({
            async spin () {
                if (spinning) {
                    console.log("Spinning already");
                    return;
                }

                setSpinning(true);

                const wheel = document.querySelector(`.${styles.wheel}`);

                wheel.style.transition = "none";

                setTimeout(() => {

                    const targetIndex = Math.floor(Math.random() * wheelContent.length);
                    console.log("Target index", targetIndex);

                    const finalDeg = targetIndex >= 0
                        ? Math.floor(360 * minLoops + (360 - targetIndex * 360 / wheelContent.length))
                        : 0;

                    wheel.style.transition = `all ${spinDuration / 1000}s ease-in-out`;
                    wheel.style.transform = `rotate(${finalDeg}deg)`;

                    setTimeout(() => {
                        wheel.style.transition = "none";
                        wheel.style.transform = `rotate(${finalDeg % 360}deg)`;
                        setSpinning(false);

                        setShowDialogReceiveGift(true);
                        setGift(wheelContent[targetIndex]);
                    }, spinDuration);

                }, 500);
            }
        }));

        return (
            <div className={styles.container}>
                <img 
                    src={BackgroundLuckyWheelBottomLayer} 
                    className={styles.backgroundLayer1}
                    draggable={false}
                />
                <img
                    src={WheelNeedle}
                    className={styles.wheelNeedle}
                    draggable={false} 
                />
                <div
                    style={{
                        "--seg": wheelContent.length
                    }}
                    className={styles.wheel}
                >
                    <img src={BackgroundLuckyWheelRotatableLayer} draggable="false" />
                    {
                        wheelContent.map((gift, i) => (
                            <div
                                key={i}
                                className={styles.number}
                                style={{
                                    "--i": i,
                                    "--seg": wheelContent.length
                                }}
                            >
                                <span
                                    style={{
                                        "--seg": wheelContent.length
                                    }}
                                >
                                    {Converter.formatCurrency(gift.quantity)}
                                    <img src={CoinIcon} />
                                </span>
                            </div>
                        ))
                    }
                </div>

                {
                    showDialogReceiveGift && gift &&
                    <LuckyWheelReceiveGiftPopup
                        gift={gift}
                        setShowDialog={setShowDialogReceiveGift}
                    />
                }
            </div>
        );
    }
)

export default Wheel;