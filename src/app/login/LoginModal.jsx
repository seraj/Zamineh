import React from 'react';

import Modal from '../components/ui-components/Modal/Modal'

import Login from './Login'


const LoginModal = (props) => {
    const {
        isOpen,
        toggle,
        birthday_start,
        birthday_end
    } = props;

    return (
        <Modal
            isOpen={isOpen}
            toggle={toggle}
            className="LoginModal"
            title={"ثبت نام / ورود"}
        >
            <Login
                birthday_start={birthday_start}
                birthday_end={birthday_end}
            />
        </Modal>


    );
};
export default LoginModal;