import React from 'react'
import axios from 'axios';
import moment from 'moment-jalaali';
import queryString from 'query-string';
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

import { Exhibition } from './Forms';



import {
    SingleExhibitionValidation,
    SingleArtValidation,
    SingleCollectionArtValidation,
    CollectionAllArtValidation,
} from './Validation';
import styles from '../Registration.scss'



const SubmitSeciton = ({ btnLoading, Text, values }) => (
    <>
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
    </>
);


class AddExhibitions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            importedArt: [],
            modalPageCount: '',
            Maplatlng: [],
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
            this.getFormData(parsed['exb_id'])
        }
    }
    btnSubmitLoading(value) {
        this.setState({
            btnLoading: value
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
        var ExbValue = values.exb_set[ExbIndex];
        var ExbData = this.state.data.exb_set[ExbIndex];


        if (
            ExbData.address.lat == null
                ?
                (this.state.Maplatlng.lat == '' || this.state.Maplatlng.lat == undefined)
                :
                (ExbValue.address.lat == '' || ExbValue.address.lat == undefined)
        ) {
            Toast('warning', 'لطفا آدرس دقیق را روی نقشه انتخاب کنید');

        } else if (!SingleExhibitionValidation(ExbValue)) {
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
            axios.post(`${Urls().api()}/gallery-app/artist/show/create-update/`, ExbValue)
                .then(response => {
                    Toast('success', `نمایشگاه شماره ${ExbIndex + 1} با موفقیت ثبت شد`)
                    ExbData.loading = false;
                    ExbData.submitted = true;
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

    handleRemoveArt = (FARemove, values, ExbIndex, ArtIndex, isAccepted) => {
        var show_id = values.exb_set[ExbIndex].id;
        var art_id = values.exb_set[ExbIndex].art_set[ArtIndex].id;
        if (isAccepted) {
            axios.get(`${Urls().api()}/gallery-app/artist/art/create-update/`, {
                params: {
                    show_id: show_id,
                    id: art_id,
                    is_delete: true
                }
            })
                .then(response => {
                    Toast('success', `اثر مورد نظر با موفقیت از مجموعه برداشته شد`)
                    FARemove.remove(ArtIndex)
                })
        } else {
            axios.delete(`${Urls().api()}/gallery-app/artist/art/create-update/`, {
                params: {
                    id: art_id,
                }
            })
                .then(response => {
                    Toast('success', `اثر مورد نظر با موفقیت از زمینه حذف شد`)
                    FARemove.remove(ArtIndex)
                })
        }
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
                    console.log(response.data.art_set[0])
                    pushFunction(response.data.art_set[0])
                })
        }
    }

    addExhibition = async (pushFunction, values) => {
        var ExbValue = values.exb_set
        if (ExbValue.length > 0 && !SingleExhibitionValidation(ExbValue)) {
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


    onMapClick = (event) => {
        this.setState({
            Maplatlng: event.latlng
        })
        // console.log(this.state.Maplatlng)
    }

    onChangeDatepicker = async (value, index, name) => {
        var currentValue = this.state.data.exb_set[index]
        const date = await `${value.jYear()}-${value.jMonth() + 1}-${value.jDate()}`;
        const endate = moment(date, 'jYYYY-jM-jD').format('YYYY-MM-DD');
        currentValue[name] = endate
        this.setState({ currentValue })
    }


    getArtsForImport = (page, id) => {
        axios.get(`${Urls().api()}/gallery-app/artist/art/list/`, {
            params: {
                page: page ? page : 1,
                show_id: id && id,
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

    importArtfunc = (pushFunction, ArtID, show_id) => {
        axios.get(`${Urls().api()}/gallery-app/artist/art/create-update/`, {
            params: {
                id: ArtID,
                show_id: show_id
            }
        })
            .then(response => {
                pushFunction(response.data.art_set[0])
                this.getArtsForImport('', show_id)
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
            <>
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

                                                        <>

                                                            <Col lg={12} md={12} sm={12} xs={12}>

                                                                <FieldArray name='exb_set'>
                                                                    {({ fields }) =>
                                                                        <>
                                                                            {fields.map((name, index) => (
                                                                                <>
                                                                                    <Exhibition
                                                                                        type="artist"
                                                                                        key={index}
                                                                                        name={name}
                                                                                        index={index}
                                                                                        onRemoveClick={() => this.handleRemove(fields, 'exb_id', values, index, null)}
                                                                                        handleRemove={this.handleRemoveArt}

                                                                                        onChangeDatepicker={this.onChangeDatepicker}
                                                                                        singleExbSubmit={this.singleExbSubmit}
                                                                                        singleArtSubmit={this.singleArtSubmit}
                                                                                        addArt={this.AddSingleArt}
                                                                                        onMapClick={this.onMapClick}

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
                                                                                </>
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
                                                                        </>
                                                                    }
                                                                </FieldArray>
                                                            </Col>

                                                        </>
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
            </>
        )
    }
}

export default withRouter(AddExhibitions);
