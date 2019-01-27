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

import { Collection, SingleArt } from './Forms';

import Section from '../../components/Section/Section';

import Alert from '../../components/Alert/Alert';
import Divider from '../../components/Divider';

import json from './ExJSON.json'

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
        <pre>{JSON.stringify(values, 0, 2)}</pre>
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
class AddSingleArtForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            config: [],
            showForm: false,
            loadingDiv: '',
            type: '',
            ModalToggle: false
        }
    }
    componentDidMount() {
        const parsed = queryString.parse(location.search);
        let type = '';
        if (parsed['collection_id'] || parsed['art_id']) {
            type = parsed['collection_id'] ? 'collection' : 'art'
            console.log(type)
        } else {
            type = 'collection';
        }

        var idname = type == 'collection' ? parsed['collection_id'] : parsed['art_id']
        if (SecurityManager().hasArtistRegToken()) {
            this.getFormData(type, idname)
        }
    }



    focusOnErrors = createDecorator()
    handleSubmit = values => {
        // console.log(values)
    }

    btnSubmitLoading(value) {
        var data = this.state.data;
        data.SubmitBtnLoading = value;
        this.setState({
            data
        })
    }
    getFormData = (type, id) => {
        let Type = type == 'art' ? 'artist/art' : 'collection'
        axios.get(`${Urls().api()}/gallery-app/${Type}/create-update/`, {
            params: id ? { id: id } : null
        })
            .then(response => {
                this.setState({
                    data: response.data,
                    showForm: true,
                    type: type,
                    loadingDiv: ''
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
    singleArtSubmit = (values, Artindex, ColIndex, ArtType) => {
        var ArtValue = '';
        var ArtData = '';
        if (ArtType === 'SingleArt') {
            ArtValue = values.art_set[Artindex];
            ArtData = this.state.data.art_set[Artindex]
        } else {
            ArtValue = values.collection_set[ColIndex].art_set[Artindex];
            ArtData = this.state.data.collection_set[ColIndex].art_set[Artindex];
        }
        console.log(ArtValue)

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
            this.setState({
                ArtData
            })
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


    singleColSubmit = (values, ColIndex) => {
        const ColID = values.collection_set[ColIndex].id
        var ColValue = values.collection_set[ColIndex];
        var ColData = this.state.data.collection_set[ColIndex];

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
            Toast('warning', 'حداقل یک اثر باید برای مجموعه ثبت کنید');
        }
        else if (!CollectionAllArtValidation(ColValue.art_set)) {
            Toast('warning', 'لطفا اطلاعات آثار را تکمیل نمایید');
        }
        else if (ColValue.art_set.length < 1) {
            Toast('warning', 'هر مجموعه حداقل باید دارای 1 اثر باشد.');
        }
        else {
            ColData.loading = true;
            this.setState({
                ColData
            })
            axios.post(`${Urls().api()}/gallery-app/collection/create-update/`, ColValue)
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
                        timer: 1500,
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




    handleRemove = (FARemove, type, values, ColIndex, ArtIndex, CollectionType) => {
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

        axios.delete(`${Urls().api()}/gallery-app/artist/art/create-update/?id=${ID}`).then(response => {
            Toast('success', `${Name} مورد نظر با موفقیت حذف شد`)
            FARemove.remove(CurrentIndex)
        })
            .catch(error => {

            })
    }


    AddSingleArt = (pushFunction, ColID, values) => {

        const Body = {
            collection_id: ColID ? ColID : null
        }
        var ArtValue = values.art_set
        if (!SingleArtValidation(ArtValue)) {
            Toast('warning', `ابتدا اثر فعلی را تکمیل کنی.`);
        } else {
            axios
                .get(`${Urls().api()}/gallery-app/artist/art/create-update/`,
                    {
                        params: {
                            collection_id: ColID ? ColID : null,
                            isAdd: true
                        }
                    })
                .then(response => {
                    pushFunction({ id: response.data.id })
                }).then(() => {
                    // this.getFormData()
                })
                .catch(error => {

                })
        }
    }

    addCollection = async (pushFunction, type) => {
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
    importArttoCollection = (Artindex, ArtID, CollectionID) => {
        var ArtData = this.state.data.art_set
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

    onChangeType = (portfolio_type) => {
        this.setState({
            loadingDiv: portfolio_type
        })

        this.getFormData(portfolio_type === 'art' ? 'art' : 'collection')
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
                                    <h1>ثبت مجموعه و اثر</h1>
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
                                                                    <FormGroup>
                                                                        <Label className={LabelRequired}>نوع ثبت اثر (تکی یا مجموعه)</Label>
                                                                        <div className='clearfix'></div>
                                                                        <div className={styles.CustomBox}>
                                                                            <RadioGroup>
                                                                                <FormCheck inline>
                                                                                    <Field
                                                                                        name='type'
                                                                                        component={AdaptedRadio}
                                                                                        type='radio'
                                                                                        id='art'
                                                                                        value='art'
                                                                                        onChange={() => this.onChangeType('art')}
                                                                                    />
                                                                                    <FormCheckLabel htmlFor='art' className={`${type == 'art' ? `checked` : ``} ${loadingDiv == 'art' ? `spinning` : ``}`}>اثر</FormCheckLabel>
                                                                                </FormCheck>
                                                                                <FormCheck inline>
                                                                                    <Field
                                                                                        name='type'
                                                                                        component={AdaptedRadio}
                                                                                        type='radio'
                                                                                        hidden
                                                                                        id='collection_arts'
                                                                                        value='collection_arts'
                                                                                        onChange={() => this.onChangeType('collection_arts')}
                                                                                    />
                                                                                    <FormCheckLabel htmlFor='collection_arts' className={`${type == 'collection' ? `checked` : ``} ${loadingDiv == 'collection_arts' ? `spinning` : ``}`}>مجموعه</FormCheckLabel>
                                                                                </FormCheck>
                                                                            </RadioGroup>
                                                                            <Error name='type' />
                                                                        </div>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col lg={12} md={12} sm={12} xs={12}>

                                                                    <FieldArray name='collection_set'>
                                                                        {({ fields }) =>
                                                                            <React.Fragment>
                                                                                {fields.map((name, index) => (
                                                                                    <React.Fragment>
                                                                                        <Collection
                                                                                            key={index}
                                                                                            name={name}
                                                                                            index={index}
                                                                                            onCollectionRemoveClick={() => this.handleRemove(fields, 'collection_id', values, index, null)}
                                                                                            handleRemove={this.handleRemove}
                                                                                            input={AdaptedInput}
                                                                                            select={AdaptedSelect}
                                                                                            radio={AdaptedRadio}
                                                                                            textarea={AdaptedTextarea}
                                                                                            LabelRequired={LabelRequired}
                                                                                            singleColSubmit={this.singleColSubmit}
                                                                                            singleArtSubmit={this.singleArtSubmit}
                                                                                            addArt={this.AddSingleArt}
                                                                                            importArttoCollection={this.importArttoCollection}
                                                                                            openArtModal={this.openArtModal}
                                                                                            ModalToggle={ModalToggle}
                                                                                            values={values}
                                                                                            data={data}
                                                                                            config={config}
                                                                                        />
                                                                                    </React.Fragment>
                                                                                ))}

                                                                            </React.Fragment>
                                                                        }
                                                                    </FieldArray>
                                                                </Col>

                                                                <FieldArray name='art_set'>
                                                                    {({ fields }) =>
                                                                        <React.Fragment>
                                                                            {fields.map((name, index) => (
                                                                                <React.Fragment>
                                                                                    <SingleArt
                                                                                        key={index}
                                                                                        name={name}
                                                                                        data={data}
                                                                                        config={config}
                                                                                        ServerData={data.art_set ? data.art_set[index] : null}
                                                                                        LocalData={values.art_set[index]}
                                                                                        index={index}
                                                                                        input={AdaptedInput}
                                                                                        select={AdaptedSelect}
                                                                                        textarea={AdaptedTextarea}
                                                                                        radio={AdaptedRadio}
                                                                                        values={values}
                                                                                        LabelRequired={LabelRequired}
                                                                                        singleArtSubmit={() => this.singleArtSubmit(values, index, null, 'SingleArt')}
                                                                                        hasExtraFields
                                                                                        onArtRemoveClick={() => handleRemove(fields, 'art_id', values, 'Col Index', index)}
                                                                                    />
                                                                                </React.Fragment>
                                                                            ))}
                                                                            {values && values.art_set &&
                                                                                <Col lg={6} md={6} sm={12} xs={12}>
                                                                                    <div className={styles.addSectionButton}>
                                                                                        <button
                                                                                            type='button'
                                                                                            className=''
                                                                                            onClick={() => this.AddSingleArt(fields.push, 'Art', values)}>
                                                                                            <i></i>
                                                                                            <span>اضافه کردن اثر</span>
                                                                                        </button>
                                                                                    </div>
                                                                                </Col>
                                                                            }
                                                                        </React.Fragment>
                                                                    }
                                                                </FieldArray>
                                                            </React.Fragment>
                                                        </Row>
                                                        {/*
                                                                    <SubmitSeciton
                                                                    Text='ثبت نهایی'
                                                                    data={data}
                                                                    values={values}
                                                                    
                                                                    />
                                                        */}
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

export default withRouter(AddSingleArtForm);
