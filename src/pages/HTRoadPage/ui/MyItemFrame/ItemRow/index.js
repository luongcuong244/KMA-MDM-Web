import React, { useRef, useState, useEffect } from "react";
import styles from "./item_row.module.scss";
import TrapezoidShape from "../../../../../assets/imgs/trapezoid_shape.png";
import ItemBackground from "../../../../../assets/imgs/item_background.png";
import ITEM from "../../../../../enums/item.enum";
import LuckyWheelPopup from "../../../../../parts/LuckyWheelPopup";
import { useDispatch } from "react-redux";
import { setAllowScrollOnMyItems } from "../../../../../slices/scrollable_management.slice";

const ItemRow = ({ item }) => {

    const dispatch = useDispatch();

    // state for lucky wheel item
    const [showLuckWheelPopup, setShowLuckWheelPopup] = useState(false);

    useEffect(() => {
        // disable scroll on my items when lucky wheel popup is shown
        dispatch(setAllowScrollOnMyItems(!showLuckWheelPopup));
    }, [showLuckWheelPopup]);

    const textRef = useRef(null);
    const [isTextOverflowed, setIsTextOverflowed] = useState(false);

    useEffect(() => {
        checkTextOverflow();
    }, [textRef.current]);

    const checkTextOverflow = () => {
        if (textRef.current.scrollHeight > textRef.current.clientHeight) {
            setIsTextOverflowed(true);
        }
    }

    const useItem = () => {
        if (item.type === ITEM.luckyWheel) {
            setShowLuckWheelPopup(true);
        } else {
            alert("Use item: " + item.name);
        }
    }

    return (
        <div id={styles.root}>
            <div className={styles.layer1} />
            <div className={styles.layer2} />

            <div className={styles.itemImageContainer}>
                <img src={ItemBackground} className={styles.itemBackground} draggable={false} />
                <img src={item.iconUrl} className={styles.itemImage} draggable={false} />
            </div>

            <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.name}</span>
                <div 
                    ref={textRef}
                    className={styles.itemDescription}
                >
                    {
                        isTextOverflowed ?
                            (
                                <marquee scrollamount="3">
                                    {item.description}
                                </marquee>
                            )
                        : item.description
                    }
                </div>
            </div>

            <span className={styles.itemQuantity}>x{item.quantity}</span>

            <div className = {styles.useButtonContainer}>
                <img src={TrapezoidShape} className={styles.trapezoidImage} draggable={false} />
                <div className={styles.useButtonLayer} onClick={useItem}>
                    <div className={styles.useButtonLayer1} />
                    <div className={styles.useButtonLayer2} />
                    <div className={styles.useButtonLayer3} />
                    <span className={styles.useButton}>Sử dụng</span>
                </div>
            </div>

            {
                showLuckWheelPopup && 
                <LuckyWheelPopup setShowDialog={setShowLuckWheelPopup} />
            }
        </div>
    );
}

export default ItemRow;