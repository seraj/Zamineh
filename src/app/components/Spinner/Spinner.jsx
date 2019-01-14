import React from 'react';
import styles from './Spinner.scss';

const SPINNER_SIZES = {
    small: 30,
    medium: 50,
    large: 70,
};

const STROKE_WIDTHS = {
    small: 4,
    medium: 5,
    large: 6,
};

const PATH_CLASS_NAMES = {
    small: styles.SmallSpinnerPath,
    medium: styles.MediumSpinnerPath,
    large: styles.LargeSpinnerPath,
};

// Heavily inspired by https://codepen.io/mrrocks/pen/EiplA
export function Spinner({ size = 'small', ...props }) {
    const baseSize = SPINNER_SIZES[size];
    const pathSize = baseSize / 2;
    const strokeWidth = STROKE_WIDTHS[size];
    const pathRadius = `${baseSize / 2 - strokeWidth}px`;
    const className = PATH_CLASS_NAMES[size];
    const containerClassName = `${styles.SpinnerContainer} ${styles.SpinnerContainer}-${size} ${
        props.className
        }`;

    return (
        <div className={containerClassName}>
            <svg
                className={className}
                width={baseSize}
                height={baseSize}
                viewBox={`0 0 ${baseSize} ${baseSize}`}
            >
                <circle
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    cx={pathSize}
                    cy={pathSize}
                    r={pathRadius}
                />
            </svg>
        </div>
    );
}
export function Loading({ text = 'لطفا صبر کنید', background = "#00000026" }) {
    return (
        <div className={styles.loadingAnimation} style={{ background: background }}>
            <div className={styles.center}>
                <span className="loader">
                    <span className="loader-inner">
                    </span>
                </span>
                <span className="text">{text}</span>
            </div>
        </div>
    )
}
