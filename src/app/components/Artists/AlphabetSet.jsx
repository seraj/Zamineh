import React from "react";
import { Link } from "react-router-dom";
import Urls from "../Urls";

import styles from "./Artists.scss"

import { Alphabetical } from "../General";

export default function AlphabetSet({ word }) {
    return (
        <div className={styles.alphabetical}>
            <div className="label">
                جستجو در بین ۱۰۰۰ هنرمند
            </div>
            <div className="range">
                {Alphabetical && Alphabetical().map((item, index) => (
                    <a
                        className={item.name == word ? 'current' : ''}
                        key={index}
                        href={`${Urls().artists()}${item.name}`}
                    >
                        {item.name}
                    </a>
                ))}
            </div>
        </div>

    )
}