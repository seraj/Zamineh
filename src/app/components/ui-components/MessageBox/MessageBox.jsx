import React from "react"
import styles from "./MessageBox.scss"
import NumbersConvertor from '../../NumbersConvertor';


function Timer(seconds, afterTimeFinished) {

    var timer = setInterval(function () {
        if (seconds > 0) {
            seconds = seconds - 1;
            document.getElementById('timer').innerHTML = NumbersConvertor().convertToPersian(seconds);
        } else {
            clearInterval(timer);
            document.getElementById('timer').innerHTML = 'تیمام';
            afterTimeFinished ? afterTimeFinished() : null
        }

    }, 1000);
}

export default function MessageBox({ title, message, type, seconds, afterTimeFinished }) {
    Timer(seconds, afterTimeFinished)
    return (
        <div className={`${styles.type} ${type}`}>
            <h2>{title}</h2>
            <span>{message}</span>
            <div className={styles.timer} id="timer" />
        </div>
    )
}
