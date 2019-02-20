import React, { useState, useEffect } from "react";
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment-jalaali';

import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';

import Urls from '../Urls'

import { Toast } from '../Toast/Toast';
import { Loading } from '../Spinner/Spinner';
import { Img } from '../General';
import { PaymentAddressForm } from './PaymentForm'
import ZaminehMap from '../map/ZaminehMap';

import NumbersConvertor from '../NumbersConvertor';
import ThousandSeparator from '../ThousandSeparator';

import Modal from '../ui-components/Modal/Modal'

import styles from './Payment.scss'










const SubmitSeciton = ({ btnLoading, Text, onClick, currentStep, goToSteps }) => (
    <>
        <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
                <Row className={`justify-content-center`}>
                    {currentStep > 1 &&
                        <Col lg={6} md={6} sm={12} xs={12}>
                            <a
                                onClick={() => goToSteps(currentStep - 1)}
                                style={{ width: '100%', marginBottom: 10 }}
                                className={`zbtn blank previous bradius`}
                            >بازگشت <i className='fas fa-angle-right' /></a>
                        </Col>
                    }
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <button
                            onClick={onClick}
                            style={{ width: '100%', marginBottom: 10 }}
                            disabled={btnLoading}
                            className={`zbtn next black bradius ${btnLoading ? `spinning` : null}`}
                        >{Text} <i className='fas fa-angle-left' /></button>
                    </Col>
                </Row>
            </Col>

        </Row>
    </>
);











const Payment = (props) => {
    const [initialized, setInitialized] = useState(false)

    const [step, setStep] = useState(1)

    const [orderDetails, setOrderDetails] = useState()

    const [address, setAddress] = useState()

    const [finalValue, setFinalValue] = useState({ address_id: null, time_id: null, date: null, price: null })

    const [selectedTime, setSelectedTime] = useState()

    const [MapData, setMapData] = useState({ lat: null, lng: null })

    const [modal, setModal] = useState(false)

    const [loading, setLoading] = useState(true)
    const [formLoading, setFormLoading] = useState(false)


    useEffect(() => {
        if (!initialized) {
            getAddress()
            setLoading(false)
            setInitialized(true)
        }
    })
    const getAddress = () => {
        axios.get(`${Urls().api()}/client-app/client/address/`)
            .then(({ data }) => {
                setAddress(data)
            });
    }
    const handleAddressSubmit = values => {
        if (MapData.lat === null) {
            Toast('warning', `لطفا آدرس دقیق را روی نقشه انتخاب کنید`);
        } else {
            setFormLoading(true)
            values.lat = MapData.lat
            values.lng = MapData.lng

            axios.post(`${Urls().api()}/client-app/client/address/`, values, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
                .then(({ data }) => {
                    getAddress()
                    Toast('success', `آدرس با موفقیت ثبت شد`);
                    setFormLoading(false)
                    setModal(false)
                })
                .catch(err => {
                    setFormLoading(false)
                })
        }
    }
    const deleteAddress = (id) => {
        axios.delete(`${Urls().api()}/client-app/client/address/`, {
            params: {
                id: id
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(() => {
            let allValue = finalValue
            allValue['address_id'] = null
            setFinalValue(allValue)
            getAddress()
        })
    }
    const onAddressClick = (id) => {
        let allValue = finalValue
        allValue['address_id'] = id
        setFinalValue(allValue)
    }
    const onTimeClick = (index, id, date) => {
        setSelectedTime(index)
        let allValue = finalValue
        allValue['time_id'] = id
        allValue['date'] = date
        setFinalValue(allValue)
        // console.log(finalValue)
    }
    const onMapClick = (event) => {
        setMapData(event.latlng)
    }
    const onDayClick = (index) => {
        let times = document.getElementById(`time_set_${index}`)
        let day = document.getElementById(`weekDay_${index}`)
        times.classList.toggle('open')
        day.classList.toggle('opened')
    }
    const step1Click = () => {
        let values = {
            address_id: finalValue.address_id,
            cart_serial: props.cart_serial ? props.cart_serial : props.match.params.orderId

        }
        if (finalValue.address_id === null) {
            Toast('warning', `لطفا آدرس را انتخاب کنید`);
        } else {
            setFormLoading(true)
            axios
                .post(`${Urls().api()}/client-app/pay/check/`, values, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                })
                .then(({ data }) => {
                    setFormLoading(false)
                    setOrderDetails(data)
                    Toast('success', `آدرس با موفقیت ثبت شد`);
                    setStep(2)
                })
                .catch(err => {
                    setFormLoading(false)
                })
        }
    }


    const handlePaymentSubmit = () => {
        setFormLoading(true)
        let values = {
            address_id: finalValue.address_id,
            cart_serial: props.cart_serial ? props.cart_serial : props.match.params.orderId,
            date: finalValue.date,
            time_id: finalValue.time_id,
            platform: 'Web',
            price: finalValue.price

        }
        axios
            .post(`${Urls().api()}/client-app/pay/init/`, values, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            .then(({ data }) => {
                setFormLoading(false)
                Toast('success', `در حال انتقال به بانک...`);
                window.location.replace(data.url)
            })
            .catch(err => {
                setFormLoading(false)
            })
    }
    const calculateTax = (tax, price) => {
        const Tax = parseFloat(tax / 100)
        const TotalPrice = price.reduce((acc, currValue) => {
            return acc + currValue.price.price
        }, 0);
        const Ret = TotalPrice * Tax
        return parseInt(Ret)
    }



    const calculateTotalPrice = (tax, price, delivery, credit) => {
        let Tax = parseFloat(tax / 100)
        const TotalPrice = price.reduce((acc, currValue) => {
            return acc + currValue.price.price
        }, 0);
        const Ret = TotalPrice + (TotalPrice * Tax) - delivery - credit
        let allValue = finalValue
        allValue['price'] = Ret
        // setFinalValue(allValue)

        return parseInt(Ret)
    }
    return (
        <>
            <Container>
                {loading &&
                    <Row>

                        <div style={{ height: 150 }}>
                            <Loading background="#fff" />
                        </div>
                    </Row>
                }
                {step === 1 &&
                    <>
                        <Row className='justify-content-center'>

                            <Col lg={12} md={12} sm={12} xs={12}>
                                <div className={styles.section}>
                                    <h2>انتخاب آدرس برای ارسال اثر هنری</h2>
                                    <div className={styles.address}>
                                        {address && address.address_set.map((items, index) => (
                                            <div
                                                key={index}
                                                className={`items ${finalValue.address_id === items.id ? 'active' : ''}`}
                                                onClick={() => onAddressClick(items.id)}
                                            >
                                                <span className="address">{items.address}</span>
                                                <span className="close" onClick={() => deleteAddress(items.id)}><i class="fal fa-times" />حذف</span>

                                            </div>
                                        ))}


                                    </div>
                                    <button
                                        className='zbtn bradius white'
                                        onClick={() => setModal(true)}
                                    >
                                        اضافه کردن آدرس
                            </button>
                                </div>


                            </Col>

                        </Row>
                        <SubmitSeciton
                            Text='ثبت آدرس'
                            onClick={() => step1Click()}
                            btnLoading={formLoading}
                            currentStep={step}
                            goToSteps={setStep}
                        />
                    </>
                }


                {step === 2 &&
                    <>
                        <Row>

                            <Col lg={12} md={12} sm={12} xs={12}>
                                <div className={styles.section}>
                                    <h2>زمان انتخابی برای ارسال اثر</h2>
                                    <div className={styles.deliveryTime}>


                                        {orderDetails && orderDetails.calendar_set.map((item, index) => (


                                            <div className='weekDay' id={`weekDay_${index}`} key={index}>


                                                <div className="info" onClick={() => onDayClick(index)}>
                                                    <span className='day'>{item.weekday}</span>
                                                    <span className='date'>{NumbersConvertor().convertToPersian(moment(item.date, 'YYYY-MM-DD').format('jDD jMMMM jYYYY'))}</span>
                                                </div>



                                                <div className="time_set" id={`time_set_${index}`}>
                                                    {item.time_set && item.time_set.map((time, key) => (

                                                        <div
                                                            className='times' key={key}
                                                            onClick={() => onTimeClick(`${time.id}${index}`, time.id, item.date)}
                                                        >
                                                            <div className={`item ${selectedTime === `${time.id}${index}` ? 'selected' : ''}`}>
                                                                <span className='time'>ساعت {NumbersConvertor().convertToPersian(time.start_time)} تا {NumbersConvertor().convertToPersian(time.end_time)}</span>
                                                                <span className='detail'>{time.detail}</span>
                                                            </div>
                                                        </div>

                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                        }
                                    </div>
                                </div>
                            </Col>


                            <Col lg={12} md={12} sm={12} xs={12}>
                                <div className={styles.section}>
                                    <h2>فاکتور</h2>
                                    <div className={styles.invoce}>
                                        <ul className='list'>
                                            {orderDetails &&
                                                <>
                                                    <li>
                                                        <i className='zicon icon-42'></i>
                                                        هزینه ارسال :‌ <span>{orderDetails.dl_price !== 0 ? `${NumbersConvertor().convertToPersian(ThousandSeparator(orderDetails.dl_price))} تومان` : 'رایگان'}</span>
                                                    </li>
                                                    <li>
                                                        <i className='zicon icon-42'></i>
                                                        مالیات :‌ <span>{orderDetails.tax_per && `${calculateTax(orderDetails.tax_per, orderDetails.art_set)} تومان`}</span>
                                                    </li>
                                                    <li>
                                                        <i className='zicon icon-42'></i>
                                                        قیمت نهایی :‌ <span>{orderDetails.tax_per && `${calculateTotalPrice(orderDetails.tax_per, orderDetails.art_set, orderDetails.dl_price, orderDetails.credit)} تومان`}</span>
                                                    </li>

                                                </>
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </Col>


                        </Row>
                        <SubmitSeciton
                            Text='ثبت نهایی'
                            onClick={() => handlePaymentSubmit()}
                            btnLoading={formLoading}
                            currentStep={step}
                            goToSteps={setStep}
                        />
                    </>
                }






            </Container>
            <Modal
                isOpen={modal}
                toggle={() => setModal(false)}
                title={'اضافه کردن آدرس'}
            >
                <Row>
                    <Col xs={12}>
                        <PaymentAddressForm
                            loading={formLoading}
                            handleSubmit={handleAddressSubmit}
                            onMapClick={onMapClick}
                        />
                    </Col>
                </Row>
            </Modal>
        </>
    )
}

export default withRouter(Payment);
