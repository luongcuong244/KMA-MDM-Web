import React from "react";
import styles from "./alert_error.module.scss";
import { PiWarningCircleBold } from "react-icons/pi";

const AlertError = ({
  text,
  style = {},
  showIcon = true,
  iconSize = 20,
  iconColor = "white",
  textSize = "0.9rem",
  textPadding
}) => {
  return (
    <div className={styles.warningBox} style={style}>
      {
        showIcon && <PiWarningCircleBold size={iconSize} color={iconColor} />
      }
      <p className={styles.warningText} style={{ fontSize: textSize}}>{text}</p>
    </div>
  );
};

export default AlertError;
