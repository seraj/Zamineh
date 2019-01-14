
import React from 'react';
import cookie from 'react-cookies';
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import Loadable from 'react-loadable';
import moment from "moment-jalaali";
import SecurityManager from "../../security/SecurityManager";
import Urls from "../../components/Urls";
import Section from "../../components/Section/Section";

import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";


import { Form } from "react-final-form";
import { Field } from 'react-final-form-html5-validation'
import setFieldData from 'final-form-set-field-data'
import createDecorator from 'final-form-focus'
import arrayMutators from 'final-form-arrays'


import { Toast } from '../../components/Toast/Toast';
import 'react-toastify/dist/ReactToastify.css';


import AuthorizationForm from "../components/AuthorizationForm"
import NumbersConvertor from '../../components/NumbersConvertor';
import RegisterMetaTags from '../RegisterMetaTags';
import { RegisterForm } from "./RegistrationFrom";
import StepBar from "../../components/StepBar/StepBar"

import {
    Step1Validation,
    MobileValidator,
    ValidateShebaNum
} from '../artist/ArtistFormValidation';

import '../Registration.scss';


const SubmitSeciton = ({ StepData, Text, values, currentStep, goToSteps }) => (
    <React.Fragment>
        <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
                <Row className={`justify-content-center`}>

                    <Col lg={6} md={6} sm={12} xs={12}>
                        <button
                            type="submit"
                            style={{ width: '100%', marginBottom: 10 }}
                            disabled={StepData.SubmitBtnLoading}
                            variant="primary"
                            className={`zbtn next black bradius ${StepData.SubmitBtnLoading ? `spinning` : null}`}
                        >{Text} <i className="fas fa-angle-left" /></button>
                    </Col>
                </Row>
            </Col>

        </Row>
        {/*<pre>{JSON.stringify(values, 0, 2)}</pre>*/}
    </React.Fragment>
);




const Condition = ({ when, is, children }) => (
    <Field name={when} subscription={{ value: true }}>
        {({ input: { value } }) => ((value === is || value != '') ? children : null)}
    </Field>
);

class GalleryRegistration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playerID: '12',
            showLoginError: false,

            Maplatlng: [],
            datePicker: '',
            currentStep: '',
            Loading: true,
            StepData: [],
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
                    StepData: response.data.social_set,
                    currentStep: response.data.step,
                })
            })
            .then(() => {
                this.getFormData()
            });;
    }

    getFormData = () => {
        this.setState({
            Loading: true
        })
        axios
            .get(`${Urls().api()}/gallery-app/gallery/registration/`)
            .then(response => {
                this.setState({
                    StepData: response.data,
                    Loading: false
                })
            })
    }



    focusOnErrors = createDecorator()






    //* ـــــــــــــــــــ */
    // Steps Submit Actions


    onMapClick = (event) => {
        //         debugger
        this.setState({
            Maplatlng: event.latlng
        })
        console.log(this.state.Maplatlng)
    }

    BtnSubmitLoading(value) {
        var StepData = this.state.StepData;
        StepData.SubmitBtnLoading = value;
        this.setState({
            StepData
        })
    }
    handleFormSubmit = values => {
        var StepData = this.state.StepData;
        if (!Step1Validation(values)) {
            Toast('warning', 'اطلاعات تکمیل نمیباشد');
        }
        // else
        //     if (values.lat == '' || values.lat == undefined) {
        //         Toast('warning','لطفا آدرس دقیق را روی نقشه انتخاب کنید');
        //     }
        else {
            this.BtnSubmitLoading(true)
            axios
                .post(`${Urls().api()}/gallery-app/gallery/registration/`, {
                    name: values.name,
                    about: values.about,
                    address: {
                        address: values.address.address,
                        tel: values.address.tel,
                        lat: StepData.address.lat == null ? values.address.lat : this.state.Maplatlng.lat,
                        lng: StepData.address.lng == null ? values.address.lng : this.state.Maplatlng.lng
                    },
                    work_hours: values.work_hours,
                    holiday_set: values.holiday_set,
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
                }).then(() => {
                    this.getSteps()
                })
                .catch(error => {
                    this.BtnSubmitLoading(false)
                })
        }
    }


    setAccessTokens = (Token, RefreshToken) => {
        SecurityManager().setGalleryRegAccessToken(Token);
        SecurityManager().setGalleryRegRefreshToken(RefreshToken);
    }



    render() {
        const {
            currentStep,
            StepData,
            StepConfig,

            Loading,
            loadingDiv,
            ModalToggle


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
                                <div className="page-content registration">


                                    <div className={Loading ? `LoadingData` : ''}></div>
                                    {!hasToken &&
                                        <AuthorizationForm
                                            afterLogin={this.getFormConfig}
                                            checkMobileAPI="/gallery-app/gallery/check/"
                                            validationAPI="/gallery-app/phone/validate/"
                                            loginAPI="/gallery-app/gallery/login/"
                                            type="Gallery"
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
                                                        StepData != '' ? StepData : null
                                                    }
                                                    render={({ handleSubmit, form, submitting, pristine, values }) => (
                                                        <form onSubmit={handleSubmit}>
                                                            <RegisterForm
                                                                Field={Field}
                                                                StepData={StepData}
                                                                StepConfig={StepConfig}
                                                                onMapClick={this.onMapClick}
                                                                MobileValidator={MobileValidator}
                                                                ValidateShebaNum={ValidateShebaNum}
                                                                values={values}
                                                            />

                                                            <SubmitSeciton
                                                                Text="ثبت نام گالری"
                                                                StepData={StepData}
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
