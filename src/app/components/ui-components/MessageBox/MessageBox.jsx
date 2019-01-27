import React from 'react'
import styles from './MessageBox.scss'
import NumbersConvertor from '../../NumbersConvertor';


function Timer(seconds, afterTimeFinished) {

    var timer = setInterval(function () {
        if (seconds > 0) {
            seconds = seconds - 1;
            document.getElementById('timer').innerHTML = NumbersConvertor().convertToPersian(seconds);
        } else {
            clearInterval(timer);
            document.getElementById('timer').innerHTML = '...';
            afterTimeFinished ? afterTimeFinished() : null
        }

    }, 1000);
}

export default function MessageBox({
    type,
    title,
    message,
    seconds,
    buttonText,
    afterTimeFinished
}) {
    { seconds ? Timer(seconds, afterTimeFinished) : null }
    return (
        <div className={`${styles.type} ${type}`}>
            <h2>{title}</h2>
            <span>{message}</span>
            {!buttonText && seconds &&
                <div className={styles.timer} id='timer' />
            }
            {buttonText &&
                <button
                    onClick={() => afterTimeFinished()}
                    style={{ width: '100%' }}
                    className={` zbtn next ${styles.button} ${type} bradius`}
                >{buttonText}

                    {seconds ? <i className={styles.timer} id='timer' /> : ''}
                </button>
            }
        </div>
    )
}
