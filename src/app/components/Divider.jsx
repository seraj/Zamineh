import React from "react";

export default function Divider({ type = 'sv-divider-horizontal', orientation = '', text = '' }) {
    return (<div
        className={`
        sv-divider ${type} 
        ${text ? `sv-divider-with-text${(orientation != `` ? `-${orientation}` : ``)}` : ``}`}
        orientation={orientation} >
        {text && <span className="sv-divider-inner-text">{text}</span>}
    </div>)
}