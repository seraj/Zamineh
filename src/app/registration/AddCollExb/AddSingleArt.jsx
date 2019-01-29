import React from 'react'
import axios from 'axios';
import queryString from 'query-string';
import { isMobile } from 'react-device-detect';
import { withRouter } from 'react-router-dom'
import Row from 'reactstrap/lib/Row';
import Container from 'reactstrap/lib/Container';
import Col from 'reactstrap/lib/Col';
import { Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'
import setFieldData from 'final-form-set-field-data'
import createDecorator from 'final-form-focus'
import { Toast } from '../../components/Toast/Toast';
import AuthorizationForm from '../components/AuthorizationForm'
import SecurityManager from '../../security/SecurityManager';
import Urls from '../../components/Urls';

import { SingleArt } from './Forms';

import Section from '../../components/Section/Section';

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
        {/*<pre>{JSON.stringify(values, 0, 2)}</pre>*/}
    </React.Fragment>
);


class AddSingleArt extends React.Component {

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
            this.getFormData(parsed['art_id'])
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

        axios.get(`${Urls().api()}/gallery-app/artist/art/create-update/`, {
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
    singleArtSubmit = (values, Artindex, ColIndex, ArtType) => {
        var ArtValue = '';
        var ArtData = '';
        if (ArtType === 'SingleArt') {
            ArtValue = values.art_set[Artindex];
            ArtData = this.state.data.art_set[Artindex]
        } else {
            ArtValue = values.collection_set[ColIndex].art_set[Artindex];
            ArtValue.collection_id = values.collection_set[ColIndex].id;
            ArtData = this.state.data.collection_set[ColIndex].art_set[Artindex];
        }
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
                .then(() => {
                    if (parsed['xeYDSM2fWgsJvFuN'] == 'ios' && isMobile) {
                        // window.location.replace(`intent://whatever/#Intent;scheme=zamineh.panel.collection;package=com.nozhan.zaminehpanel;i.status=0/1;i.collection_id=${ColValue.id};end`)

                    }
                    else if (parsed['xeYDSM2fWgsJvFuN'] == 'android' && isMobile) {
                        window.location.replace(`intent://whatever/#Intent;scheme=zamineh.panel.art;package=com.nozhan.zaminehpanel;i.status=0/1;art_id=${ArtValue.id};end`)

                    }
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

    }


    AddSingleArt = (pushFunction, ColID, values) => {

        const Body = {
            collection_id: ColID ? ColID : null
        }
        var ArtValue = values.art_set
        console.log(SingleCollectionArtValidation(ArtValue))
        if (ArtValue.length > 0 && !SingleCollectionArtValidation(ArtValue)) {
            Toast('warning', `ابتدا اثر قبلی را تکمیل کنید.`);
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
                    pushFunction(response.data.art_set[0])
                })
        }
    }

    onChangeType = (portfolio_type) => {
        this.setState({
            loadingDiv: portfolio_type
        })

        this.getFormData(portfolio_type)
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
                                    <h1>ثبت اثر</h1>
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
                                                                                        values={values}
                                                                                        singleArtSubmit={() => this.singleArtSubmit(values, index, null, 'SingleArt')}
                                                                                        hasExtraFields
                                                                                        onArtRemoveClick={() => this.handleRemove(fields, 'art_id', values, 'Col Index', index)}
                                                                                    />
                                                                                </React.Fragment>
                                                                            ))}
                                                                            {values && values.art_set &&
                                                                                <Col lg={6} md={6} sm={12} xs={12}>
                                                                                    <div className={styles.addSectionButton}>
                                                                                        <button
                                                                                            type='button'
                                                                                            className=''
                                                                                            onClick={() => this.AddSingleArt(fields.push, '', values)}>
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

export default withRouter(AddSingleArt);
