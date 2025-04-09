import React from "react";
import styles from "./road_frame.module.scss";
import QuestionMark from "../../../../assets/imgs/question_mark.png";
import TitleBackground from "../../../../assets/imgs/title_background.png";
import Road from "./Road";
import TimeRemaining from "./TimeRemaining";

const RoadFrame = () => {
    return (
        <div id={styles.root}>
            <img
                className={styles.question_mark}
                src={QuestionMark}
                alt="Question Mark"
            />

            <div className={styles.title}>
                <img
                    className={styles.titleBackground}
                    src={TitleBackground}
                />
                <span className={styles.titleContent}>Quà tặng tháng 2</span>
            </div>
            
            <TimeRemaining timeRemainingInSeconds={15 * 24 * 60 * 60 + 20 * 60 * 60 + 15 * 60 + 20} />

            <div className={styles.road}>
                <Road />
            </div>
        </div>
    );
}

export default RoadFrame;