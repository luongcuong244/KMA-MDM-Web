import React from "react";
import styles from "./gift_list.module.scss";
import GiftItem from "./GiftItem";

const GiftList = ({ gifts, userTimedHours, widthItem }) => {
    return (
        <ul className={styles.list} >
            {
                gifts.map(
                    (gift, index) => {
                        return (
                            <GiftItem 
                                key={index} 
                                index={index} 
                                gift={gift} 
                                userTimedHours={userTimedHours}
                                widthItem={widthItem}
                            />
                        )
                    }
                )
            }
        </ul>
    );
}

export default GiftList;