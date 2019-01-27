import React from 'react';
import {
    FormCheck,
    ControlFeedback,
    FormCheckLabel,
    FormGroup,
    Label,
    Button,
    RadioGroup,

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

export const Collection = ({
    singleArtSubmit,
    singleColSubmit,
    data,
    config,
    input,
    select,
    radio,
    textarea,
    LabelRequired,
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
                    component={input}
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
                            component={input}
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
                            component={textarea}
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
                                    ServerData={data.collection_set[ColIndex].art_set[index]}
                                    LocalData={values.collection_set[ColIndex].art_set[index]}
                                    index={index}
                                    input={input}
                                    radio={radio}
                                    textarea={textarea}
                                    select={select}
                                    hasExtraFields
                                    values={values}
                                    LabelRequired={LabelRequired}
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
                                                    onClick={() => addArt(fields.push, values.collection_set[ColIndex].id)}>
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
    input,
    select,
    radio,
    textarea,
    data,
    config,
    ServerData,
    LocalData,
    name,
    index,
    onArtRemoveClick,
    hasExtraFields,
    LabelRequired,
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
                        component={input}
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
                                component={input}
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
                                component={input}
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
                                component={select}
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
                                component={input}
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
                                component={input}
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
                                component={input}
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
                                                component={radio}
                                                type='radio'
                                                id='yes'
                                                value='yes'
                                            />
                                            <FormCheckLabel htmlFor='yes'>بله</FormCheckLabel>
                                        </FormCheck>
                                        <FormCheck inline>
                                            <Field
                                                name={`${name}.price.is_for_sale`}
                                                component={radio}
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
                                        component={input}
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
                                component={textarea}
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
                                component={textarea}
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