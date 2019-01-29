import React from 'react'
import axios from 'axios';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom'
import Row from 'reactstrap/lib/Row';
import Container from 'reactstrap/lib/Container';
import Col from 'reactstrap/lib/Col';

import { Form } from 'react-final-form';

import { Field } from 'react-final-form-html5-validation'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'
import setFieldData from 'final-form-set-field-data'
import createDecorator from 'final-form-focus'
import { Toast } from '../../components/Toast/Toast';
import AuthorizationForm from '../components/AuthorizationForm'


import SecurityManager from '../../security/SecurityManager';
import Urls from '../../components/Urls';

import { Exhibition } from './Forms';
import Section from '../../components/Section/Section';

import {
    Checkbox,
    ControlFeedback,
    FormCheck,
    FormCheckLabel,
    FormGroup,
    Input,
    Label,
    Radio,
    RadioGroup,
    Select,
    Textarea,
} from '@smooth-ui/core-sc';

import {

    SingleCollectionValidation,
    SingleArtValidation,
    SingleCollectionArtValidation,
    CollectionAllArtValidation,
} from './Validation';
import styles from '../Registration.scss'




const SubmitSeciton = ({ data, Text, values }) => (
    <React.Fragment>
        <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
                <Row className={`justify-content-center`}>

                    <Col lg={6} md={6} sm={12} xs={12}>
                        <button
                            type='submit'
                            style={{ width: '100%', marginBottom: 10 }}
                            disabled={data.SubmitBtnLoading}
                            variant='primary'
                            className={`zbtn next black bradius ${data.SubmitBtnLoading ? `spinning` : null}`}
                        >{Text} <i className='fas fa-angle-left' /></button>
                    </Col>
                </Row>
            </Col>

        </Row>
        {/* 
    <pre>{JSON.stringify(values, 0, 2)}</pre>
    */}
    </React.Fragment>
);



const adapt = Component => ({
    input,
    meta: { valid,
        touched },
    ...rest
}) => <Component {...input} {...rest} valid={touched ? valid : ''} />;
const AdaptedInput = adapt(Input);
const AdaptedCheckbox = adapt(Checkbox);
const AdaptedRadio = adapt(Radio);
const AdaptedSelect = adapt(Select);
const AdaptedTextarea = adapt(Textarea);
const LabelRequired = 'required';
const Error = ({ name }) => (
    <Field name={name} subscription={{ error: true, touched: true }}>
        {({ meta: { touched, error } }) =>
            touched && error ? (
                <ControlFeedback valid={!error}>{error}</ControlFeedback>
            ) : null
        }
    </Field>
);
class AddExhibitions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            config: [],
            showForm: false,
            ModalToggle: false
        }
    }
    componentDidMount() {
        this.detectParams()
    }

    handleSubmit = values => {
        // console.log(values)
    }
    detectParams = () => {
        const parsed = queryString.parse(location.search);
        if (SecurityManager().hasArtistRegToken()) {
            this.getFormData(parsed['exb_id'])
        }
    }
    btnSubmitLoading(value) {
        var data = this.state.data;
        data.SubmitBtnLoading = value;
        this.setState({
            data
        })
    }
    getFormData = (id) => {

        axios.get(`${Urls().api()}/gallery-app/artist/show/create-update/`, {
            params: id ? { id: id } : null
        })
            .then(response => {
                this.setState({
                    data: response.data,
                    showForm: true
                })
            })
            .then(() => {
                this.getFormConfig()
            })
    }
    getFormConfig = () => {
        axios.get(`${Urls().api()}/gallery-app/configs/`)
            .then(response => {
                this.setState({
                    config: response.data,
                    showForm: true
                })
            })

    }
    singleArtSubmit = (values, Artindex, ExbIndex, ArtType) => {


        var ArtValue = values.exb_set[ExbIndex].art_set[Artindex];
        ArtValue.exb_id = values.exb_set[ExbIndex].id;
        var ArtData = this.state.data.exb_set[ExbIndex].art_set[Artindex];

        if (!SingleArtValidation(ArtValue)) {
            Toast('warning', `لطفا تمام فیلدهای مربوط به اثر شماره ${Artindex + 1} را پر کنید`);
            console.log(ArtValue)
            ArtData.submitted = false;
            ArtValue.submitted = false
            this.setState({
                ArtData
            }, () => {
                this.forceUpdate()
            })
        } else if (ArtValue.price.is_for_sale === 'yes' && ArtValue.price.price == null) {
            Toast('warning', `لطفا قیمت مربوط به اثر شماره ${Artindex + 1} را وارد کنید کنید`);

        } else {
            ArtData.loading = true;
            this.setState({ ArtData })

            axios.post(`${Urls().api()}/gallery-app/artist/art/create-update/`, ArtValue, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
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


    singleExbSubmit = (values, ExbIndex) => {
        const ColID = values.exb_set[ExbIndex].id
        var ExbValue = values.exb_set[ExbIndex];
        var ExbData = this.state.data.exb_set[ExbIndex];

        if (!SingleCollectionValidation(ExbValue)) {
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
            Toast('warning', 'حداقل یک اثر باید برای نمایشگاه ثبت کنید');
        }
        else if (!CollectionAllArtValidation(ExbValue.art_set)) {
            Toast('warning', 'لطفا اطلاعات آثار را تکمیل نمایید');
        }
        else if (ExbValue.art_set.length < 1) {
            Toast('warning', 'هر نمایشگاه حداقل باید دارای 1 اثر باشد.');
        }
        else {
            ExbData.loading = true;
            this.setState({
                ExbData
            })
            axios.post(`${Urls().api()}/gallery-app/collection/create-update/`, ExbValue)
                .then(response => {
                    Toast('success', `نمایشگاه شماره ${ExbIndex + 1} با موفقیت ثبت شد`)
                    ExbData.loading = false;
                    ExbData.submitted = true;

                    this.setState({
                        ExbData,
                        successBox: true,
                        message: {
                            type: 'success',
                            title: 'ثبت موفق',
                            message: 'اطلاعات مورد نظر ثبت شده.بزودی به صفحه پروفایل انتقال میابید.',
                        },
                        timer: 1500,
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




    handleRemove = (FARemove, type, values, ExbIndex, ArtIndex, CollectionType) => {
        const CurrentIndex = type === 'exb_id' ? ExbIndex : ArtIndex;
        const Name = type === 'exb_id' ? 'نمایشگاه' : 'اثر';
        var ID = ''
        if (type === 'exb_id') {
            ID = values.exb_set[ExbIndex].id
        } else if (type === 'art_id' && CollectionType === 'CollectionArt') {
            ID = values.exb_set[ExbIndex].art_set[ArtIndex].id;
        }
        else {
            ID = values.art_set[ArtIndex].id
        }

        axios.delete(`${Urls().api()}/gallery-app/artist/show/create-update/?id=${ID}`).then(response => {
            Toast('success', `${Name} مورد نظر با موفقیت حذف شد`)
            FARemove.remove(CurrentIndex)
        })
    }


    AddSingleArt = (pushFunction, ExbID, values) => {
        var ArtValue = values.art_set
        console.log(SingleCollectionArtValidation(ArtValue))
        if (ArtValue.length > 0 && !SingleCollectionArtValidation(ArtValue)) {
            Toast('warning', `ابتدا اثر قبلی را تکمیل کنید.`);
        } else {
            axios
                .get(`${Urls().api()}/gallery-app/artist/art/create-update/`,
                    {
                        params: {
                            exb_id: ExbID ? ExbID : null,
                            isAdd: true
                        }
                    })
                .then(response => {
                    pushFunction(response.data.art_set[0])
                })
        }
    }

    addExhibition = async (pushFunction, values) => {
        var ExbValue = values.exb_set
        if (ExbValue.length > 0 && !SingleCollectionValidation(ExbValue)) {
            Toast('warning', `ابتدا نمایشگاه قبلی را تکمیل کنید.`);
        } else {
            axios.get(`${Urls().api()}/gallery-app/collection/create-update/`,
                {
                    params: {
                        isAdd: true
                    }
                })
                .then(response => {
                    pushFunction(response.data.exb_set[0])
                })
        }
    }
    importArttoExb = (Artindex, ArtID, CollectionID) => {
        var ArtData = this.state.data.art_set
        console.log(ArtID, CollectionID)
        axios.post(`${Urls().api()}/gallery-app/artist/portfolio-step4/import/`, {
            art_id: ArtID,
            exb_id: CollectionID
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
    }


    openArtModal = () => {
        this.setState({
            ModalToggle: !this.state.ModalToggle
        })
    }

    setAccessTokens = (Token, RefreshToken) => {
        SecurityManager().setArtistRegAccessToken(Token);
        SecurityManager().setArtistRegRefreshToken(RefreshToken);
    }
    focusOnErrors = createDecorator()

    render() {
        const {
            data,
            config,
            ModalToggle,
            loadingDiv,
            type,
            showForm
        } = this.state
        var hasToken = SecurityManager().hasArtistRegToken()
        return (
            <React.Fragment>
                <Section ExtraClass={'content singlePage'}>
                    <Container>
                        <Row>
                            <Col xs={12}>
                                <div className='section_header_single'>
                                    <h1>ثبت نمایشگاه</h1>
                                </div>
                            </Col>
                            <Col xs={12}>
                                <div className={styles.RegistrationSection}>
                                    {!hasToken &&
                                        <AuthorizationForm
                                            afterLogin={this.getFormData}
                                            checkMobileAPI='/gallery-app/gallery/check/'
                                            validationAPI='/gallery-app/phone/validate/'
                                            loginAPI='/gallery-app/gallery/login/'
                                            type='Artist'
                                            setAccessTokens={this.setAccessTokens}
                                        />
                                    }
                                    {showForm &&
                                        <Form
                                            decorators={[this.focusOnErrors]}
                                            onSubmit={this.handleSubmit}
                                            mutators={{
                                                ...arrayMutators,
                                                setFieldData
                                            }}
                                            initialValues={
                                                data !== '' ? data : null
                                            }
                                            render={({
                                                handleSubmit,
                                                mutators: { push, pop },
                                                submitting,
                                                pristine,
                                                values

                                            }) => (
                                                    <form onSubmit={handleSubmit}>
                                                        <Row>

                                                            <React.Fragment>

                                                                <Col lg={12} md={12} sm={12} xs={12}>

                                                                    <FieldArray name='exb_set'>
                                                                        {({ fields }) =>
                                                                            <React.Fragment>
                                                                                {fields.map((name, index) => (
                                                                                    <React.Fragment>
                                                                                        <Exhibition
                                                                                            key={index}
                                                                                            name={name}
                                                                                            index={index}
                                                                                            onCollectionRemoveClick={() => this.handleRemove(fields, 'exb_id', values, index, null)}
                                                                                            handleRemove={this.handleRemove}
                                                                                            input={AdaptedInput}
                                                                                            select={AdaptedSelect}
                                                                                            radio={AdaptedRadio}
                                                                                            textarea={AdaptedTextarea}
                                                                                            LabelRequired={LabelRequired}
                                                                                            singleExbSubmit={this.singleExbSubmit}
                                                                                            singleArtSubmit={this.singleArtSubmit}
                                                                                            addArt={this.AddSingleArt}
                                                                                            importArts={this.importArttoExb}
                                                                                            openArtModal={this.openArtModal}
                                                                                            ModalToggle={ModalToggle}
                                                                                            values={values}
                                                                                            data={data}
                                                                                            config={config}
                                                                                        />
                                                                                    </React.Fragment>
                                                                                ))}
                                                                                {values && values.exb_set &&
                                                                                    <Col lg={12} md={12} sm={12} xs={12}>
                                                                                        <div className={styles.addSectionButton}>
                                                                                            <button
                                                                                                type='button'
                                                                                                className=''
                                                                                                onClick={() => this.addExhibition(fields.push, values)}>
                                                                                                <i></i>
                                                                                                <span>اضافه کردن نمایشگاه</span>
                                                                                            </button>
                                                                                        </div>
                                                                                    </Col>
                                                                                }
                                                                            </React.Fragment>
                                                                        }
                                                                    </FieldArray>
                                                                </Col>

                                                            </React.Fragment>
                                                        </Row>

                                                        <SubmitSeciton
                                                            Text='ثبت نهایی'
                                                            data={data}
                                                            values={values}

                                                        />

                                                    </form>
                                                )}
                                        />}

                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Section>
            </React.Fragment>
        )
    }
}

export default withRouter(AddExhibitions);
