import React, { useRef } from "react";
import styles from "./lucky_wheel_popup.module.scss";
import Popup from "reactjs-popup";
import Wheel from "./Wheel";
import FloatingButton from "../../components/FloatingButton";
import StageLightBackground from "../../assets/imgs/bg_lucky_wheel_stage_light.png";

const LuckyWheelPopup = ({ setShowDialog }) => {

    const wheelRef = useRef();

    const closeDialog = () => {
        setShowDialog(false);
    }

    const spin = () => {
        console.log(wheelRef.current);
        wheelRef.current?.spin();
    }

    return (
        <Popup
            modal
            open
            overlayStyle={{ background: "rgba(0,0,0,0.85)" }}
            onClose={closeDialog}
            closeOnDocumentClick={false}
        >
            <div className={styles.container}>
                <img src={StageLightBackground} className={styles.stageLightBackground} draggable="false" />
                <div className={styles.remainingTimes}>
                    <span>Lượt quay: 5</span>
                </div>
                <Wheel ref={wheelRef} />
                <span className={styles.buttons}>
                    <FloatingButton
                        onClick={closeDialog}
                        text={"Đóng"}
                        startColor="#ACACAC"
                        endColor="#969696"
                        colorLayer1="#656565"
                        colorLayer2="#D4D3D3"
                    />
                    <FloatingButton
                        onClick={spin}
                        text={"Quay"}
                        startColor="#31D9FD"
                        endColor="#30A7F6"
                        colorLayer1="#2F67B4"
                        colorLayer2="#91FCFF"
                    />
                </span>
            </div>
        </Popup>
    );
}

export default LuckyWheelPopup;