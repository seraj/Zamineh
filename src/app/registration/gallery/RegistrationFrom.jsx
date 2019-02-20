import React from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';

import { Field } from 'react-final-form-html5-validation'
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
    Textarea,
} from '@smooth-ui/core-sc';
import Alert from '../../components/Alert/Alert';
import ZaminehMap from '../../components/map/ZaminehMap';



import Divider from '../../components/Divider';
import Uploader from '../../components/Uploader';

import styles from '../Registration.scss'


const adapt = Component => ({
    input,
    meta: { valid,
        touched },
    ...rest
}) => <Component {...input} {...rest} valid={touched ? valid : ''} />;
const AdaptedInput = adapt(Input);
const AdaptedCheckbox = adapt(Checkbox);
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

export const RegisterForm = ({
    Field,
    FormData,
    StepConfig,
    hideUpload,
    MobileValidator,
    ValidateShebaNum,
    onMapClick,
    values
}) => {
    return (
        <>
            <div className={styles.RegistrationSection}>
                <Row>
                    <Field
                        name={`address.lat`}
                        component={AdaptedInput}
                        hidden
                    />
                    <Field
                        name={`address.lng`}
                        component={AdaptedInput}
                        hidden
                    />
                    <Col xs={12}>
                        <Divider text='اطلاعات گالری' />
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <Row>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <FormGroup>
                                    <Label className={LabelRequired}>نام گالری</Label>
                                    <Field
                                        name='name'
                                        component={AdaptedInput}
                                        placeholder='نام گالری'
                                        validate={value => value ? undefined : 'وارد کردن نام گالری الزامی میباشد'}
                                        control
                                    />
                                    <Error name='name' />
                                </FormGroup>
                            </Col>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <FormGroup>
                                    <Label className={LabelRequired}>آدرس گالری</Label>
                                    <Field
                                        name='address.address'
                                        component={AdaptedInput}
                                        placeholder='آدرس گالری'
                                        validate={value => value ? undefined : 'وارد کردن آدرس گالری الزامی میباشد'}
                                        control
                                    />
                                    <Error name='address' />
                                </FormGroup>
                            </Col>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <FormGroup>
                                    <Label className={LabelRequired}>شماره تماس گالری</Label>
                                    <Field
                                        name='address.tel'
                                        component={AdaptedInput}
                                        placeholder='شماره تماس گالری'
                                        validate={value => value ? undefined : 'وارد کردن شماره تماس گالری الزامی میباشد'}
                                        control
                                    />
                                    <Error name='address.tel' />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>آدرس روی نقشه</Label>
                            {FormData && FormData.address && FormData.address.lat &&
                                <ZaminehMap
                                    onClick={onMapClick}
                                    mapPosition={FormData.address.lat != null ? [FormData.address.lat, FormData.address.lng] : null}
                                    markerPosition={FormData.address.lat != null ? [FormData.address.lat, FormData.address.lng] : null}
                                    mapZoom={18}
                                    currentLocation={FormData.address.lat != null ? false : true}
                                />
                            }
                            {FormData && FormData.address && FormData.address.lat == null &&
                                <ZaminehMap
                                    onClick={onMapClick}
                                    mapZoom={18}
                                    currentLocation={true}
                                />
                            }

                        </FormGroup>
                    </Col>
                    {!hideUpload &&
                        <>
                            <Col xs={12}>
                                <Divider text='بارگذاری تصاویر مورد نیاز' />
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={12}>
                                <FormGroup>
                                    <Label>لوگو یا نشان گالری</Label>
                                    <Uploader
                                        server='/gallery-app/gallery/upload-image/logo/'
                                        name='logo'
                                        Load={(FormData && FormData.logo && FormData.logo.link) ? FormData.logo.link : null}
                                        files={(FormData && FormData.logo && FormData.logo.name) ? FormData.logo.name : null}
                                    />
                                </FormGroup>
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={12}>
                                <FormGroup>
                                    <Label>کاور گالری</Label>
                                    <Uploader
                                        server='/gallery-app/gallery/upload-image/cover/'
                                        name='cover'
                                        Load={(FormData && FormData.cover && FormData.cover.link) ? FormData.cover.link : null}
                                        files={(FormData && FormData.cover && FormData.cover.name) ? FormData.cover.name : null}
                                    />
                                </FormGroup>
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={12}>
                                <FormGroup>
                                    <Label>مجوز گالری</Label>
                                    <Uploader
                                        server='/gallery-app/gallery/upload-image/permission/'
                                        name='permission'
                                        Load={(FormData && FormData.permission && FormData.permission.link) ? FormData.permission.link : null}
                                        files={(FormData && FormData.permission && FormData.permission.name) ? FormData.permission.name : null}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={12}>
                                <Alert
                                    message='لطفا موارد مورد نظر را با دقت بارگذاری کنید.'
                                    type='warning'
                                    rtl
                                />
                            </Col>
                        </>
                    }
                </Row>
            </div>

            <div className={styles.RegistrationSection}>
                <Row>
                    <Col xs={12}>
                        <Divider text='اطلاعات تماس' />
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>ساعت شروع به کار گالری</Label>
                            <Field
                                type='time'
                                // min='12:00'
                                // rangeUnderflow='مقدار نمیتواند از ساعت فلان کمتر باشد'
                                // max='18:00'
                                // rangeOverflow='مقدار نمیتواند از ساعت فلان بیشتر باشد'
                                name='work_hours.start_time'
                                component={AdaptedInput}
                                placeholder='شروع'
                                validate={value => value ? undefined : 'وارد کردن ساعت شروع گالری الزامی میباشد'}
                                control
                            />
                            <Error name='work_hours.start_time' />
                        </FormGroup>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>ساعت پایان به کار گالری</Label>
                            <Field
                                type='time'
                                name='work_hours.end_time'
                                component={AdaptedInput}
                                placeholder='پایان'
                                validate={value => value ? undefined : "وارد کردن ساعت پایا' گالری الزامی میباشد"}
                                control
                            />
                            <Error name='work_hours.end_time' />
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>روزهای تعطیلی گالری</Label>
                            <div className='clearfix'></div>
                            <div className={styles.CustomBox}>
                                {StepConfig &&
                                    StepConfig.weekday_set.map((item, index) => (
                                        <FormCheck inline key={index}>
                                            <Field
                                                name={`holiday_set`}
                                                component={AdaptedCheckbox}
                                                id={item.value}
                                                value={item.value}
                                                type='checkbox'
                                            />
                                            <FormCheckLabel htmlFor={item.value} className={`${(values.holiday_set && values.holiday_set.includes(item.value)) ? `checked` : ``}`}>{item.title}</FormCheckLabel>
                                        </FormCheck>
                                    ))}
                                <Error name='holiday_set' />
                            </div>
                        </FormGroup>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>ایمیل</Label>
                            <Field
                                name='email'
                                component={AdaptedInput}
                                placeholder='ایمیل'
                                validate={value => value ? undefined : 'وارد کردن ایمیل الزامی میباشد'}
                                control
                            />
                            <Error name='email' />
                        </FormGroup>
                    </Col>


                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label>شماره شبا</Label>
                            <Field
                                name='sheba_num'
                                component={AdaptedInput}
                                placeholder='شماره شبا'
                                validate={ValidateShebaNum}
                                control
                            />
                            <Error name='sheba_num' />
                        </FormGroup>
                    </Col>

                    {StepConfig && StepConfig.social_set &&
                        StepConfig.social_set.map((item, index) => (
                            <Col lg={6} md={6} sm={12} xs={12} key={index}>
                                <FormGroup>
                                    <Label>{item.title}</Label>
                                    <Field
                                        name={`social_set[${index}].url`}
                                        component={AdaptedInput}
                                        placeholder={item.title}
                                        control
                                    />
                                    <Error name={`social_set[${index}].url`} />
                                </FormGroup>
                            </Col>
                        ))
                    }

                    <Col xs={12}>
                        <Divider text='مشخصات برگذار کننده' />
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>مدیر گرداننده گالری</Label>
                            <Field
                                name='owner.name'
                                component={AdaptedInput}
                                placeholder='مدیر گرداننده گالری'
                                validate={value => value ? undefined : 'وارد کردن نام مدیر گرداننده گالری الزامی میباشد'}
                                control
                            />
                            <Error name='owner.name' />
                        </FormGroup>
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>شماره تماس</Label>
                            <Field
                                name='owner.tel'
                                component={AdaptedInput}
                                placeholder='شماره تماس مدیر گرداننده گالری'
                                validate={value => value ? undefined : 'وارد کردن شماره تماس مدیر گرداننده گالری الزامی میباشد'}
                                control
                            />
                            <Error name='owner.tel' />
                        </FormGroup>
                    </Col>

                    <Col lg={12} md={12} sm={12} xs={12}>
                        <FormGroup>
                            <Label className={LabelRequired}>درباره گالری</Label>
                            <Field
                                name='about'
                                maxLength={200}
                                component={AdaptedTextarea}
                                placeholder='...'
                                minHeight='90px'
                                validate={value => value ? undefined : 'وارد کردن این ایتم الزامی میباشد'}
                                control
                            />
                            <Error name='about' />
                        </FormGroup>
                    </Col>
                </Row>
                <Alert
                    message='...'
                    type='warning'
                    rtl
                />

            </div>
        </ >
    )
}
