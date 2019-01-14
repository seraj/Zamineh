

import React from "react";
import { Link } from "react-router-dom";
import { IconArrowRight } from "./Icons";
import styles from './General.scss'
export function Alphabetical() {
    const AlphaBet = [
        {
            name: 'ا'
        },
        {
            name: 'ب'
        },
        {
            name: 'پ'
        },
        {
            name: 'ت'
        },
        {
            name: 'ث'
        },
        {
            name: 'ج'
        },
        {
            name: 'چ'
        },
        {
            name: 'ح'
        },
        {
            name: 'خ'
        },
        {
            name: 'د'
        },
        {
            name: 'ذ'
        },
        {
            name: 'ر'
        },
        {
            name: 'ز'
        },
        {
            name: 'ژ'
        },
        {
            name: 'س'
        },
        {
            name: 'ش'
        },
        {
            name: 'ص'
        },
        {
            name: 'ض'
        },
        {
            name: 'ط'
        },
        {
            name: 'ظ'
        },
        {
            name: 'ع'
        },
        {
            name: 'غ'
        },
        {
            name: 'ف'
        },
        {
            name: 'ق'
        },
        {
            name: 'ک'
        },
        {
            name: 'گ'
        },
        {
            name: 'ل'
        },
        {
            name: 'م'
        },
        {
            name: 'ن'
        },
        {
            name: 'و'
        },
        {
            name: 'ه'
        },
        {
            name: 'ی'
        },
    ];

    return AlphaBet;
}

export function LimitContent(content, limit) {
    const LimitedContent = content.substring(0, limit) + "...";
    return LimitedContent
}
export function Img({ img, alt, width, height, divHeight, style }) {
    return (
        <React.Fragment>
            {img ?
                <img src={img} alt={alt} width={width} height={height} />
                :
                <div
                    style={style ?
                        style :
                        { background: '#e0e0e0', width: '100%', height: divHeight ? divHeight : `100%` }
                    }
                />
            }
        </React.Fragment>
    )
}
export const BackLink = ({ Text, pageLink }) => {
    return (
        <Link
            to={pageLink}
            className={styles.backtoLink}
        >
            <i>
                <IconArrowRight
                    height="20px"
                    width="20px"
                    fill="transparent"
                    stroke="#333"
                />
            </i>
            بازگشت به صفحه {Text}

        </Link>
    )
}