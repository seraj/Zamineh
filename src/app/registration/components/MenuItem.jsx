import PropTypes from 'prop-types';
import React from 'react';

const MenuItem = ({ user }) => (
    <div>
        <img
            alt={user.name}
            src={user.avatar}
            style={{
                height: '24px',
                marginRight: '10px',
                width: '24px',
            }}
        />
        <span>{user.name}</span>
    </div>
);


export default MenuItem;