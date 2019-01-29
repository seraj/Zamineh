import React from 'react';
import {
    Button,
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
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Modal from '../../components/ui-components/Modal/Modal'
import { Field } from 'react-final-form-html5-validation'
import { FieldArray } from 'react-final-form-arrays'
import Divider from '../../components/Divider';
import Uploader from '../../components/Uploader';
import PersianDatePicker from '../../components/datepicker/PersianDatePicker';
import Alert from '../../components/Alert/Alert';
import { Loading } from '../../components/Spinner/Spinner';

import InputAsyncTypeahead from '../components/InputAsyncTypeahead';
import styles from '../Registration.scss'




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



const LinkButton = Button.withComponent('a')
const Error = ({ name }) => (
    <Field name={name} subscription={{ error: true, touched: true }}>
        {({ meta: { touched, error } }) =>
            touched && error ? (
                <ControlFeedback valid={!error}>{error}</ControlFeedback>
            ) : null
        }
    </Field>
);
const SubmittedArt = (Arts) => {
    return (
        Arts && Arts.filter(arts => {
            return arts.submitted === true;
        })
    )
}
const unSubmittedArt = (Arts) => {
    return (
        Arts.filter(arts => {
            return arts.submitted === false;
        })
    )

}
const Condition = ({ when, is, children }) => (
    <Field name={when} subscription={{ value: true }}>
        {({ input: { value } }) => (value === is ? children : null)}
    </Field>
);

export const Exhibition = ({
    singleArtSubmit,
    singleExbSubmit,
    data,
    config,
    onChangeDatepicker,
    addArt,
    importArts,
    openArtModal,
    ModalToggle,
    name,
    onRemoveClick,
    handleRemove,
    index,
    values }) => {
    const ExbIndex = index
    const ExbData = data.exb_set ? data.exb_set[ExbIndex] : null
    const unSubmittedArts = values.exb_set[ExbIndex] ? unSubmittedArt(values.exb_set[ExbIndex].art_set).length : null;

    const ServerData = data.exb_set ? data.exb_set[ExbIndex] : null;
    const ImageUploadServer = `/gallery-app/artist/show/upload-image/${values.exb_set[ExbIndex] ? values.exb_set[ExbIndex].id : ''}/image/`;
    const LogoUploadServer = `/gallery-app/artist/show/upload-image/${values.exb_set[ExbIndex] ? values.exb_set[ExbIndex].id : ''}/logo/`;


    return (
        <div className={`${styles.RegistrationSection} part ${ExbData && ExbData.submitted ? `submitted` : ``}`}>
            {ExbData && ExbData.loading &&
                <Loading />
            }
            <LinkButton onClick={onRemoveClick} className={styles.removethis}>حذف این نمایشگاه</LinkButton>
            <Row>
                <Field
                    name={`${name}.id`}
                    component={AdaptedInput}
                    hidden
                />
                <Col xs={12}>
                    <Divider text={`مشخصات نمایشگاه ${index + 1}`} orientation='right' />
                </Col>
                {unSubmittedArts > 0 &&
                    <Col xs={12}>
                        <Alert
                            message={`شما در این نمایشگاه ${unSubmittedArts} اثر ثبت نشده دارید.لطفا نسبت به تکمیل اطلاعات اثر اقدام نمایید`}
                            type='error'
                            style={{ marginBottom: 15 }}
                            icon
                            rtl
                        />
                    </Col>
                }
                <Col lg={3} md={4} sm={12} xs={12}>
                    <FormGroup>
                        <Label className={LabelRequired}>عنوان نمایشگاه</Label>
                        <Field
                            name={`${name}.title`}
                            component={AdaptedInput}
                            placeholder='عنوان نمایشگاه'
                            validate={value => value ? undefined : 'وارد کردن عنوان نمایشگاه مجموعه میباشد'}
                            control
                        />
                        <Error name={`${name}.name`} />
                    </FormGroup>
                </Col>
                <Col lg={9} md={8} sm={12} xs={12}>
                    <FormGroup>
                        <Label className={LabelRequired}>دلیل برگذاری نمایشگاه</Label>
                        <Field
                            name={`${name}.desc`}
                            component={AdaptedTextarea}
                            maxLength='500'
                            placeholder='...'
                            validate={value => value ? undefined : 'الزامی'}
                            control
                        />
                        <Error name={`${name}.desc`} />
                    </FormGroup>
                </Col>
                <Col xs={12}>
                    <Divider text={`زمان برگذاری`} orientation='right' />
                </Col>
                <Col lg={6} md={6} sm={12} xs={12}>
                    <FormGroup>
                        <Label className={LabelRequired}>تاریخ شروع نمایشگاه</Label>
                        <PersianDatePicker
                            name={`${name}.start_date`}
                            // defaultValue='1991-03-21'
                            onChangeDatepicker={onChangeDatepicker}
                        />
                        <Error name={`${name}.start_date`} />
                    </FormGroup>
                </Col>
                <Col lg={6} md={6} sm={12} xs={12}>
                    <FormGroup>
                        <Label className={LabelRequired}>تاریخ پایان نمایشگاه</Label>
                        <PersianDatePicker
                            name={`${name}.end_date`}
                            // defaultValue='1991-03-21'
                            onChangeDatepicker={onChangeDatepicker}
                        />
                        <Error name={`${name}.start_date`} />
                    </FormGroup>
                </Col>

                <Col lg={6} md={6} sm={12} xs={12}>
                    <FormGroup>
                        <Label className={LabelRequired}>ساعت شروع به کار نمایشگاه</Label>
                        <Field
                            type='time'
                            // min='12:00'
                            // rangeUnderflow='مقدار نمیتواند از ساعت فلان کمتر باشد'
                            // max='18:00'
                            // rangeOverflow='مقدار نمیتواند از ساعت فلان بیشتر باشد'
                            name={`${name}.start_time`}
                            component={AdaptedInput}
                            placeholder='شروع'
                            validate={value => value ? undefined : 'وارد کردن ساعت شروع نمایشگاه الزامی میباشد'}
                            control
                        />
                        <Error name={`${name}.start_time`} />
                    </FormGroup>
                </Col>
                <Col lg={6} md={6} sm={12} xs={12}>
                    <FormGroup>
                        <Label className={LabelRequired}>ساعت پایان به کار نمایشگاه</Label>
                        <Field
                            type='time'
                            // min='12:00'
                            // rangeUnderflow='مقدار نمیتواند از ساعت فلان کمتر باشد'
                            // max='18:00'
                            // rangeOverflow='مقدار نمیتواند از ساعت فلان بیشتر باشد'
                            name={`${name}.end_time`}
                            component={AdaptedInput}
                            placeholder='شروع'
                            validate={value => value ? undefined : 'وارد کردن ساعت پایان نمایشگاه الزامی میباشد'}
                            control
                        />
                        <Error name={`${name}.end_time`} />
                    </FormGroup>
                </Col>
                <Col xs={12}>
                    <Divider text='بارگذاری تصاویر نمایشگاه' orientation='right' />
                </Col>
                <Col lg={6} md={6} sm={12} xs={12}>
                    <Label className={LabelRequired}>لوگو نمایشگاه</Label>
                    <Uploader
                        server={LogoUploadServer}
                        name={`${name}.img`}
                        files={(ServerData && ServerData.logo && ServerData.logo.name) ? ServerData.logo.name : null}
                        Load={(ServerData && ServerData.logo && ServerData.logo.link) ? ServerData.logo.link : null}
                        allowImagePreview={false}
                    />
                </Col>
                <Col lg={6} md={6} sm={12} xs={12}>
                    <Label className={LabelRequired}>تصاویر نمایشگاه</Label>
                    <Uploader
                        server={ImageUploadServer}
                        name={`${name}.img`}
                        files={ServerData ? ServerData.img_set : null}
                        load={ServerData ? ServerData.img_set : null}
                        Multiple
                        maxFiles={50}
                        allowImagePreview={false}
                    />
                </Col>

                <Col xs={12}>
                    <Divider text='تمام آثار این مجموعه' orientation='right' />
                </Col>


                <FieldArray name={`${name}.art_set`}>
                    {({ fields }) =>
                        <React.Fragment>
                            {fields.map((name, index) => (
                                <SingleArt
                                    key={index}
                                    name={name}
                                    data={data}
                                    config={config}
                                    ServerData={data.exb_set ? data.exb_set[ExbIndex].art_set[index] : null}
                                    LocalData={values.exb_set[ExbIndex].art_set[index]}
                                    index={index}
                                    values={values}
                                    singleArtSubmit={() => singleArtSubmit(values, index, ExbIndex)}
                                    onArtRemoveClick={() => handleRemove(fields, 'art_id', values, ExbIndex, index, 'CollectionArt')}
                                />

                            ))}
                            <Col xs={12}>
                                <Row>

                                    <React.Fragment>
                                        <Col xs={12}>
                                            <div className={styles.addSectionButton}>
                                                <button
                                                    type='button'
                                                    className=''
                                                    onClick={() => addArt(fields.push, values.exb_set[ExbIndex].id, values.exb_set[ExbIndex])}>
                                                    <i></i>
                                                    <span>اضافه کردن اثر</span>
                                                </button>
                                            </div>
                                        </Col>
                                        {values.art_set && SubmittedArt(values.art_set).length > 0 &&
                                            <Col xs={6}>
                                                <div className={styles.importArtButton}>
                                                    <button
                                                        type='button'
                                                        className=''
                                                        onClick={() => openArtModal()}>
                                                        <i></i>
                                                        <span>درون ریزی آثار</span>
                                                    </button>
                                                </div>
                                                <Modal
                                                    isOpen={ModalToggle}
                                                    toggle={openArtModal}
                                                    className={styles.importArts}
                                                    title={'درون ریزی آثار مختلط'}
                                                >
                                                    <Row>
                                                        <Col xs={12}>
                                                            <p>شما میتوانید آثار ثبت شده را برای استفاده در این قسمت انتخاب کنید</p>
                                                        </Col>
                                                        {values && values.art_set &&
                                                            SubmittedArt(values.art_set).map((arts, index) => (
                                                                <Col key={index} xs={12}>
                                                                    <div className='_art'>
                                                                        {arts.name}
                                                                        <a
                                                                            className={`import-button`}
                                                                            onClick={() => importArts(index, arts.id, values.exb_set[ExbIndex].id)}>
                                                                        </a>
                                                                    </div>
                                                                </Col>

                                                            ))

                                                        }

                                                    </Row>
                                                </Modal>

                                            </Col>
                                        }

                                    </React.Fragment>

                                </Row>
                            </Col>
                        </React.Fragment>
                    }

                </FieldArray>

                <Col sm={12} className='text-left'>
                    <LinkButton
                        onClick={() => singleExbSubmit(values, ExbIndex)}
                        className='zbtn black bradius'
                    >ثبت نمایشگاه</LinkButton>
                </Col>
            </Row>
        </div >



    )
}














export const Collection = ({
    singleArtSubmit,
    singleColSubmit,
    data,
    config,
    addArt,
    importArttoCollection,
    openArtModal,
    ModalToggle,
    name,
    onCollectionRemoveClick,
    handleRemove,
    index,
    values }, ...props) => {
    const ColIndex = index
    const ColData = data.collection_set ? data.collection_set[index] : null
    const unSubmittedArts = values.collection_set[index] ? unSubmittedArt(values.collection_set[index].art_set).length : null;

    const ServerData = data.collection_set ? data.collection_set[ColIndex] : null;
    const CoverUploadServer = `/gallery-app/artist/collection/upload-image/${values.collection_set[ColIndex] ? values.collection_set[ColIndex].id : ''}/cover/`;
    const LogoUploadServer = `/gallery-app/artist/collection/upload-image/${values.collection_set[ColIndex] ? values.collection_set[ColIndex].id : ''}/logo/`;

    return (
        <div className={`${styles.RegistrationSection} part ${ColData && ColData.submitted ? `submitted` : ``}`}>
            {ColData && ColData.loading &&
                <Loading />
            }
            <LinkButton onClick={onCollectionRemoveClick} className={styles.removethis}>حذف این مجموعه</LinkButton>
            <Row>
                <Field
                    name={`${name}.id`}
                    component={AdaptedInput}
                    hidden
                />
                <Col xs={12}>
                    <Divider text={`مشخصات مجموعه ${index + 1}`} orientation='right' />
                </Col>
                {unSubmittedArts > 0 &&
                    <Col xs={12}>
                        <Alert
                            message={`شما در این مجموعه ${unSubmittedArts} اثر ثبت نشده دارید.لطفا نسبت به تکمیل اطلاعات اثر اقدام نمایید`}
                            type='error'
                            style={{ marginBottom: 15 }}
                            icon
                            rtl
                        />
                    </Col>
                }
                <Col lg={3} md={4} sm={12} xs={12}>
                    <FormGroup>
                        <Label className={LabelRequired}>نام مجموعه</Label>
                        <Field
                            name={`${name}.name`}
                            component={AdaptedInput}
                            placeholder='نام مجموعه'
                            validate={value => value ? undefined : 'وارد کردن نام مجموعه میباشد'}
                            control
                        />
                        <Error name={`${name}.name`} />
                    </FormGroup>
                </Col>
                <Col lg={9} md={8} sm={12} xs={12}>
                    <FormGroup>
                        <Label className={LabelRequired}>دلیل برگذاری را شرح دهید #مثلا</Label>
                        <Field
                            name={`${name}.desc`}
                            component={AdaptedTextarea}
                            maxLength='500'
                            placeholder='...'
                            validate={value => value ? undefined : 'الزامی'}
                            control
                        />
                        <Error name={`${name}.desc`} />
                    </FormGroup>
                </Col>
                <Col lg={6} md={6} sm={12} xs={12}>
                    <Label className={LabelRequired}>کاور مجموعه</Label>
                    <Uploader
                        server={CoverUploadServer}
                        name={`${name}.img`}
                        files={(ServerData && ServerData.cover && ServerData.cover.name) ? ServerData.cover.name : null}
                        Load={(ServerData && ServerData.cover && ServerData.cover.link) ? ServerData.cover.link : null}
                        // Multiple
                        // maxFiles={5}
                        allowImagePreview={false}
                    />
                </Col>
                <Col lg={6} md={6} sm={12} xs={12}>
                    <Label className={LabelRequired}>لوگو مجموعه</Label>
                    <Uploader
                        server={LogoUploadServer}
                        name={`${name}.img`}
                        files={(ServerData && ServerData.logo && ServerData.logo.link) ? ServerData.logo.name : null}
                        Load={(ServerData && ServerData.logo && ServerData.logo.link) ? ServerData.logo.link : null}

                        // Multiple
                        // maxFiles={5}
                        allowImagePreview={false}
                    />
                </Col>

                <Col xs={12}>
                    <Divider text='تمام آثار این مجموعه' orientation='right' />
                </Col>


                <FieldArray name={`${name}.art_set`}>
                    {({ fields }) =>
                        <React.Fragment>
                            {fields.map((name, index) => (
                                <SingleArt
                                    key={index}
                                    name={name}
                                    data={data}
                                    config={config}
                                    ServerData={data.collection_set ? data.collection_set[ColIndex].art_set[index] : null}
                                    LocalData={values.collection_set[ColIndex].art_set[index]}
                                    index={index}
                                    values={values}
                                    singleArtSubmit={() => singleArtSubmit(values, index, ColIndex)}
                                    onArtRemoveClick={() => handleRemove(fields, 'art_id', values, ColIndex, index, 'CollectionArt')}
                                />

                            ))}
                            <Col xs={12}>
                                <Row>

                                    <React.Fragment>
                                        <Col xs={12}>
                                            <div className={styles.addSectionButton}>
                                                <button
                                                    type='button'
                                                    className=''
                                                    onClick={() => addArt(fields.push, values.collection_set[ColIndex].id, values.collection_set[ColIndex])}>
                                                    <i></i>
                                                    <span>اضافه کردن اثر</span>
                                                </button>
                                            </div>
                                        </Col>
                                        {values.art_set && SubmittedArt(values.art_set).length > 0 &&
                                            <Col xs={6}>
                                                <div className={styles.importArtButton}>
                                                    <button
                                                        type='button'
                                                        className=''
                                                        onClick={() => openArtModal()}>
                                                        <i></i>
                                                        <span>درون ریزی آثار</span>
                                                    </button>
                                                </div>
                                                <Modal
                                                    isOpen={ModalToggle}
                                                    toggle={openArtModal}
                                                    className={styles.importArts}
                                                    title={'درون ریزی آثار مختلط'}
                                                >
                                                    <Row>
                                                        <Col xs={12}>
                                                            <p>شما میتوانید آثار ثبت شده را برای استفاده در این قسمت انتخاب کنید</p>
                                                        </Col>
                                                        {values && values.art_set &&
                                                            SubmittedArt(values.art_set).map((arts, index) => (
                                                                <Col key={index} xs={12}>
                                                                    <div className='_art'>
                                                                        {arts.name}
                                                                        <a
                                                                            className={`import-button`}
                                                                            onClick={() => importArttoCollection(index, arts.id, values.collection_set[ColIndex].id)}>
                                                                        </a>
                                                                    </div>
                                                                </Col>

                                                            ))

                                                        }

                                                    </Row>
                                                </Modal>

                                            </Col>
                                        }

                                    </React.Fragment>

                                </Row>
                            </Col>
                        </React.Fragment>
                    }

                </FieldArray>

                <Col sm={12} className='text-left'>
                    <LinkButton
                        onClick={() => singleColSubmit(values, ColIndex)}
                        className='zbtn black bradius'
                    >ثبت مجموعه</LinkButton>
                </Col>
            </Row>
        </div >



    )
}
export const SingleArt = ({
    singleArtSubmit,
    data,
    config,
    ServerData,
    LocalData,
    name,
    index,
    onArtRemoveClick,
    hasExtraFields,

    values
}) => {
    const UploadServer = `/gallery-app/artist/art/upload-image/${LocalData ? LocalData.id : ''}/`;
    return (
        <Col lg={6} md={6} sm={12} xs={12}>
            <div className={`_art ${ServerData && ServerData.submitted ? `submitted` : ``}`}>
                {ServerData && ServerData.loading &&
                    <Loading />
                }
                <LinkButton onClick={onArtRemoveClick} className={styles.removethis}>حذف این اثر</LinkButton>
                <Row>
                    <Field
                        name={`${name}.id`}
                        component={AdaptedInput}
                        hidden
                    />
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Divider text={`اثر شماره ${index + 1}`} orientation='right' />
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>نام اثر</Label>
                            <Field
                                name={`${name}.name`}
                                component={AdaptedInput}
                                placeholder='نام اثر'
                                validate={value => value ? undefined : 'وارد کردن نام اثر الزامی میباشد'}
                                control
                            />
                            <Error name={`${name}.name`} />
                        </FormGroup>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>سال تولید</Label>
                            <Field
                                name={`${name}.year`}
                                component={AdaptedInput}
                                placeholder='سال تولید اثر'
                                validate={value => value ? undefined : 'وارد کردن سال تولید اثر الزامی میباشد'}
                                control
                            />
                            <Error name={`${name}.year`} />
                        </FormGroup>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <FormGroup className={LabelRequired}>
                            <Label className={LabelRequired}>متریال اثر</Label>
                            <InputAsyncTypeahead
                                multiple
                                clearButton
                                name={`${name}.mat_set`}
                                api='/gallery-app/material/autocomplete/?phrase'
                                placeholder='متریال استفاده شده در اثر'
                                validate={value => value ? undefined : 'وارد کردن متریال الزامی میباشد'}
                            />
                            <Error name={`${name}.mat_set`} />
                        </FormGroup>
                    </Col>
                    {hasExtraFields &&
                        <Col lg={12} md={12} sm={12} xs={12}>
                            <FormGroup className={LabelRequired}>
                                <Label className={LabelRequired}>بستر اثر</Label>
                                <InputAsyncTypeahead
                                    clearButton
                                    name={`${name}.medium_set`}
                                    api='/gallery-app/medium/autocomplete/?phrase'
                                    placeholder='بستر استفاده شده در اثر'
                                    validate={value => value ? undefined : 'وارد کردن بستر الزامی میباشد'}
                                />
                                <Error name={`${name}.medium_set`} />
                            </FormGroup>
                        </Col>
                    }
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Divider text={`ابعاد اثر`} orientation='right' />
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>واحد</Label>
                            <Field
                                name={`${name}.size.unit`}
                                component={AdaptedSelect}
                                validate={value => value ? undefined : 'واردن کردن واحد الزامی میباشد'}
                                control
                                arrow={false}
                            >
                                <option value='' disabled>انتخاب واحد اندازه گیری</option>
                                {config && config.unit && config.unit.map((item, index) => (
                                    <option value={item.value} key={index}>{item.title}</option>
                                ))}
                            </Field>


                            <Error name={`${name}.size.unit`} />
                        </FormGroup>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>طول</Label>
                            <Field
                                name={`${name}.size.width`}
                                component={AdaptedInput}
                                placeholder='طول اثر'
                                validate={value => value ? undefined : 'وارد کردن طول اثر الزامی میباشد'}
                                control
                            />
                            <Error name={`${name}.size.width`} />
                        </FormGroup>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>ارتفاع</Label>
                            <Field
                                name={`${name}.size.height`}
                                component={AdaptedInput}
                                placeholder='ارتفاع اثر'
                                validate={value => value ? undefined : 'وارد کردن ارتفاع اثر الزامی میباشد'}
                                control
                            />
                            <Error name={`${name}.size.height`} />
                        </FormGroup>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>عمق</Label>
                            <Field
                                name={`${name}.size.depth`}
                                component={AdaptedInput}
                                placeholder='عمق اثر'
                                validate={value => value ? undefined : 'وارد کردن عمق اثر الزامی میباشد'}
                                control
                            />
                            <Error name={`${name}.size.depth`} />
                        </FormGroup>
                    </Col>
                    {LocalData && LocalData.price &&
                        <React.Fragment>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <Divider text={`مشخصات برای فروش اثر`} orientation='right' />
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={12}>
                                <FormGroup>
                                    <Label className={LabelRequired}>اثر برای فروش است؟</Label>
                                    <div className='clearfix' />
                                    <RadioGroup>
                                        <FormCheck inline>
                                            <Field
                                                name={`${name}.price.is_for_sale`}
                                                component={AdaptedRadio}
                                                type='radio'
                                                id='yes'
                                                value='yes'
                                            />
                                            <FormCheckLabel htmlFor='yes'>بله</FormCheckLabel>
                                        </FormCheck>
                                        <FormCheck inline>
                                            <Field
                                                name={`${name}.price.is_for_sale`}
                                                component={AdaptedRadio}
                                                type='radio'
                                                id='no'
                                                value='no'
                                            />
                                            <FormCheckLabel htmlFor='no'>خیر</FormCheckLabel>
                                        </FormCheck>
                                    </RadioGroup>
                                </FormGroup>
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={12}>
                                <FormGroup>
                                    <Label className={LocalData && LocalData.price.is_for_sale == 'yes' ? LabelRequired : ''}>قیمت اثر (تومان)</Label>
                                    <Field
                                        name={`${name}.price.price`}
                                        component={AdaptedInput}
                                        disabled={LocalData && LocalData.price.is_for_sale == 'yes' ? false : true}
                                        placeholder='قیمت اثر برای فروش'
                                        // validate={LocalData.price.is_for_sale == 'yes' ? value => value ? undefined : 'وارد کردن عمق اثر الزامی میباشد' : ''}
                                        control
                                    />
                                    <Error name={`${name}.price.price`} />
                                </FormGroup>
                            </Col>
                        </React.Fragment>
                    }
                    <Col xs={12}>
                        <Label className={LabelRequired}>بارگذاری آثار</Label>
                        <Uploader
                            server={UploadServer}
                            name={`${name}.img`}
                            files={ServerData ? ServerData.img_set : null}
                            load={ServerData ? ServerData.img_set : null}
                            Multiple
                            maxFiles={50}
                            allowImagePreview={false}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>درباره اثر</Label>
                            <Field
                                name={`${name}.bio`}
                                component={AdaptedTextarea}
                                maxLength='500'
                                placeholder=''
                                validate={value => value ? undefined : 'الزامی'}
                                control
                            />
                            <Error name={`${name}.bio`} />
                        </FormGroup>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <FormGroup>
                            <Label>جزئیات بیشتر در مورد اثر</Label>
                            <Field
                                name={`${name}.quote`}
                                component={AdaptedTextarea}
                                maxLength='500'
                                placeholder=''
                                control
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <LinkButton
                            onClick={singleArtSubmit}
                            className='zbtn black bradius d-block'
                        >ثبت</LinkButton>
                    </Col>
                </Row>
            </div>
        </Col>
    )
}