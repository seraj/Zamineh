import React from "react";
import InputRange from 'react-input-range-rtl';
import NumbersConvertor from "../NumbersConvertor";
import ThousandSeparator from "../ThousandSeparator";
import 'react-input-range-rtl/lib/css/index.css'
import styles from "./Filters.scss"

export function Filters({ ExtraClass = '', ...props }) {
    return <div className={`${styles.Filtering} ${ExtraClass}`} {...props} />;
}
export function FilterBox({ name, title, ...props }) {
    return (
        <div className={`${styles.filterBox} ${name}`}>
            <span className="title">{title}</span>
            <div {...props} />
        </div>
    );
}
export function InputSlider({ max, min, unit, ...props }) {
    return (
        <div className={styles.inputSlider}>
            <div className="slide-values">
                <span className="min">{NumbersConvertor().convertToPersian(ThousandSeparator(min))} {unit}</span>
                <span className="max">{NumbersConvertor().convertToPersian(ThousandSeparator(max))} {unit}</span>
            </div>
            <div className="inputSlider">
                <InputRange
                    maxValue={props.maxValue}
                    minValue={props.minValue}
                    direction='rtl'
                    value={props.value}
                    onChange={value => props.handleSliderChange(value)}
                    onChangeComplete={value => props.handleSliderChange(value, true)}
                />
            </div>
        </div>
    );
}