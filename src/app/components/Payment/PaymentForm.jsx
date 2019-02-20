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
import ZaminehMap from '../map/ZaminehMap';

import { Field } from 'react-final-form-html5-validation'

import styles from '../../login/Login.scss'

const SubmitButton = ({ Loading, Text, values }) => (
    <>
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
    </>
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
export const PaymentAddressForm = (props) => {
    const {
        errorMessage,
        handleSubmit,
        cities,
        values,
        loading,
        onMapClick
    } = props;
    return (
        <Row>

            <>
                <Col xs={12}>
                    <Form
                        onSubmit={handleSubmit}
                        initialValues={values}
                        render={({ handleSubmit, form, submitting, pristine, values }) => (
                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label>آدرس</Label>
                                    <Field
                                        name='address'
                                        component={AdaptedTextarea}
                                        placeholder='آدرس'
                                        validate={value => value ? undefined : 'وارد کردن آدرس الزامی میباشد'}
                                        control
                                    />
                                    <Error name='address' />
                                </FormGroup>
                                <FormGroup>
                                    <Label>آدرس روی نقشه</Label>
                                    <ZaminehMap
                                        onClick={onMapClick}
                                        mapZoom={18}
                                        currentLocation={true}
                                    />


                                </FormGroup>
                                <SubmitButton
                                    Text='ثبت'
                                    values={values}
                                    Loading={loading}
                                />
                            </form>
                        )}
                    />
                </Col>
            </>

        </Row>
    )
};


