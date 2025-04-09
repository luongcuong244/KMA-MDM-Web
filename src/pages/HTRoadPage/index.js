import React from "react";
import styles from "./ht_road.module.scss";
import BackgroundImage from "../../assets/imgs/bg_home.jpg";
import AppBar from "./ui/AppBar";
import RoadFrame from "./ui/RoadFrame";
import MyItemFrame from "./ui/MyItemFrame";
import WithdrawMoneyFrame from "./ui/WithdrawMoneyFrame";
import TopupRequestPendingFrame from "./ui/TopupRequestPendingFrame";

const HTRoadPage = () => {
    return (
        <div id={styles.root}>
            <img 
                src={BackgroundImage} 
                alt="background" 
                className={styles.background_image}
                draggable={false}
            />

            <div id={styles.content}>
                <AppBar />
                <RoadFrame />

                <div className={styles.bottomLayouts}>
                    <MyItemFrame />
                    <WithdrawMoneyFrame />
                    <TopupRequestPendingFrame />
                </div>
            </div>
        </div>
    );
}

export default HTRoadPage;