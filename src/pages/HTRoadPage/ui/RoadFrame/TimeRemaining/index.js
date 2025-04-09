import React, { useState, useEffect } from "react";
import styles from "./time_remaining.module.scss";

const TimeRemaining = ({ timeRemainingInSeconds }) => {

    // in seconds
    const [timeRemaining, setTimeRemaining] = useState(-1);

    useEffect(() => {
        setTimeRemaining(timeRemainingInSeconds);
        const intervalId = setInterval(() => {
            setTimeRemaining(prevTimeRemaining => prevTimeRemaining - 1);
        }, 1000);

        return () => {
            clearInterval(intervalId);
        }
    }, []);

    const formatTime = (seconds) => {

        let days = Math.floor(seconds / (24 * 60 * 60)).toString();
        let hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60)).toString();
        let minutes = Math.floor((seconds % (60 * 60)) / 60).toString();
        let remainingSeconds = (seconds % 60).toString();

        if (days.length === 1) {
            days = `0${days}`;
        }

        if (hours.length === 1) {
            hours = `0${hours}`;
        }

        if (minutes.length === 1) {
            minutes = `0${minutes}`;
        }

        if (remainingSeconds.length === 1) {
            remainingSeconds = `0${remainingSeconds}`;
        }

        return `${days}d : ${hours}h : ${minutes}p : ${remainingSeconds}`;
    }

    return (
        <div className={styles.timeRemaining}>{timeRemaining > 0 ? formatTime(timeRemaining) : "..."}</div>
    )
};

export default TimeRemaining;