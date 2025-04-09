import React from "react";
import styles from "./hour_number.module.scss";

const HourNumber = ({ gifts, userTimedHours, widthItem }) => {
    return (
        <ul className={styles.list} >
            {
                gifts.map(
                    (gift, index) => {

                        const isReached = userTimedHours >= gift.requireTimedHours;
                        
                        return (
                            <li key={index} className={styles.item} style={{ width: widthItem }}>
                                <span 
                                    className={styles.hourNumber}
                                    style={{ 
                                        backgroundColor: isReached ? "#FE923B" : "#0E3653",
                                        //color: isReached ? "#8C5529" : "#ffffff"
                                    }}
                                >{gift.requireTimedHours}</span>
                            </li>
                        )
                    }
                )
            }
        </ul>
    );
}

export default HourNumber;