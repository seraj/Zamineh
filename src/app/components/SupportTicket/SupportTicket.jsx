import React, { useState, useEffect } from "react";
import moment from 'moment-jalaali';
import Urls from '../Urls'

import { Img } from '../General';
import NumbersConvertor from '../NumbersConvertor';
import ThousandSeparator from '../ThousandSeparator';
import styles from './SupportTicket.scss'

export default function SupportTicket({ item }) {
    const [More, setMore] = useState(false)
    const onMoreClick = () => {
        if (More === false) { setMore(true) }
        else (setMore(false))

    }
    return (
        <div className={`${styles.ticket} ${item.is_handled ? 'closed' : ''}`}>
            <h2>درخواست <div className='serial'><span>{item.serial}</span></div></h2>
            <ul className='list'>
                <li>
                    <i className='zicon icon-29'></i>
                    عنوان درخواست :‌ <span>{item.title}</span>
                </li>
                <li>
                    <i className='zicon icon-29'></i>
                    نوع درخواست :‌ <span>{item.type}</span>
                </li>
                <li>
                    <i className='zicon icon-29'></i>
                    زمان ثبت درخواست :‌ <span>{NumbersConvertor().convertToPersian(moment(item.date, 'YYYY-MM-DD').format('jDD jMMMM jYYYY'))} ساعت {NumbersConvertor().convertToPersian(item.time)}</span>
                </li>
                <li>
                    <i className='zicon icon-29'></i>
                    متن درخواست :‌ <span>{item.context}</span>
                </li>
                <hr />
                <li>
                    <i className='zicon icon-52'></i>
                    پاسخ : <span>{item.response}</span>
                </li>
            </ul>
        </div>
    )
}


