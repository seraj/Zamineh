import React from 'react'
import styles from './inputs.scss'

export const Checkbox = ({ id, label, onChange = null, checked = false }) => {
    return (
        <React.Fragment>
            <div class={`${styles.checkbox} checkbox`}>
                <input type="checkbox" id={id} onChange={onChange} checked={checked} />
                <label for={id}></label>
            </div>
            {label && <label for={id}>{label}</label>}
        </React.Fragment>
    )
}