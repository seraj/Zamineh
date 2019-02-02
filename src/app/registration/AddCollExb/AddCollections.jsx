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

import { Collection } from './Forms';


// import json from './ExJSON.json'



import {

    SingleCollectionValidation,
    SingleArtValidation,
    SingleCollectionArtValidation,
    CollectionAllArtValidation,
} from './Validation';
import styles from '../Registration.scss'


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
        {/*
            <pre>{JSON.stringify(values, 0, 2)}</pre>
        */}
    </React.Fragment>
);


class AddCollections extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            config: [],
            showForm: false,
            btnLoading: false,
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
            this.getFormData(parsed['collection_id'])
        }
    }
    btnSubmitLoading(value) {
        this.setState({
            btnLoading: value
        })
    }
    getFormData = (id) => {

        axios.get(`${Urls().api()}/gallery-app/collection/create-update/`, {
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


        var ArtValue = values.collection_set[ColIndex].art_set[Artindex];
        ArtValue.collection_id = values.collection_set[ColIndex].id;
        var ArtData = this.state.data.collection_set[ColIndex].art_set[Artindex];

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


    singleColSubmit = (values, ColIndex) => {
        const parsed = queryString.parse(location.search);


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
                }).then(() => {
                    if (parsed['xeYDSM2fWgsJvFuN'] == 'ios' && isMobile) {
                        // window.location.replace(`intent://whatever/#Intent;scheme=zamineh.panel.collection;package=com.nozhan.zaminehpanel;i.status=0/1;i.collection_id=${ColValue.id};end`)

                    }
                    else if (parsed['xeYDSM2fWgsJvFuN'] == 'android' && isMobile) {
                        window.location.replace(`intent://whatever/#Intent;scheme=zamineh.panel.collection;package=com.nozhan.zaminehpanel;i.status=0/1;i.collection_id=${ColValue.id};end`)

                    }
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
    }
    handleRemoveArt = (FARemove, values, ColIndex, ArtIndex) => {
        var collection_id = values.collection_set[ColIndex].id;
        var art_id = values.collection_set[ColIndex].art_set[ArtIndex].id;

        axios.get(`${Urls().api()}/gallery-app/artist/art/create-update/`, {
            params: {
                collection_id: collection_id,
                id: art_id,
                is_delete: true
            }
        })
            .then(response => {
                Toast('success', `اثر مورد نظر با موفقیت حذف شد`)
                FARemove.remove(ArtIndex)
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

    addCollection = async (pushFunction, values) => {
        var ColValue = values.collection_set
        if (ColValue.length > 0 && !SingleCollectionValidation(ColValue)) {
            Toast('warning', `ابتدا مجموعه قبلی را تکمیل کنید.`);
        } else {
            axios.get(`${Urls().api()}/gallery-app/collection/create-update/`,
                {
                    params: {
                        isAdd: true
                    }
                })
                .then(response => {
                    pushFunction(response.data.collection_set[0])
                })
        }
    }





    getArtsForImport = (page, id) => {
        axios.get(`${Urls().api()}/gallery-app/artist/art/list/`, {
            params: {
                page: page ? page : 1,
                collection_id: id && id,
                for_create: true
            }
        })
            .then(response => {
                response.data.results.length != 0 ?
                    this.setState({
                        importedArt: response.data.results,
                        modalPageCount: response.data.page_count,
                    })
                        .catch(error => {

                        })
                    :
                    Toast('warning', `شما هیچ اثری برای درون ریزی ندارید`);
                this.setState({
                    ModalToggle: false
                })

            })
    }



    importArtfunc = (pushFunction, ArtID, collection_id) => {
        axios.get(`${Urls().api()}/gallery-app/artist/art/create-update/`, {
            params: {
                id: ArtID,
                collection_id: collection_id
            }
        })
            .then(response => {
                pushFunction(response.data.art_set[0])
                this.getArtsForImport('', collection_id)
            })
    }
    handleModalPageClick = (data) => {
        let selected = data.selected + 1;
        this.setState({ selectedPage: selected, Loading: true }, () => {
            this.getArtsForImport(selected);
        });
    };

    openArtModal = (id) => {
        this.setState({
            ModalToggle: !this.state.ModalToggle
        })
        !this.state.ModalToggle ? this.getArtsForImport('', id) : null
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
            importedArt,
            modalPageCount,
            btnLoading,
            showForm
        } = this.state
        var hasToken = SecurityManager().hasArtistRegToken()
        return (
            <React.Fragment>
                <Container>
                    <Row>
                        <Col xs={12}>
                            <div className='section_header_single'>
                                <h1>ثبت مجموعه</h1>
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

                                                                <FieldArray name='collection_set'>
                                                                    {({ fields }) =>
                                                                        <React.Fragment>
                                                                            {fields.map((name, index) => (
                                                                                <React.Fragment>
                                                                                    <Collection
                                                                                        key={index}
                                                                                        name={name}
                                                                                        index={index}
                                                                                        onRemoveClick={() => this.handleRemove(fields, 'collection_id', values, index, null)}
                                                                                        handleRemove={this.handleRemoveArt}
                                                                                        singleColSubmit={this.singleColSubmit}
                                                                                        singleArtSubmit={this.singleArtSubmit}
                                                                                        addArt={this.AddSingleArt}

                                                                                        importArts={this.importArtfunc}
                                                                                        importedArt={importedArt}
                                                                                        artImportpageCount={modalPageCount}
                                                                                        openArtModal={this.openArtModal}
                                                                                        handleModalPageClick={this.handleModalPageClick}

                                                                                        ModalToggle={ModalToggle}
                                                                                        values={values}
                                                                                        data={data}
                                                                                        config={config}
                                                                                    />
                                                                                </React.Fragment>
                                                                            ))}
                                                                            {values && values.collection_set &&
                                                                                <Col lg={12} md={12} sm={12} xs={12}>
                                                                                    <div className={styles.addSectionButton}>
                                                                                        <button
                                                                                            type='button'
                                                                                            className=''
                                                                                            onClick={() => this.addCollection(fields.push, values)}>
                                                                                            <i></i>
                                                                                            <span>اضافه کردن مجموعه</span>
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
                                                        btnLoading={btnLoading}
                                                        values={values}

                                                    />

                                                </form>
                                            )}
                                    />}

                            </div>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}

export default withRouter(AddCollections);
