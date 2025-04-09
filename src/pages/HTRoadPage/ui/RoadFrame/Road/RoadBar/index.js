import React, { useRef, useEffect } from "react";
import styles from "./road_bar.module.scss";

const BarItem = ({ widthItem, index, percentProgress }) => {

    const progressLayer = useRef(null);

    useEffect(
        () => {
            if (progressLayer.current) {
                // reduce 50% of the width of the progress layer
                progressLayer.current.style.width = `${percentProgress}%`;
            }
        },
        [progressLayer.current]
    );

    return (
        <li key={index} className={styles.item} style={{ width: widthItem }}>
            <div className={styles.staticLayer} />
            <div style={{width: "0%"}} ref={progressLayer} className={styles.progressLayer} />
        </li>
    );

}

const RoadBar = ({ gifts, userTimedHours, widthItem }) => {
    return (
        <ul className={styles.list}>
            {
                gifts.map(
                    (gift, index) => {

                        let percentProgress = 0;
                        if (userTimedHours >= gift.requireTimedHours) {
                            percentProgress = 100;
                        }
                        else if (index === 0 && userTimedHours > 0) {
                            percentProgress = Math.min(Math.round(userTimedHours / gift.requireTimedHours * 100), 100);
                        } else if (index > 0){
                            const deltaBetweenPreviousAndCurrent = gift.requireTimedHours - gifts[index - 1].requireTimedHours;
                            const deltaBetweenPreviousAndUser = userTimedHours - gifts[index - 1].requireTimedHours;
                            if (deltaBetweenPreviousAndUser > 0) {
                                percentProgress = Math.min(Math.round(deltaBetweenPreviousAndUser / deltaBetweenPreviousAndCurrent * 100), 100);
                            }
                        }

                        console.log(percentProgress);
                        return <BarItem index={index} percentProgress={percentProgress} widthItem={widthItem} />
                    }
                )
            }
        </ul>
    );
}

export default RoadBar;