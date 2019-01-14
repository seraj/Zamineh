import React from 'react';
import Modal from 'reactstrap/lib/Modal'
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import styles from "./Modal.scss"
import "./Modal.scss"
const ZaminehModal = (
    {
        title,
        isOpen,
        toggle,
        className,
        ...props
    }) => {


    const closeBtn = <button className="close" onClick={toggle}>&times;</button>;

    return (
        <Modal
            isOpen={isOpen}
            toggle={toggle}
            className={`${styles.Modal} ${className}`}
        // backdrop={'static'}
        >
            <ModalHeader close={closeBtn}>{title}</ModalHeader>
            <ModalBody {...props} />

        </Modal>


    );
};
export default ZaminehModal;