import DefaultStyle from '../../static/scss/_boxStyle.scss'
import React from 'react';

export const FollowButton = (props) => {
    return (
        <button
            className={`${DefaultStyle.followBtn} ${props.is_flw ? 'following' : ''}`}
            onClick={
                props.handleLogin ?
                    props.onClick
                    :
                    props.loginModal
            }
        >
        </button>
    );
}