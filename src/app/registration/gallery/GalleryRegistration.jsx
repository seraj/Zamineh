
import React from 'react';
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import SecurityManager from '../../security/SecurityManager';
import Urls from '../../components/Urls';
import Section from '../../components/Section/Section';

import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';


import { Form } from 'react-final-form';
import { Field } from 'react-final-form-html5-validation'
import createDecorator from 'final-form-focus'


import { Toast } from '../../components/Toast/Toast';
import 'react-toastify/dist/ReactToastify.css';


import AuthorizationForm from '../components/AuthorizationForm'
import NumbersConvertor from '../../components/NumbersConvertor';
import RegisterMetaTags from '../RegisterMetaTags';
import { RegisterForm } from './RegistrationFrom';

import {
    Step1Validation,
    MobileValidator,
    ValidateShebaNum
} from '../artist/ArtistFormValidation';

import MessageBox from '../../components/ui-components/MessageBox/MessageBox'

import '../Registration.scss';


const SubmitSeciton = ({ btnLoading, Text, values }) => (
    <React.Fragment>
        <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
                <Row className={`justify-content-center`}>

                    <Col lg={6} md={6} sm={12} xs={12}>
                        <button
                            type='submit'
                            style={{ width: '100%', marginBottom: 10 }}
                            disabled={btnLoading}
                            variant='primary'
                            className={`zbtn next black bradius ${btnLoading ? `spinning` : null}`}
                        >{Text} <i className='fas fa-angle-left' /></button>
                    </Col>
                </Row>
            </Col>

        </Row>
        {/*<pre>{JSON.stringify(values, 0, 2)}</pre>*/}
    </React.Fragment>
);


class GalleryRegistration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playerID: '12',
            showLoginError: false,
            successBox: false,
            message: {
                type: '',
                title: '',
                message: '',
            },
            timer: '10',

            Maplatlng: [],
            datePicker: '',
            currentStep: '',
            Loading: true,
            btnLoading: false,
            StepConfig: [],
            FormData: [],

            ModalToggle: false
        }
    }

    componentWillMount() {

        if (SecurityManager().hasGalleryRegToken()) {
            this.getFormConfig()
        }
    }

    getFormConfig = () => {
        axios
            .get(`${Urls().api()}/gallery-app/gallery/registration/configs/`)
            .then(response => {
                this.setState({
                    StepConfig: response.data,
                    FormData: response.data.social_set,
                    currentStep: response.data.step,
                })
            })
            .then(() => {
                this.getFormData()
            }).catch(error => {
                if (error.response.status == 406) {
                    this.setState({
                        successBox: true,
                        message: {
                            type: '',
                            title: 'گالری ثبت شده دارید',
                            message: 'شما با این شماره یک گالری ثبت کرده اید.در صورت نیاز شما میتوانید با شماره‌ی دیگر ثبت نام کنید',
                        },
                        timer: 15,
                    })
                }
            })

    }

    getFormData = () => {
        this.setState({
            Loading: true
        })
        axios
            .get(`${Urls().api()}/gallery-app/gallery/registration/`)
            .then(response => {
                this.setState({
                    FormData: response.data,
                    Loading: false
                })
            })
    }



    focusOnErrors = createDecorator()






    //* ـــــــــــــــــــ */
    // Steps Submit Actions


    onMapClick = (event) => {
        this.setState({
            Maplatlng: event.latlng
        })
        // console.log(this.state.Maplatlng)
    }

    BtnSubmitLoading(value) {
        var FormData = this.state.FormData;
        FormData.SubmitBtnLoading = value;
        this.setState({
            FormData
        })
    }
    Validation = (value) => {
        if (
            value.name == '' ||
            value.address.address == undefined ||
            value.address.address == '' ||
            value.address.tel == undefined ||
            value.address.tel == '' ||
            value.work_hours.start_time == undefined ||
            value.work_hours.start_time == '' ||
            value.work_hours.end_time == undefined ||
            value.work_hours.end_time == '' ||
            value.holiday_set == undefined ||
            value.holiday_set == '' ||
            value.email == null ||
            value.email == '' ||
            value.sheba_num == null ||
            value.sheba_num == '' ||
            value.owner.name == undefined ||
            value.owner.name == '' ||
            value.owner.tel == undefined ||
            value.owner.tel == ''
        ) {
            return false
        } else {
            return true
        }
    }
    onSubmit = async values => {
        var Holiday = []
        for (var i = 0; i < values.holiday_set.length; i++) {
            Holiday[i] = { 'name': values.holiday_set[i] };
        }

        // window.alert(JSON.stringify(Holiday, 0, 2));
    };
    handleFormSubmit = values => {
        var FormData = this.state.FormData;


        if (!this.Validation(values)) {
            Toast('warning', 'اطلاعات تکمیل نمیباشد');
        }
        else
            if (
                FormData.address.lat == null
                    ?
                    (this.state.Maplatlng.lat == '' || this.state.Maplatlng.lat == undefined)
                    :
                    (values.address.lat == '' || values.address.lat == undefined)
            ) {
                Toast('warning', 'لطفا آدرس دقیق را روی نقشه انتخاب کنید');
            }
            else {
                var HolidaySet = []
                for (var i = 0; i < values.holiday_set.length; i++) {
                    HolidaySet[i] = { 'name': values.holiday_set[i] };
                }
                this.BtnSubmitLoading(true)
                axios
                    .post(`${Urls().api()}/gallery-app/gallery/registration/`, {
                        name: values.name,
                        about: values.about,
                        address: {
                            address: values.address.address,
                            tel: values.address.tel,
                            lat: FormData.address.lat == null ? this.state.Maplatlng.lat : values.address.lat,
                            lng: FormData.address.lng == null ? this.state.Maplatlng.lng : values.address.lng
                        },
                        work_hours: values.work_hours,
                        holiday_set: HolidaySet,
                        email: values.email,
                        social_set: values.social_set,
                        owner: values.owner,
                        permission_name: values.permission_name,
                        phone_num: NumbersConvertor().convertToLatin(values.phone_num),
                        sheba_num: NumbersConvertor().convertToLatin(values.sheba_num),
                    })
                    .then(() => {
                        Toast('success', 'اطلاعات شما با موفقیت ثبت شد');
                        this.BtnSubmitLoading(false)
                        this.setState({
                            successBox: true,
                            message: {
                                type: 'success',
                                title: 'گالری شما با موفقیت ثبد شد',
                                message: 'گالری مورد نظر ثبت شده.بزودی به صفحه پروفایل انتقال میابید.',
                            },
                            timer: 15,
                        })
                    })
                    .then(() => {
                        if (parsed['xeYDSM2fWgsJvFuN'] == 'ios' && isMobile) {
                            this.redirectToApp('Ios')
                        }
                        else if (parsed['xeYDSM2fWgsJvFuN'] == 'android' && isMobile) {
                            this.redirectToApp('Android')
                        }
                    })
                    .catch(error => {
                        this.BtnSubmitLoading(false)
                    })
            }
    }

    redirectToApp = (os) => {
        var body = {
            client_id: SecurityManager().getRegClientIDSecret('id', 'Gallery'),
            client_secret: SecurityManager().getRegClientIDSecret('secret', 'Gallery'),
            platform: os
        }
        axios.post(`${Urls().api()}/gallery-app/auth/get-token/`, body)
            .then(response => {

                window.location = response.data.scheme
            })
    }


    setAccessTokens = (Token, RefreshToken) => {
        SecurityManager().setGalleryRegAccessToken(Token);
        SecurityManager().setGalleryRegRefreshToken(RefreshToken);
    }
    afterTimeFinished = () => {
        window.location.replace(Urls().Profile());

    }

    render() {
        const {
            currentStep,
            FormData,
            StepConfig,

            Loading,
            btnLoading,
            successBox,
            message,
            timer

        } = this.state
        var url = window.location.href;
        var hasToken = SecurityManager().hasGalleryRegToken()
        return (
            <React.Fragment>

                <RegisterMetaTags
                    title={'ثبت نام'}
                />
                <Section ExtraClass={'content singlePage'}>
                    <Container>
                        <Row>
                            <Col xs={12}>
                                <div className='page-content registration'>
                                    {successBox &&
                                        <MessageBox
                                            title={message.title}
                                            message={message.message}
                                            type={message.type}
                                            buttonText='رفتن به پروفایل'
                                            seconds={timer}
                                            afterTimeFinished={this.afterTimeFinished}
                                        />
                                    }

                                    <div className={Loading ? `LoadingData` : ''}></div>
                                    {!hasToken &&
                                        <AuthorizationForm
                                            afterLogin={this.getFormConfig}
                                            checkMobileAPI='/gallery-app/gallery/check/'
                                            validationAPI='/gallery-app/phone/validate/'
                                            loginAPI='/gallery-app/gallery/login/'
                                            type='Gallery'
                                            setAccessTokens={this.setAccessTokens}
                                        />
                                    }


                                    {currentStep == 1 &&
                                        <React.Fragment>
                                            <Col xs={12}>
                                                <Form
                                                    decorators={[this.focusOnErrors]}
                                                    onSubmit={this.handleFormSubmit}
                                                    initialValues={
                                                        FormData != '' ? FormData : null
                                                    }
                                                    render={({ handleSubmit, form, submitting, pristine, values }) => (
                                                        <form onSubmit={handleSubmit}>
                                                            <RegisterForm
                                                                Field={Field}
                                                                FormData={FormData}
                                                                StepConfig={StepConfig}
                                                                onMapClick={this.onMapClick}
                                                                MobileValidator={MobileValidator}
                                                                ValidateShebaNum={ValidateShebaNum}
                                                                values={values}
                                                            />

                                                            <SubmitSeciton
                                                                Text='ثبت نام گالری'
                                                                btnLoading={btnLoading}
                                                                currentStep={currentStep}
                                                                values={values}

                                                            />
                                                        </form>
                                                    )}
                                                />

                                            </Col>

                                        </React.Fragment>
                                    }


                                </div>

                            </Col>
                        </Row>
                    </Container>
                </Section>

            </React.Fragment>

        )
    }
}

export default withRouter(GalleryRegistration);
