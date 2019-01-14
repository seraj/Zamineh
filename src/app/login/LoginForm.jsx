import React from "react";

import { Form } from "react-final-form";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
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
} from "@smooth-ui/core-sc";
import PersianDatePicker from '../components/datepicker/PersianDatePicker';
import NumbersConvertor from '../components/NumbersConvertor';

import { Field } from 'react-final-form-html5-validation'

import styles from "./Login.scss"

const SubmitButton = ({ Loading, Text }) => (
    <React.Fragment>
        <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
                <Row className="justify-content-center">

                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Button
                            type="submit"
                            style={{ width: '100%', marginBottom: 10 }}
                            disabled={Loading}
                            variant="primary"
                            className={`zbtn next black bradius ${Loading ? `spinning` : null}`}
                        >{Text} <i className="fas fa-angle-left" /></Button>
                    </Col>
                </Row>
            </Col>

        </Row>
        {/*<pre>{JSON.stringify(values, 0, 2)}</pre>*/}
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

const required = value => (value ? undefined : "الزامی");
const MobileValidator = value => {

    var regexp = /^[0][9][0-9]{9,9}$/;
    var error;
    if (value && !regexp.test(NumbersConvertor().convertToLatin(value))) {
        error = 'شماره تلفن را به درستی وارد کنید'
    }

    return error
}
const LoginForm = (props) => {
    const {
        checkMobileNumberStep1,
        loginForm,
        isMobileValidationStep2,
        signUpFormStep3,

        showLoginError,
        errorMessage,

        onChangeDatepicker,
        birthday_start,
        birthday_end,

        onCheckMobileNumberClick,
        loginSubmit,
        confirmMobileCode,
        registerSubmit,
        cities,

        username,
        loading
    } = props;
    return (
        <Row>
            {checkMobileNumberStep1 &&
                <React.Fragment>
                    <Col xs={12}>
                        <Form
                            onSubmit={onCheckMobileNumberClick}
                            //initialValues={{}}
                            render={({ handleSubmit, form, submitting, pristine, values }) => (
                                <form onSubmit={handleSubmit}>
                                    <FormGroup>
                                        <Label>شماره تلفن</Label>
                                        <Field
                                            name="username"
                                            component={AdaptedInput}
                                            placeholder="شماره تلفن"
                                            maxLength={11}
                                            tooLong="That name is too long!"
                                            validate={MobileValidator}
                                            control
                                        />
                                        <Error name="username" />
                                    </FormGroup>



                                    <SubmitButton
                                        Text="ثبت شماره موبایل"
                                        Loading={loading}
                                    />
                                    {showLoginError &&
                                        <p className="formError">{errorMessage}</p>
                                    }
                                </form>
                            )}
                        />
                    </Col>
                </React.Fragment>
            }
            {loginForm &&
                <React.Fragment>
                    <Col xs={12}>
                        <Form
                            onSubmit={loginSubmit}
                            initialValues={{ username: username }}
                            render={({ handleSubmit, form, submitting, pristine, values }) => (
                                <form onSubmit={handleSubmit}>
                                    <FormGroup>
                                        <Label>شماره تلفن</Label>
                                        <Field
                                            name="username"
                                            component={AdaptedInput}
                                            disabled
                                            control
                                        />
                                        <Error name="username" />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>رمز عبور</Label>
                                        <Field
                                            name="password"
                                            type="password"
                                            component={AdaptedInput}
                                            placeholder="رمز عبور"
                                            validate={value => value ? undefined : "وارد کردن رمز عبور الزامی میباشد"}
                                            control
                                        />
                                        <Error name="password" />
                                    </FormGroup>

                                    <SubmitButton
                                        Text="ورود"
                                        Loading={loading}
                                    />
                                    {showLoginError &&
                                        <p className="formError">{errorMessage}</p>
                                    }
                                </form>
                            )}
                        />
                    </Col>
                </React.Fragment>}
            {isMobileValidationStep2 &&
                <React.Fragment>
                    <Col xs={12}>
                        <Form
                            onSubmit={confirmMobileCode}
                            //initialValues={{}}
                            render={({ handleSubmit, form, submitting, pristine, values }) => (
                                <form onSubmit={handleSubmit}>
                                    <FormGroup>
                                        <Label>کد تایید</Label>
                                        <Field
                                            name="code"
                                            component={AdaptedInput}
                                            placeholder="کد تایید"
                                            validate={value => value ? undefined : "وارد کردن کد تایید الزامی میباشد"}
                                            control
                                        />
                                        <Error name="code" />
                                    </FormGroup>



                                    <SubmitButton
                                        Text="تایید"
                                        Loading={loading}
                                    />

                                </form>
                            )}
                        />
                    </Col>
                    <Col />
                </React.Fragment>
            }
            {signUpFormStep3 &&
                <React.Fragment>
                    <Col xs={12}>
                        <Form
                            onSubmit={registerSubmit}
                            //initialValues={{}}
                            render={({ handleSubmit, form, submitting, pristine, values }) => (
                                <form onSubmit={handleSubmit}>
                                    <FormGroup>
                                        <Label>نام و نام خانوادگی</Label>
                                        <Field
                                            name="fullname"
                                            component={AdaptedInput}
                                            placeholder="نام و نام خانوادگی"
                                            validate={value => value ? undefined : "وارد کردن نام کامل الزامی میباشد"}
                                            control
                                        />
                                        <Error name="fullname" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>رمز عبور</Label>
                                        <Field
                                            name="password"
                                            type="password"
                                            component={AdaptedInput}
                                            placeholder="رمز عبور"
                                            validate={value => value ? undefined : "وارد کردن نام کامل الزامی میباشد"}
                                            control
                                        />
                                        <Error name="password" />
                                    </FormGroup>
                                    {/* <FormGroup>
                                        <Label>نام و نام خانوادگی</Label>
                                        <Field
                                            name="fullname"
                                            component={AdaptedInput}
                                            placeholder="نام و نام خانوادگی"
                                            validate={value => value ? undefined : "وارد کردن نام کامل الزامی میباشد"}
                                            control
                                        />
                                        <Error name="fullname" />
                                    </FormGroup> */}
                                    <FormGroup>
                                        <Label>تاریخ تولد</Label>
                                        <PersianDatePicker
                                            defaultValue="1991-03-21"
                                            onChangeDatepicker={onChangeDatepicker}
                                            birthday_start={birthday_start}
                                            birthday_end={birthday_end}
                                        />


                                        <Error name="birthday" />

                                    </FormGroup>
                                    <FormGroup>
                                        <Label>ایمیل</Label>
                                        <Field
                                            name="email"
                                            component={AdaptedInput}
                                            placeholder="ایمیل"
                                            validate={value => value ? undefined : "وارد کردن ایمیل میباشد"}
                                            control
                                        />
                                        <Error name="email" />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>محل سکونت</Label>
                                        <Field
                                            name="city_id"
                                            component={AdaptedSelect}
                                            validate={value => value ? undefined : "واردن کردن محل سکونت اجباری میباشد"}
                                            control
                                        >
                                            <option value=""></option>
                                            {cities && cities.map((item, index) => (
                                                <option value={item.id} key={index}>{item.name}</option>

                                            ))}
                                        </Field>
                                        <Error name="city_id" />
                                    </FormGroup>




                                    <SubmitButton
                                        Text="ثبت نهایی"
                                        Loading={loading}
                                    />

                                </form>
                            )}
                        />
                    </Col>
                </React.Fragment>
            }
        </Row>
    )
};
export default LoginForm;

