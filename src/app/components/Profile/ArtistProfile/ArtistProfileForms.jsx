import React from 'react';

import { Form } from 'react-final-form';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';

import {
    ValidateShebaNum
} from '../../../registration/artist/ArtistFormValidation';
import { Step1 } from '../../../registration/artist/Steps'


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
import NumbersConvertor from '../../NumbersConvertor';

import { Field } from 'react-final-form-html5-validation'

import styles from '../Profile.scss'

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
export const EditArtist = (props) => {
    const {
        errorMessage,
        handleSubmit,
        Config,
        onMapClick,
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
                                <Step1
                                    Field={Field}
                                    StepData={values}
                                    onMapClick={onMapClick}
                                    MobileValidator={MobileValidator}
                                    ValidateShebaNum={ValidateShebaNum}
                                    Editable={true}
                                />

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

export const SupportTicketForm = (props) => {
    const {
        handleSubmit,
        loading
    } = props;
    return (
        <Row>

            <React.Fragment>
                <Col xs={12}>
                    <Form
                        onSubmit={handleSubmit}
                        render={({ handleSubmit, form, submitting, pristine, values }) => (
                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label>عنوان</Label>
                                    <Field
                                        name='title'
                                        component={AdaptedInput}
                                        placeholder='عنوان مورد نظر'
                                        validate={value => value ? undefined : 'وارد کردن عنوان الزامی میباشد'}
                                        control
                                    />
                                    <Error name='title' />
                                </FormGroup>
                                <FormGroup>
                                    <Label>نوع درخواست</Label>
                                    <Field
                                        name='type'
                                        component={AdaptedSelect}
                                        validate={value => value ? undefined : 'واردن کردن نوع درخواست اجباری میباشد'}
                                        control
                                    >
                                        <option value=''></option>
                                        {props.types && props.types.map((item, index) => (
                                            <option value={item.value} key={index}>{item.title}</option>

                                        ))}
                                    </Field>
                                    <Error name='type' />
                                </FormGroup>
                                <FormGroup>
                                    <Label>متن درخواست</Label>
                                    <Field
                                        name='context'
                                        component={AdaptedTextarea}
                                        placeholder=''
                                        validate={value => value ? undefined : 'وارد کردن متن درخواست الزامی میباشد'}
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
