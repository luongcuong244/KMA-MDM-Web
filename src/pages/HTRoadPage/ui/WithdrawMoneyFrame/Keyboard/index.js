import React from "react";
import styles from "./keyboard.module.scss";

const Keyboard = ({ onClick, disable }) => {
    return <div id={styles.root}>
        <div className={styles.wrapper}>
            <div className={styles.keys}>
                <input type="button" value={"1"} onClick={() => { onClick("1") }} disabled={disable} />
                <input type="button" value={"2"} onClick={() => { onClick("2") }} disabled={disable} />
                <input type="button" value={"3"} onClick={() => { onClick("3") }} disabled={disable} />
                <input type="button" value={"4"} onClick={() => { onClick("4") }} disabled={disable} />
                <input type="button" value={"5"} onClick={() => { onClick("5") }} disabled={disable} />
            </div>
            <div className={styles.keys}>
                <input type="button" value={"6"} onClick={() => { onClick("6") }} disabled={disable} />
                <input type="button" value={"7"} onClick={() => { onClick("7") }} disabled={disable} />
                <input type="button" value={"8"} onClick={() => { onClick("8") }} disabled={disable} />
                <input type="button" value={"9"} onClick={() => { onClick("9") }} disabled={disable} />
                <input type="button" value={"0"} onClick={() => { onClick("0") }} disabled={disable} />
                <input type="button" value={"C"} onClick={() => { onClick("C") }} disabled={disable} />
            </div>
        </div>
    </div>
}

export default Keyboard;