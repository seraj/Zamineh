import React from 'react';
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";

import { Field } from 'react-final-form-html5-validation'
import { FieldArray } from 'react-final-form-arrays'
import Steps, { Step } from 'rc-steps';
import 'rc-steps/assets/iconfont.css';
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
} from "@smooth-ui/core-sc";
import Alert from "../../components/Alert/Alert";
import InputTypeahead from "../components/InputTypeahead";
import InputAsyncTypeahead from "../components/InputAsyncTypeahead";
import { Exhibition, Collection, SingleArt } from "./CustomArtistForm";
import ZaminehMap from '../../components/map/ZaminehMap';



import Divider from "../../components/Divider";
import Uploader from "../../components/Uploader";

import styles from "../Registration.scss"


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

export const StepBar = ({ currentStep }) => {
    return (
        <Steps labelPlacement="vertical" current={currentStep - 1} status="process">
            <Step title="مشخصات هنرمند" />
            <Step title="زندگی نامه" />
            <Step title="نمایشگاه‌ها و آثار هنرمند" />
            <Step title="آثار برای داوری" />
        </Steps>
    );
}
export const Step1 = ({
    Field,
    StepData,
    MobileValidator,
    ValidateShebaNum,
    onMapClick
}) => {
    return (
        <React.Fragment>
            <div className={styles.RegistrationSection}>
                <Row>
                    <Field
                        name={`lat`}
                        component={AdaptedInput}
                        hidden
                    />
                    <Field
                        name={`lng`}
                        component={AdaptedInput}
                        hidden
                    />
                    <Col xs={12}>
                        <Divider text="مشخصات فردی" />
                    </Col>
                    <Col lg={4} md={4} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>نام</Label>
                            <Field
                                name="first_name"
                                component={AdaptedInput}
                                placeholder="نام"
                                validate={value => value ? undefined : "وارد کردن نام الزامی میباشد"}
                                control
                            />
                            <Error name="first_name" />
                        </FormGroup>
                    </Col>
                    <Col lg={4} md={4} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>نام خانوادگی</Label>
                            <Field
                                name="last_name"
                                component={AdaptedInput}
                                placeholder="نام خانوادگی"
                                validate={value => value ? undefined : "وارد کردن نام خانوادگی الزامی میباشد"}
                                control
                            />
                            <Error name="last_name" />
                        </FormGroup>
                    </Col>
                    <Col lg={4} md={4} sm={12} xs={12}>
                        <FormGroup>
                            <Label>عکس پروفایل</Label>
                            <Uploader
                                server='/gallery-app/artist/profile-pic/'
                                name="profile_pic"
                                files={StepData ? StepData.profile_pic : null}
                            />


                        </FormGroup>
                    </Col>
                </Row>
            </div>
            <div className={styles.RegistrationSection}>
                <Row>
                    <Col xs={12}>
                        <Divider text="نشانی فلان" />
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>آدرس</Label>
                            <Field
                                name="address"
                                component={AdaptedTextarea}
                                placeholder="آدرس"
                                minHeight="150px"
                                validate={value => value ? undefined : "وارد کردن آدرس الزامی میباشد"}
                                control
                            />
                            <Error name="address" />
                        </FormGroup>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>آدرس روی نقشه</Label>
                            {StepData && StepData.lat &&
                                <ZaminehMap
                                    onClick={onMapClick}
                                    mapPosition={StepData.lat != null ? [StepData.lat, StepData.lng] : null}
                                    markerPosition={StepData.lat != null ? [StepData.lat, StepData.lng] : null}
                                    mapZoom={18}
                                    currentLocation={StepData.lat != null ? false : true}
                                />
                            }
                            {!StepData && !StepData.lat &&
                                <ZaminehMap
                                    onClick={onMapClick}
                                    mapZoom={18}
                                    currentLocation={true}
                                />
                            }

                        </FormGroup>
                    </Col>
                </Row>
            </div>
            <div className={styles.RegistrationSection}>
                <Row>
                    <Col xs={12}>
                        <Divider text="اطلاعات تماس" />
                    </Col>
                    <Col lg={4} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>ایمیل</Label>
                            <Field
                                name="email"
                                component={AdaptedInput}
                                placeholder="ایمیل"
                                validate={value => value ? undefined : "وارد کردن ایمیل الزامی میباشد"}
                                control
                            />
                            <Error name="email" />
                        </FormGroup>
                    </Col>
                    <Col lg={4} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label>وبسایت</Label>
                            <Field
                                name="website"
                                component={AdaptedInput}
                                placeholder="وبسایت"
                                // validate={value => value ? undefined : "وارد کردن وبسایت الزامی میباشد"}
                                control
                            />
                            <Error name="website" />
                        </FormGroup>
                    </Col>
                    <Col lg={4} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>شماره تماس</Label>
                            <Field
                                name="phone_num"
                                component={AdaptedInput}
                                placeholder="شماره تماس"
                                validate={MobileValidator}
                                control
                            />
                            <Error name="phone_num" />
                        </FormGroup>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label>شماره شبا</Label>
                            <Field
                                name="sheba_num"
                                component={AdaptedInput}
                                placeholder="شماره شبا"
                                validate={ValidateShebaNum}
                                control
                            />
                            <Error name="sheba_num" />
                        </FormGroup>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label>انتخاب گالری</Label>
                            <InputAsyncTypeahead
                                name="gallery"
                                api="/gallery-app/gallery/autocomplete/?phrase"
                                placeholder="جستجوی گالری مد نظر"
                            // validate={value => value ? undefined : "وارد کردن نام گالری الزامی میباشد"}
                            />
                            <Error name="gallery" />
                        </FormGroup>
                    </Col>
                </Row>
                <Alert
                    message="..."
                    type="warning"
                />

            </div>
        </React.Fragment>
    )
}

export const Step2 = ({ Field, ValidateTextArea }) => {
    return (
        <React.Fragment>
            <div className={styles.RegistrationSection}>
                <Row>
                    <Col xs={12}>
                        <Divider text="زندگی نامه" />
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={12}>

                        <FormGroup>
                            <Label className={LabelRequired}>زندگینامه</Label>
                            <Field
                                name="bio"
                                component={AdaptedTextarea}
                                maxHeight="200px"
                                minHeight="150px"
                                validate={ValidateTextArea}
                                row="10"

                                tooShort="حداقل ۵۰۰ کلمه باید بنویسید"
                                placeholder="بیوگرافی حرفه‌ای شما"
                                // validate={value => value ? undefined : "وارد کردن زندگینامه میباشد"}
                                control
                            />
                            <Error name="bio" />
                        </FormGroup>

                        <Alert
                            message="محدودیت برای زندگی نامه"
                            description="زندگی نامه شما میبایست حداقل ۵۰۰ کلمه داشته باشد"
                            type="warning"
                            closable />

                    </Col>

                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Divider text={`عنوان مناسبی پیدا نکردم!`} />
                    </Col>
                    <Col lg={4} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label>کتاب‌ها</Label>
                            <InputTypeahead
                                multiple
                                allowNew
                                clearButton
                                name={`book_set`}
                                validate={value => value ? undefined : "وارد کردن نام کتاب ها الزامی میباشد"}
                                placeholder="اسم کتاب خود را وارد کنید"
                            />
                            <Error name={`book_set`} />
                        </FormGroup>
                    </Col>
                    <Col lg={4} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label>لینک</Label>
                            <InputTypeahead
                                multiple
                                allowNew
                                clearButton
                                name={`press_set`}
                                validate={value => value ? undefined : "وارد کردن لینک الزامی میباشد"}
                                placeholder="لینک"
                            />
                            <Error name={`press_set`} />
                        </FormGroup>
                    </Col>
                    <Col lg={4} md={12} sm={12} xs={12}>
                        <FormGroup>
                            <Label>prov</Label>
                            <InputTypeahead
                                multiple
                                allowNew
                                clearButton
                                name={`prov_set`}
                                validate={value => value ? undefined : "وارد کردن prov الزامی میباشد"}
                                placeholder="اسم prov خود را وارد کنید"
                            />
                            <Error name={`prov_set`} />
                        </FormGroup>
                    </Col>
                </Row>
            </div>

        </React.Fragment>
    )
}

export const Step3 = ({
    addExhibition,
    AddArt,
    SingleEXBSubmit,
    SingleArtSubmit,
    handleRemoveExbArt,
    onChangeDatepicker,
    StepData,
    StepConfig,
    values
}) => {
    return (
        <FieldArray name="exb_set">
            {({ fields }) =>
                <React.Fragment>
                    {fields.map((name, index) => (
                        <React.Fragment>
                            <Exhibition
                                key={index}
                                name={name}
                                index={index}
                                onExbRemoveClick={() => handleRemoveExbArt(fields, 'exb_id', values, index, null)}
                                handleRemoveExbArt={handleRemoveExbArt}
                                input={AdaptedInput}
                                select={AdaptedSelect}
                                radio={AdaptedRadio}
                                textarea={AdaptedTextarea}
                                LabelRequired={LabelRequired}
                                SingleEXBSubmit={SingleEXBSubmit}
                                SingleArtSubmit={SingleArtSubmit}
                                onChangeDatepicker={onChangeDatepicker}
                                addArt={AddArt}
                                values={values}
                                StepData={StepData}
                                StepConfig={StepConfig}
                            />
                        </React.Fragment>
                    ))}
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <div className={styles.addSectionButton}>
                            <button
                                type="button"
                                className=""
                                onClick={() => addExhibition(fields.push, 'Exb'
                                )}>
                                <i></i>
                                <span>اضافه کردن نمایشگاه</span>
                            </button>
                        </div>
                    </Col>
                </React.Fragment>
            }
        </FieldArray>
    )
}

export const Step4 = ({
    Field,
    Step4_addCollection,
    AddArt,
    ModalToggle,
    openArtModal,
    Step4_SingleColSubmit,
    Step4_SingleArtSubmit,
    Step4_handleRemove,
    Step4_onChangeType,
    importArttoCollection,
    StepData,
    StepConfig,
    values,
    loadingDiv
}) => {
    return (
        <React.Fragment>
            <div className={styles.RegistrationSection}>
                <Row>
                    <Col xs={12}>
                        <Divider text="آثار برای داوری" />
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>تعداد آثار</Label>
                            <div className="clearfix"></div>
                            <div className={styles.CustomBox}>
                                <RadioGroup>
                                    <FormCheck inline>
                                        <Field
                                            name="type"
                                            component={AdaptedRadio}
                                            type="radio"
                                            id="mix"
                                            value="mix"
                                            onChange={() => Step4_onChangeType('mix')}
                                        />
                                        <FormCheckLabel htmlFor="mix" className={`${values.type == 'mix' ? `checked` : ``} ${loadingDiv == 'mix' ? `spinning` : ``}`}>10 کار مختلط</FormCheckLabel>
                                    </FormCheck>
                                    <FormCheck inline>
                                        <Field
                                            name="type"
                                            component={AdaptedRadio}
                                            type="radio"
                                            hidden
                                            id="collection_arts"
                                            value="collection_arts"
                                            onChange={() => Step4_onChangeType('collection_arts')}
                                        />
                                        <FormCheckLabel htmlFor="collection_arts" className={`${values.type == 'collection_arts' ? `checked` : ``} ${loadingDiv == 'collection_arts' ? `spinning` : ``}`}>مجموعه</FormCheckLabel>
                                    </FormCheck>
                                    <FormCheck inline>
                                        <Field
                                            name="type"
                                            component={AdaptedRadio}
                                            type="radio"
                                            id="2collections"
                                            value="2collections"
                                            onChange={() => Step4_onChangeType('2collections')}
                                        />
                                        <FormCheckLabel htmlFor="2collections" className={`${values.type == '2collections' ? `checked` : ``} ${loadingDiv == '2collections' ? `spinning` : ``}`}>حداقل ۲ مجموعه</FormCheckLabel>
                                    </FormCheck>
                                </RadioGroup>
                                <Error name="type" />
                            </div>
                        </FormGroup>
                        {values && values.type == 'mix' &&
                            <Alert
                                message="خب مجموعه که انتخاب شد چی باید به کاربر بگیم که بفهمه چه خبره؟"
                                type="warning"
                                icon

                            />
                        }
                        {values && values.type == 'collection_arts' &&
                            <Alert
                                message="خب مجموعه که انتخاب شد چی باید به کاربر بگیم که بفهمه چه خبره؟"
                                type="info"
                                icon
                            />
                        }
                        {values && values.type == '2collections' &&
                            <Alert
                                message="خب مجموعه که انتخاب شد چی باید به کاربر بگیم که بفهمه چه خبره؟"
                                type="info"
                                icon
                            />
                        }

                    </Col>

                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Divider text={`آثار`} />
                    </Col>
                    {values && values.type == 'mix' &&
                        <FieldArray name="art_set">
                            {({ fields }) =>
                                <React.Fragment>
                                    {fields.map((name, index) => (
                                        <React.Fragment>
                                            <SingleArt
                                                key={index}
                                                name={name}
                                                StepData={StepData}
                                                StepConfig={StepConfig}
                                                ServerData={StepData.art_set[index]}
                                                LocalData={values.art_set[index]}
                                                index={index}
                                                input={AdaptedInput}
                                                select={AdaptedSelect}
                                                values={values}
                                                LabelRequired={LabelRequired}
                                                SingleArtSubmit={() => Step4_SingleArtSubmit(values, index, null, 'SingleArt')}
                                                hasExtraFields
                                                onArtRemoveClick={() => Step4_handleRemove(fields, 'art_id', values, 'Col Index', index)}
                                            />
                                        </React.Fragment>
                                    ))}
                                    {values.art_set.length < 11 &&
                                        <Col lg={6} md={6} sm={12} xs={12}>
                                            <div className={styles.addSectionButton}>
                                                <button
                                                    type="button"
                                                    className=""
                                                    onClick={() => AddArt(fields.push, 'Art')}>
                                                    <i></i>
                                                    <span>اضافه کردن اثر</span>
                                                </button>
                                            </div>
                                        </Col>
                                    }
                                </React.Fragment>
                            }
                        </FieldArray>
                    }
                    {values && values.type === 'collection_arts' &&
                        <React.Fragment>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <FieldArray name="collection_set">
                                    {({ fields }) =>
                                        <React.Fragment>
                                            {fields.map((name, index) => (
                                                <React.Fragment>
                                                    <Collection
                                                        key={index}
                                                        name={name}
                                                        index={index}
                                                        onCollectionRemoveClick={() => Step4_handleRemove(fields, 'collection_id', values, index, null)}
                                                        Step4_handleRemove={Step4_handleRemove}
                                                        input={AdaptedInput}
                                                        select={AdaptedSelect}
                                                        radio={AdaptedRadio}
                                                        textarea={AdaptedTextarea}
                                                        LabelRequired={LabelRequired}
                                                        Step4_SingleColSubmit={Step4_SingleColSubmit}
                                                        SingleArtSubmit={Step4_SingleArtSubmit}
                                                        addArt={AddArt}
                                                        importArttoCollection={importArttoCollection}
                                                        openArtModal={openArtModal}
                                                        ModalToggle={ModalToggle}
                                                        values={values}
                                                        StepData={StepData}
                                                        StepConfig={StepConfig}
                                                    />
                                                </React.Fragment>
                                            ))}
                                            {values.collection_set.length < 1 &&

                                                <Col lg={12} md={12} sm={12} xs={12}>
                                                    <div className={styles.addSectionButton}>
                                                        <button
                                                            type="button"
                                                            className=""
                                                            onClick={() => Step4_addCollection(fields.push, 'Collection', values.type)}>
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
                            <Col lg={12} md={12} sm={12} xs={12} style={{ marginBottom: 10 }}>
                                <Divider text={`آثار مختلط`} />
                                <Alert
                                    message="۵ اثر مختلط نیز باید وارد کنید"
                                    type="info"
                                    icon
                                />
                            </Col>
                            <FieldArray name="art_set">
                                {({ fields }) =>
                                    <React.Fragment>
                                        {fields.map((name, index) => (
                                            <React.Fragment>
                                                <SingleArt
                                                    key={index}
                                                    name={name}
                                                    StepData={StepData}
                                                    StepConfig={StepConfig}
                                                    ServerData={StepData.art_set[index]}
                                                    LocalData={values.art_set[index]}
                                                    index={index}
                                                    input={AdaptedInput}
                                                    select={AdaptedSelect}
                                                    values={values}
                                                    LabelRequired={LabelRequired}
                                                    SingleArtSubmit={() => Step4_SingleArtSubmit(values, index, null, 'SingleArt')}
                                                    hasExtraFields
                                                    onArtRemoveClick={() => Step4_handleRemove(fields, 'art_id', values, 'Col Index', index)}
                                                />
                                            </React.Fragment>
                                        ))}
                                        {values.art_set.length < 11 &&
                                            <Col lg={6} md={6} sm={12} xs={12}>
                                                <div className={styles.addSectionButton}>
                                                    <button
                                                        type="button"
                                                        className=""
                                                        onClick={() => AddArt(fields.push, 'Art')}>
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
                    }
                    {values && values.type === '2collections' &&
                        <React.Fragment>

                            <Col lg={12} md={12} sm={12} xs={12}>
                                <FieldArray name="collection_set">
                                    {({ fields }) =>
                                        <React.Fragment>
                                            {fields.map((name, index) => (
                                                <React.Fragment>
                                                    <Collection
                                                        key={index}
                                                        name={name}
                                                        index={index}
                                                        onCollectionRemoveClick={() => Step4_handleRemove(fields, 'collection_id', values, index, null)}
                                                        Step4_handleRemove={Step4_handleRemove}
                                                        input={AdaptedInput}
                                                        select={AdaptedSelect}
                                                        radio={AdaptedRadio}
                                                        textarea={AdaptedTextarea}
                                                        LabelRequired={LabelRequired}
                                                        Step4_SingleColSubmit={Step4_SingleColSubmit}
                                                        SingleArtSubmit={Step4_SingleArtSubmit}
                                                        addArt={AddArt}
                                                        importArttoCollection={importArttoCollection}
                                                        openArtModal={openArtModal}
                                                        ModalToggle={ModalToggle}
                                                        values={values}
                                                        StepData={StepData}
                                                        StepConfig={StepConfig}
                                                    />
                                                </React.Fragment>
                                            ))}

                                            <Col lg={12} md={12} sm={12} xs={12}>
                                                <div className={styles.addSectionButton}>
                                                    <button
                                                        type="button"
                                                        className=""
                                                        onClick={() => Step4_addCollection(fields.push, 'Collection')}>
                                                        <i></i>
                                                        <span>اضافه کردن نمایشگاه</span>
                                                    </button>
                                                </div>
                                            </Col>

                                        </React.Fragment>
                                    }
                                </FieldArray>
                            </Col>
                        </React.Fragment>
                    }

                </Row>
            </div>

        </React.Fragment >
    )
}