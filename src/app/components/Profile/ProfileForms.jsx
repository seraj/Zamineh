import React from 'react';

import { Form } from 'react-final-form';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import {
    Box,
    Button,
    Checkbox,
    ControlFeedback,
    FormGroup,
    Input,
    Label,
    Radio,
    Select,
    Textarea
} from '@smooth-ui/core-sc';
import NumbersConvertor from '../NumbersConvertor';

import { Field } from 'react-final-form-html5-validation'

import styles from '../../login/Login.scss'

const SubmitButton = ({ Loading, Text, values }) => (
    <React.Fragment>
        <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
                <Row className='justify-content-center'>

                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Button
                            type='submit'
                            style={{ width: '100%', marginBottom: 10 }}
                            disabled={Loading}
                            variant='primary'
                            className={`zbtn next black bradius ${Loading ? `spinning` : null}`}
                        >{Text} <i className='fas fa-angle-left' /></Button>
                    </Col>
                </Row>
            </Col>

        </Row>
        {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
    </React.Fragment>
);

const adapt /* ⬅️ this is a HOC */ = Component => ({
    input,
    meta: { valid },
    ...rest
}) => <Component className={styles.input} {...input} {...rest} />;
const AdaptedInput = adapt(Input);
const AdaptedCheckbox = adapt(Checkbox);
const AdaptedRadio = adapt(Radio);
const AdaptedSelect = adapt(Select);
const AdaptedTextarea = adapt(Textarea);

const Error = ({ name }) => (
    <Field name={name} subscription={{ error: true, touched: true }}>
        {({ meta: { touched, error } }) =>
            touched && error ? (
                <ControlFeedback valid={!error}>{error}</ControlFeedback>
            ) : null
        }
    </Field>
);

const required = value => (value ? undefined : 'الزامی');
const MobileValidator = value => {

    var regexp = /^[0][9][0-9]{9,9}$/;
    var error;
    if (value && !regexp.test(NumbersConvertor().convertToLatin(value))) {
        error = 'شماره تلفن را به درستی وارد کنید'
    }

    return error
}
export const EditProfile = (props) => {
    const {
        errorMessage,
        handleSubmit,
        cities,
        values,
        loading
    } = props;
    return (
        <Row>

            <React.Fragment>
                <Col xs={12}>
                    <Form
                        onSubmit={handleSubmit}
                        initialValues={values}
                        render={({ handleSubmit, form, submitting, pristine, values }) => (
                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label>شماره تلفن</Label>
                                    <Field
                                        name='username'
                                        component={AdaptedInput}
                                        disabled
                                        control
                                    />
                                    <Error name='username' />
                                </FormGroup>

                                <FormGroup>
                                    <Label>نام و نام خانوادگی</Label>
                                    <Field
                                        name='name'
                                        component={AdaptedInput}
                                        placeholder='نام و نام خانوادگی'
                                        validate={value => value ? undefined : 'وارد کردن نام و نام خانوادگی الزامی میباشد'}
                                        control
                                    />
                                    <Error name='name' />
                                </FormGroup>

                                <FormGroup>
                                    <Label>ایمیل</Label>
                                    <Field
                                        name='email'
                                        component={AdaptedInput}
                                        placeholder='ایمیل'
                                        validate={value => value ? undefined : 'وارد کردن ایمیل الزامی میباشد'}
                                        control
                                    />
                                    <Error name='email' />
                                </FormGroup>


                                <FormGroup>
                                    <Label>محل سکونت</Label>
                                    <Field
                                        name='city'
                                        component={AdaptedSelect}
                                        validate={value => value ? undefined : 'واردن کردن محل سکونت اجباری میباشد'}
                                        control
                                    >
                                        <option value=''></option>
                                        {cities && cities.map((item, index) => (
                                            <option value={item.id} key={index}>{item.name}</option>
                                        ))}
                                    </Field>
                                    <Error name='city' />
                                </FormGroup>

                                <SubmitButton
                                    Text='ویرایش'
                                    values={values}
                                    Loading={loading}
                                />
                            </form>
                        )}
                    />
                </Col>
            </React.Fragment>

        </Row>
    )
};

export const Report = (props) => {
    const {
        handleSubmit,
        values,
        loading
    } = props;
    return (
        <Row>

            <React.Fragment>
                <Col xs={12}>
                    <Form
                        onSubmit={handleSubmit}
                        initialValues={values}
                        render={({ handleSubmit, form, submitting, pristine, values }) => (
                            <form onSubmit={handleSubmit}>
                                {/* <FormGroup>
                                    <Label>نوع گزارش</Label>
                                    <Field
                                        name='city'
                                        component={AdaptedSelect}
                                        validate={value => value ? undefined : 'واردن کردن نوع گزارش اجباری میباشد'}
                                        control
                                    >
                                        <option value=''></option>
                                        {cities && cities.map((item, index) => (
                                            <option value={item.id} key={index}>{item.name}</option>
                                        ))}
                                    </Field>
                                    <Error name='city' />
                                </FormGroup> */}


                                <FormGroup>
                                    <Label>گزارش</Label>
                                    <Field
                                        name='context'
                                        component={AdaptedTextarea}
                                        placeholder='گزارش مورد نظر'
                                        validate={value => value ? undefined : 'وارد کردن گزارش الزامی میباشد'}
                                        control
                                    />
                                    <Error name='context' />
                                </FormGroup>
                                <SubmitButton
                                    Text='ثبت گزارش'
                                    values={values}
                                    Loading={loading}
                                />
                            </form>
                        )}
                    />
                </Col>
            </React.Fragment>

        </Row>
    )
};
