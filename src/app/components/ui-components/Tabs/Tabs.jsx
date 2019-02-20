import React from "react";
import { Link } from 'react-router-dom';

import Urls from '../../Urls'

import styles from './Tabs.scss'

export const LinearTabs = ({ tabs, slug }) => {
    const url = window.location.href;
    return (
        <nav className={styles.LinearTabs}>
            {tabs && tabs.map((tab, index) => (
                <>
                    <Link
                        key={index}
                        to={`${slug}${tab.value}`}
                        className={url.includes(tab.value) ? 'active' : ''}
                    >{tab.title}</Link>
                </>
            ))}
        </nav>
    )
}

export const Tabs = ({ tabs, slug }) => {
    const url = window.location.href;
    return (
        <nav className={styles.tabs}>
            {tabs && tabs.map((tab, index) => (
                <>
                    <Link
                        key={index}
                        to={`${slug}${tab.value}`}
                        className={url.includes(tab.value) ? 'active' : ''}
                    >{tab.title}</Link>
                    <div className={styles.separator} />
                </>
            ))}
        </nav>
    )
}