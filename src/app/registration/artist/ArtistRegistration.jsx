
import React from 'react';
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

import AuthorizationForm from "../components/AuthorizationForm"
import NumbersConvertor from '../../components/NumbersConvertor';
import RegisterMetaTags from '../RegisterMetaTags';
import { Step1, Step2, Step3 } from "./Steps";
import StepBar from "../../components/StepBar/StepBar"
import MessageBox from "../../components/ui-components/MessageBox/MessageBox"

const Step4 = Loadable({
    loader: () => import('./Steps').then(module => module.Step4),
    loading: () => <div>در حال بارگذاری...</div>,
});

import {
    Step1Validation,
    MobileValidator,
    ValidateShebaNum,
    ValidateTextArea,
    AllExbValidation,
    SingleExbValidation,
    SingleCollectionValidation,
    SingleArtValidation,
    SingleCollectionArtValidation,
    CollectionAllArtValidation,
    AllArtValidation
} from './ArtistFormValidation';

import styles from '../Registration.scss';


const SubmitSeciton = ({ StepData, Text, values, currentStep, goToSteps }) => (
    <React.Fragment>
        <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
                <Row className={`${currentStep > 1 ? `justify-content-between` : `justify-content-center`} `}>
                    {currentStep > 1 &&
                        <Col lg={4} md={6} sm={12} xs={12}>
                            <a
                                onClick={() => goToSteps(currentStep - 1)}
                                style={{ width: '100%', marginBottom: 10 }}
                                className={`zbtn blank previous bradius`}
                            >بازگشت به مرحله قبل <i className="fas fa-angle-right" /></a>
                        </Col>
                    }
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

class ArtistRegistration extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            type: 'Artist',
            playerID: '123456789',
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
            StepData: [],
            loadingDiv: '',
            ModalToggle: false
        }
    }

    componentWillMount() {

        if (SecurityManager().hasArtistRegToken()) {
            this.getSteps()
        }
    }
    getSteps = () => {
        this.setState({
            Loading: true
        })
        axios
            .get(`${Urls().api()}/gallery-app/artist/portfolio-state/`)
            .then(response => {
                this.setState({
                    currentStep: response.data.step,
                    is_editable: response.data.is_editable
                }, () => this.forceUpdate())
            }).then(() => {
                this.getStepData(this.state.currentStep)
                this.getStepConfig(this.state.currentStep)
            });
    }
    getStepData = (step) => {
        // console.log('step', step)
        axios
            .get(`${Urls().api()}/gallery-app/artist/portfolio-step${step}/`)
            .then(response => {
                this.setState({
                    StepData: response.data,
                    Loading: false
                })
            }).then(() => {
                setTimeout(() => {
                    this.setState({
                        loadingDiv: ''
                    })
                }, 200);
            }).catch(error => {
                if (error.response.status == 406) {
                    this.setState({
                        successBox: true,
                        message: {
                            type: '',
                            title: 'هنرمند ثبت شده دارید',
                            message: 'شما با این شماره یک هنرمند ثبت کرده اید.در صورت نیاز شما میتوانید با شماره‌ی دیگر ثبت نام کنید',
                        },
                        timer: 15,
                    })
                }
            })
    }
    getStepConfig = (step) => {
        axios
            .get(`${Urls().api()}/gallery-app/artist/step-configs/?step=step${step}`)
            .then(response => {
                this.setState({
                    StepConfig: response.data
                })
            });
    }
    goToSteps = (step) => {
        this.setState({
            currentStep: step,
        }, () => {
            this.getStepData(this.state.currentStep)
            this.getStepConfig(this.state.currentStep)
        })

    }












    //* ـــــــــــــــــــ */
    // Steps Submit Actions

    BtnSubmitLoading(value) {
        var StepData = this.state.StepData;
        StepData.SubmitBtnLoading = value;
        this.setState({
            StepData
        })
    }
    ArtistRegisterStep1 = values => {
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
                .post(`${Urls().api()}/gallery-app/artist/portfolio-step1/`, {
                    first_name: values.first_name,
                    last_name: values.last_name,
                    address: {
                        address: values.address,
                        lat: StepData.lat ? values.lat : this.state.Maplatlng.lat,
                        lng: StepData.lng ? values.lng : this.state.Maplatlng.lng
                    },
                    email: values.email,
                    website: values.website,
                    phone_num: NumbersConvertor().convertToLatin(values.phone_num),
                    sheba_num: NumbersConvertor().convertToLatin(values.sheba_num),
                    gallery: values.gallery[0]
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
    ArtistRegisterStep2 = values => {
        this.BtnSubmitLoading(true)
        axios
            .post(`${Urls().api()}/gallery-app/artist/portfolio-step2/`, values)
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
    ArtistRegisterStep3 = values => {
        if (!AllExbValidation(values)) {
            Toast('warning', 'تمام اطلاعات نمایشگاه‌ها باید ثبت شود');
        }
        else {
            this.BtnSubmitLoading(true)

            axios
                .post(`${Urls().api()}/gallery-app/artist/portfolio-step3/new-step/`)
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
    ArtistRegisterStep4 = values => {

        if (!CollectionAllArtValidation(values)) {
            Toast('warning', 'تمام اطلاعات مجموعه‌ها باید ثبت شود');
        }
        else {
            this.BtnSubmitLoading(true)
            axios
                .post(`${Urls().api()}/gallery-app/artist/portfolio-step4/`)
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

    // End Steps Submit Actions
    //* ـــــــــــــــــــ */



    focusOnErrors = createDecorator()


    onMapClick = (event) => {

        this.setState({
            Maplatlng: event.latlng
        })
        // console.log(this.state.Maplatlng)
    }
    onChangeDatepicker = async value => {
        const date = await `${value.jYear()}-${value.jMonth() + 1}-${value.jDate()}`;
        const endate = moment(date, "jYYYY-jM-jD").format("YYYY-MM-DD");
        await this.setState(
            {
                datePicker: endate
            },
            () => {
                this.forceUpdate();
            }
        );
    };

    // Start Step 3 Functions
    handleExhibition = () => {
        return {
            getCurrentIndex: function (length) {
                if (length == 0 || length == undefined || length == null) {
                    return '0';
                } else {
                    return length
                }
            },
        }
    }
    addExhibition = async (pushFunction, type, ) => {
        axios.post(`${Urls().api()}/gallery-app/exb-art/create/`, {
            type: type
        })
            .then(response => {
                pushFunction({ id: response.data.id, art_set: [] })
            }).then(() => {
                this.getSteps()
            })
            .catch(error => {
                // console.log(error);
            })
    }
    AddArt = (pushFunction, type, exbID) => {
        axios.post(`${Urls().api()}/gallery-app/exb-art/create/`, {
            type: type,
            id: exbID ? exbID : null
        })
            .then(response => {
                pushFunction({ id: response.data.id })
            }).then(() => {
                this.getSteps()
            })

            .catch(error => {
                // console.log(error);

            })
    }
    SingleEXBSubmit = (values, exbIndex) => {
        const exbID = values.exb_set[exbIndex].id
        var ExbValue = values.exb_set[exbIndex];
        var ExbData = this.state.StepData.exb_set[exbIndex]
        ExbValue.date = this.state.datePicker ? this.state.datePicker : moment().format('YYYY-M-D');
        // console.log(ExbValue)
        if (!SingleExbValidation(ExbValue)) {
            Toast('warning', 'لطفا تمام موارد الزامی را تکمیل نمایید');
            if (ExbData.submitted != undefined) {

                ExbData.submitted = false;
                this.setState({
                    ExbData
                })
            }
        } else if (
            ExbValue.art_set == '' ||
            ExbValue.art_set == undefined
        ) {
            Toast('warning', 'نمایشگاه حداقل باید شامل ۱ اثر باشد.');
        }
        else if (!AllArtValidation(ExbValue.art_set)) {
            Toast('warning', 'لطفا اطلاعات آثار را تکمیل نمایید');
        }
        else {
            ExbData.loading = true;
            this.setState({
                ExbData
            })
            axios.post(`${Urls().api()}/gallery-app/artist/portfolio-step3/`, ExbValue)
                .then(response => {
                    Toast('success', `نمایشگاه شماره ${exbIndex + 1} با موفقیت ثبت شد`)
                    ExbData.loading = false;
                    ExbData.submitted = true
                    this.setState({
                        ExbData
                    })
                })

                .catch(error => {
                    console.log(error);
                    ExbData.loading = false;
                    ExbData.submitted = false
                    this.setState({
                        ExbData
                    })

                })
        }
    }
    SingleArtSubmit = (values, Artindex, exbIndex) => {

        const exbID = values.exb_set[exbIndex].id
        var ArtValue = values.exb_set[exbIndex].art_set[Artindex]
        var ArtData = this.state.StepData.exb_set[exbIndex].art_set[Artindex]
        if (!SingleArtValidation(ArtValue)) {
            Toast('warning', `لطفا تمام فیلدهای مربوط به اثر شماره ${Artindex + 1} را پر کنید`);
            ArtData.submitted = false;
            ArtValue.submitted = false
            this.setState({
                ArtData
            }, () => {
                this.forceUpdate()
            })
        } else {
            ArtData.loading = true;
            this.setState({
                ArtData
            })
            axios.post(`${Urls().api()}/gallery-app/artist/portfolio-step3/art/`, ArtValue)
                .then(response => {
                    Toast('success', `اثر شماره ${Artindex + 1} با موفقیت ثبت شد`)
                    ArtData.loading = false;
                    ArtData.submitted = true;
                    ArtValue.submitted = true;
                    this.setState({
                        ArtData
                    }, () => {
                        this.forceUpdate()
                    })
                })

                .catch(error => {
                    ArtData.loading = false;
                    ArtData.submitted = false;
                    ArtValue.submitted = false;
                    this.setState({
                        ArtData
                    })

                })
        }
    }
    handleRemoveExbArt = (FARemove, type, values, ExbIndex, ArtIndex) => {
        const CurrentIndex = type === 'exb_id' ? ExbIndex : ArtIndex;
        const Name = type === 'exb_id' ? 'نمایشگاه' : 'اثر';
        const ID = type === 'exb_id' ? values.exb_set[ExbIndex].id : values.exb_set[ExbIndex].art_set[ArtIndex].id;
        // FARemove.remove(index)
        axios.delete(`${Urls().api()}/gallery-app/exb-art/create/?${type}=${ID}`).then(response => {
            Toast('success', `${Name} مورد نظر با موفقیت حذف شد`)
            FARemove.remove(CurrentIndex)
        })
            .catch(error => {
            })
    }
    // end Step 3 Functions

    // Start Step 4 Functions
    Step4_onChangeType = (portfolio_type, values) => {
        this.setState({
            loadingDiv: portfolio_type
        })
        axios.post(`${Urls().api()}/gallery-app/artist/portfolio-step4/init/`, {
            type: portfolio_type
        })
            .then(response => {
                this.getSteps()
            })
            .catch(error => {

            })
    }

    Step4_addCollection = async (pushFunction, type) => {
        axios.post(`${Urls().api()}/gallery-app/collection-art/`, {
            type: type
        })
            .then(response => {
                pushFunction({ id: response.data.id, art_set: [] })
            }).then(() => {
                this.getSteps()
            })
            .catch(error => {

            })
    }
    Step4_addArt = (pushFunction, type, ColID) => {
        axios.post(`${Urls().api()}/gallery-app/collection-art/`, {
            type: type,
            collection_id: ColID ? ColID : null
        })
            .then(response => {
                pushFunction({ id: response.data.id })
            }).then(() => {
                this.getSteps()
            })

            .catch(error => {

            })
    }
    openArtModal = () => {
        this.setState({
            ModalToggle: !this.state.ModalToggle
        })
    }
    importArttoCollection = (Artindex, ArtID, CollectionID) => {
        var ArtData = this.state.StepData.art_set
        console.log(ArtID, CollectionID)
        axios.post(`${Urls().api()}/gallery-app/artist/portfolio-step4/import/`, {
            art_id: ArtID,
            collection_id: CollectionID
        })
            .then(response => {
                ArtData.splice(Artindex, 1);
                this.setState({
                    ArtData
                })
            })
            .then(() => {
                this.getSteps()
            })

            .catch(error => {
            })

    }
    Step4_SingleArtSubmit = (values, Artindex, ColIndex, ArtType) => {
        var ArtValue = '';
        var ArtData = '';
        if (ArtType === 'SingleArt') {
            ArtValue = values.art_set[Artindex];
            ArtData = this.state.StepData.art_set[Artindex]
        } else {
            ArtValue = values.collection_set[ColIndex].art_set[Artindex];
            ArtData = this.state.StepData.collection_set[ColIndex].art_set[Artindex];
        }
        console.log(ArtValue)

        ArtValue.gallery = ArtValue.gallery[0]
        if (!SingleCollectionArtValidation(ArtValue)) {
            Toast('warning', `لطفا تمام فیلدهای مربوط به اثر شماره ${Artindex + 1} را پر کنید`);
            ArtData.submitted = false;
            ArtValue.submitted = false
            this.setState({
                ArtData
            }, () => {
                this.forceUpdate()
            })
        } else if (ArtValue.gallery == undefined || ArtValue.gallery == "") {
            Toast('warning', `اطلاعات گالری مالک اثر برای اثر شماره ${Artindex + 1} را تکمیل نمایید`);
            ArtData.submitted = false;
            ArtValue.submitted = false
            this.setState({
                ArtData
            }, () => {
                this.forceUpdate()
            })
        } else {
            ArtData.loading = true;
            this.setState({
                ArtData
            })
            axios.post(`${Urls().api()}/gallery-app/artist/portfolio-step4/art/`, ArtValue)
                .then(response => {
                    Toast('success', `اثر شماره ${Artindex + 1} با موفقیت ثبت شد`)
                    ArtData.loading = false;
                    ArtData.submitted = true;
                    ArtValue.submitted = true;
                    this.setState({
                        ArtData
                    }, () => {
                        this.forceUpdate()
                    })
                })

                .catch(error => {
                    ArtData.loading = false;
                    ArtData.submitted = false;
                    ArtValue.submitted = false;
                    this.setState({
                        ArtData
                    })
                })
        }
    }
    Step4_SingleColSubmit = (values, ColIndex) => {
        const ColID = values.collection_set[ColIndex].id
        var ColValue = values.collection_set[ColIndex];
        var ColData = this.state.StepData.collection_set[ColIndex];

        if (!SingleCollectionValidation(ColValue)) {
            Toast('warning', 'لطفا تمام موارد الزامی را تکمیل نمایید');
            if (ColData.submitted != undefined) {

                ColData.submitted = false;
                this.setState({
                    ColData
                })
            }
        } else if (
            ColValue.art_set == '' ||
            ColValue.art_set == undefined
        ) {
            Toast('warning', 'هر مجموعه حداقل باید دارای ۵ اثر باشد');
        }
        else if (!CollectionAllArtValidation(ColValue.art_set)) {
            Toast('warning', 'لطفا اطلاعات آثار را تکمیل نمایید');
        }
        else if (ColValue.art_set.length < 5) {
            Toast('warning', 'هر مجموعه حداقل باید دارای ۵ اثر باشد.');
        }
        else {
            ColData.loading = true;
            this.setState({
                ColData
            })
            axios.post(`${Urls().api()}/gallery-app/artist/portfolio-step4/collection/`, ColValue)
                .then(response => {
                    Toast('success', `مجموعه شماره ${ColIndex + 1} با موفقیت ثبت شد`)
                    ColData.loading = false;
                    ColData.submitted = true;

                    this.setState({
                        ColData,
                        successBox: true,
                        message: {
                            type: 'success',
                            title: 'ثبت موفق',
                            message: 'اطلاعات مورد نظر ثبت شده.بزودی به صفحه پروفایل انتقال میابید.',
                        },
                        timer: 15,
                    })
                })

                .catch(error => {
                    console.log(error);
                    ColData.loading = false;
                    ColData.submitted = false
                    this.setState({
                        ColData
                    })
                })
        }
    }
    Step4_handleRemove = (FARemove, type, values, ColIndex, ArtIndex, CollectionType) => {
        const CurrentIndex = type === 'collection_id' ? ColIndex : ArtIndex;
        const Name = type === 'collection_id' ? 'مجموعه' : 'اثر';
        var ID = ''
        if (type === 'collection_id') {
            ID = values.collection_set[ColIndex].id
        } else if (type === 'art_id' && CollectionType === 'CollectionArt') {
            ID = values.collection_set[ColIndex].art_set[ArtIndex].id;
        }
        else {
            ID = values.art_set[ArtIndex].id
        }

        axios.delete(`${Urls().api()}/gallery-app/collection-art/?${type}=${ID}`).then(response => {
            Toast('success', `${Name} مورد نظر با موفقیت حذف شد`)
            FARemove.remove(CurrentIndex)
        })
            .catch(error => {

            })
    }

    // end Step 4 Functions





    setAccessTokens = (Token, RefreshToken) => {
        SecurityManager().setArtistRegAccessToken(Token);
        SecurityManager().setArtistRegRefreshToken(RefreshToken);
    }

    afterTimeFinished = () => {
        window.location.replace(Urls().Profile());

    }

    render() {
        const {

            currentStep,
            StepData,
            StepConfig,

            Loading,
            loadingDiv,
            ModalToggle,
            successBox,
            message,
            timer

        } = this.state
        var url = window.location.href;
        var hasToken = SecurityManager().hasArtistRegToken()
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

                                    {successBox &&
                                        <MessageBox
                                            title={message.title}
                                            message={message.message}
                                            type={message.type}
                                            buttonText="رفتن به پروفایل"
                                            seconds={timer}
                                            afterTimeFinished={this.afterTimeFinished}
                                        />
                                    }
                                    <StepBar currentStep={currentStep} page="artist" />

                                    <div className={Loading ? `LoadingData` : ''}></div>


                                    {!hasToken &&
                                        <AuthorizationForm
                                            afterLogin={this.getSteps}
                                            checkMobileAPI="/gallery-app/gallery/check/"
                                            validationAPI="/gallery-app/phone/validate/"
                                            loginAPI="/gallery-app/gallery/login/"
                                            type="Artist"
                                            setAccessTokens={this.setAccessTokens}
                                        />
                                    }


                                    {currentStep == 1 &&
                                        <React.Fragment>
                                            <Col xs={12}>
                                                <Form
                                                    decorators={[this.focusOnErrors]}
                                                    onSubmit={this.ArtistRegisterStep1}
                                                    initialValues={
                                                        StepData !== '' ? StepData : null
                                                    }
                                                    render={({ handleSubmit, form, submitting, pristine, values }) => (
                                                        <form onSubmit={handleSubmit}>
                                                            <Step1
                                                                Field={Field}
                                                                StepData={StepData}
                                                                onMapClick={this.onMapClick}
                                                                MobileValidator={MobileValidator}
                                                                ValidateShebaNum={ValidateShebaNum}
                                                            />

                                                            <SubmitSeciton
                                                                Text="ثبت اطلاعات و رفتن به مرحله ۲"
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
                                    {currentStep == 2 &&
                                        <React.Fragment>
                                            <Col xs={12}>
                                                <Form
                                                    decorators={[this.focusOnErrors]}
                                                    onSubmit={this.ArtistRegisterStep2}
                                                    initialValues={
                                                        StepData !== '' ? StepData : null
                                                    }
                                                    render={({ handleSubmit, form, submitting, pristine, values }) => (
                                                        <form onSubmit={handleSubmit}>
                                                            <Step2
                                                                Field={Field}
                                                                ValidateTextArea={ValidateTextArea}
                                                            />
                                                            <SubmitSeciton
                                                                Text="ثبت اطلاعات و رفتن به مرحله ۳"
                                                                StepData={StepData}
                                                                currentStep={currentStep}
                                                                values={values}
                                                                goToSteps={this.goToSteps}
                                                            />
                                                        </form>
                                                    )}
                                                />

                                            </Col>
                                        </React.Fragment>
                                    }
                                    {currentStep == 3 &&
                                        <React.Fragment>
                                            <Col xs={12}>
                                                <Form
                                                    decorators={[this.focusOnErrors]}
                                                    onSubmit={this.ArtistRegisterStep3}
                                                    mutators={{
                                                        ...arrayMutators,
                                                        setFieldData
                                                    }}
                                                    initialValues={
                                                        StepData !== '' ? StepData : null

                                                    }
                                                    render={({
                                                        handleSubmit,
                                                        mutators: { push, pop },
                                                        submitting,
                                                        pristine,
                                                        values

                                                    }) => (
                                                            <form onSubmit={handleSubmit}>

                                                                <Step3
                                                                    Field={Field}
                                                                    SingleEXBSubmit={this.SingleEXBSubmit}
                                                                    SingleArtSubmit={this.SingleArtSubmit}
                                                                    addExhibition={this.addExhibition}
                                                                    AddArt={this.AddArt}
                                                                    handleExhibition={this.handleExhibition}
                                                                    handleRemoveExbArt={this.handleRemoveExbArt}
                                                                    onChangeDatepicker={this.onChangeDatepicker}
                                                                    push={push}
                                                                    pop={pop}
                                                                    values={values}
                                                                    StepData={StepData}
                                                                    StepConfig={StepConfig}
                                                                />


                                                                <SubmitSeciton
                                                                    Text="ثبت اطلاعات و رفتن به مرحله ۴"
                                                                    StepData={StepData}
                                                                    currentStep={currentStep}
                                                                    values={values}
                                                                    goToSteps={this.goToSteps}
                                                                />
                                                            </form>
                                                        )}
                                                />

                                            </Col>

                                        </React.Fragment>
                                    }
                                    {currentStep == 4 &&
                                        <React.Fragment>
                                            <Col xs={12}>
                                                <Form
                                                    decorators={[this.focusOnErrors]}
                                                    onSubmit={this.ArtistRegisterStep4}
                                                    mutators={{
                                                        ...arrayMutators,
                                                        setFieldData
                                                    }}
                                                    initialValues={
                                                        StepData !== '' ? StepData : null

                                                    }
                                                    render={({
                                                        handleSubmit,
                                                        mutators: { push, pop },
                                                        submitting,
                                                        pristine,
                                                        values

                                                    }) => (
                                                            <form onSubmit={handleSubmit}>
                                                                <Step4
                                                                    Field={Field}
                                                                    Step4_addCollection={this.Step4_addCollection}
                                                                    Step4_SingleArtSubmit={this.Step4_SingleArtSubmit}
                                                                    Step4_SingleColSubmit={this.Step4_SingleColSubmit}
                                                                    Step4_onChangeType={this.Step4_onChangeType}
                                                                    AddArt={this.Step4_addArt}
                                                                    importArttoCollection={this.importArttoCollection}
                                                                    openArtModal={this.openArtModal}
                                                                    Step4_handleRemove={this.Step4_handleRemove}
                                                                    values={values}
                                                                    StepData={StepData}
                                                                    StepConfig={StepConfig}
                                                                    loadingDiv={loadingDiv}
                                                                    ModalToggle={ModalToggle}

                                                                />
                                                                <SubmitSeciton
                                                                    Text="ثبت نهایی اطلاعات"
                                                                    StepData={StepData}
                                                                    currentStep={currentStep}
                                                                    values={values}
                                                                    goToSteps={this.goToSteps}
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

export default withRouter(ArtistRegistration);
