import React from "react";

import styles from "./Section.scss"

export default function Section({ ExtraClass = '', ...props }) {
    return <section className={`${styles.section} ${ExtraClass}`} {...props} />;
}