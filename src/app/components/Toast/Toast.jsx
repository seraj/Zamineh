import React from 'react';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Toast(type, message) {
    var ToastMessage;
    switch (type) {
        case "error":
            ToastMessage = toast.error(message);
            break;
        case "warning":
            ToastMessage = toast.warning(message);
            break;
        case "success":
            ToastMessage = toast.success(message);
            break;
        case "info":
            ToastMessage = toast.info(message);
            break;
        default:
            ToastMessage = toast(message);
    }
    return ToastMessage
}
export function ToastMessageBox() {
    return (
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl
            pauseOnVisibilityChange
            draggable
            pauseOnHover
        />
    )
}