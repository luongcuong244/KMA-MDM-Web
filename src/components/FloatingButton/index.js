import React from "react";
import styles from "./floating_button.module.scss";

const FloatingButton = ({ 
    onClick, 
    text, 
    style = {},
    startColor = "#98F345", 
    endColor = "#69D33F", 
    colorLayer1 = "#2B8D07",  
    colorLayer2 = "#E2FF8B",
}) => {
    return (
        <div className={styles.floatingButtonLayer} onClick={onClick} style={style}>
            <div className={styles.floatingButtonLayer1} style={{ backgroundColor: colorLayer1 }} />
            <div className={styles.floatingButtonLayer2} style={{ backgroundColor: colorLayer2 }} />
            <div className={styles.floatingButtonLayer3} style={{ background: `linear-gradient(45deg, ${startColor}, ${endColor})` }} />
            <span className={styles.buttonStyle}>{text}</span>
        </div>
    );
}

export default FloatingButton;