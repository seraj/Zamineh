import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import queryString from 'query-string';

import SecurityManager from '../../security/SecurityManager';
import Urls from '../../components/Urls';
import Alert from '../../components/Alert/Alert';

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';


import NumbersConvertor from '../../components/NumbersConvertor';
import { Form } from 'react-final-form';
import { Field } from 'react-final-form-html5-validation'
import {
    Checkbox,
    ControlFeedback,
    FormGroup,
    Input,
    Label,
    Radio,
    Select,
    Textarea
} from '@smooth-ui/core-sc';
import MessageBox from '../../components/ui-components/MessageBox/MessageBox'



const Error = ({ name }) => (
    <Field
        name={name}
        subscription={{ error: true, touched: true }}
    >
        {({ meta: { touched, error } }) =>
            touched && error ? (
                <ControlFeedback valid={!error}>{error}</ControlFeedback>
            ) : null
        }
    </Field>
);

const SubmitButton = ({ Loading, Text, values }) => (
    <>
        <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
                <Row className='justify-content-center'>

                    <Col lg={12} md={12} sm={12} xs={12}>
                        <button
                            type='submit'
                            style={{ width: '100%', marginBottom: 10 }}
                            disabled={Loading}
                            variant='primary'
                            className={`zbtn next black bradius ${Loading ? `spinning` : null}`}
                        >{Text} <i className='fas fa-angle-left' /></button>
                    </Col>
                </Row>
            </Col>

        </Row>
        {/*<pre>{JSON.stringify(values, 0, 2)}</pre>*/}
    </>
);

class AuthorizationForm extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            playerID: '123456789',
            showLoginError: false,
            loading: false,
            typeFa: this.props.type == 'Gallery' ? 'گالری' : 'هنرمند',
            successBox: false,
            message: {
                type: '',
                title: '',
                message: '',
            },
            timer: '10',

            checkMobileNumberStep1: !SecurityManager().hasGalleryRegToken(),
            MobileValidationStep2: false,
            loginForm: false,
            username: ''

        }
    }
    componentDidMount() {
        if (this.MobileValidatorboolean(queryString.parse(location.search)['zB5up7HQTL24vsna'])) {
            this.setState({
                checkMobileNumberStep1: false,
                MobileValidationStep2: true,
                username: queryString.parse(location.search)['zB5up7HQTL24vsna']
            })
        }
    }
    MobileValidatorboolean = (value) => {
        var regexp = /^[0][9][0-9]{9,9}$/;
        if (value && regexp.test(NumbersConvertor().convertToLatin(value))) {
            return true
        } else {
            return false
        }
    }
    MobileValidator = (value) => {
        var regexp = /^[0][9][0-9]{9,9}$/;
        var error;
        if (value && !regexp.test(NumbersConvertor().convertToLatin(value))) {
            error = 'شماره تلفن را به درستی وارد کنید'
        }
        return error
    }
    onCheckMobileNumberClick = async values => {
        this.setState({ loading: true });
        values.username = await NumbersConvertor().convertToLatin(values.username);
        axios
            .post(
                `${Urls().api()}${this.props.checkMobileAPI}`,
                {
                    client_id: cookie.load('client_id', { path: '/' }),
                    client_secret: cookie.load('client_secret', { path: '/' }),
                    player_id: this.state.playerID,
                    username: values.username,
                    user_type: this.props.type
                }
            )
            .then(response => {
                if (response.data.sms_exc == '') {
                    if (response.data.has_client === false) {
                        this.setState({
                            username: values.username,
                            checkMobileNumberStep1: false,
                            MobileValidationStep2: true,
                            loading: false
                        });
                    } else if (response.data.has_client === true) {
                        this.setState({
                            username: values.username,
                            checkMobileNumberStep1: false,
                            loginForm: true,
                            loading: false
                        });
                    }
                } else {
                    this.setState({
                        showLoginError: true,
                        loading: false,
                        errorMessage: response.data.sms_exc
                    });
                }
            })
            .catch(error => {
                this.setState({ loading: false });
            });
    };

    confirmMobileCode = values => {
        this.setState({ loading: true });
        values.code = NumbersConvertor().convertToLatin(values.code);

        axios
            .post(`${Urls().api()}${this.props.validationAPI}`, {
                client_id: SecurityManager().getRegClientIDSecret('id', this.props.type),
                client_secret: SecurityManager().getRegClientIDSecret('secret', this.props.type),
                player_id: this.state.playerID,
                code: values.code,
                username: this.state.username,
                password: values.password,
                user_type: this.props.type
            })
            .then(response => {
                this.props.setAccessTokens(response.data.access_token, response.data.refresh_token)

                this.setState({
                    MobileValidationStep2: false,
                    loading: false,
                });

            }).then(() => {
                this.props.afterLogin()
            })
            .catch(error => {
                this.setState({ loading: false });
            });
    };
    loginSubmit = values => {
        this.setState({ loading: true });

        axios
            .post(`${Urls().api()}${this.props.loginAPI}`, {
                client_id: SecurityManager().getRegClientIDSecret('id', this.props.type),
                client_secret: SecurityManager().getRegClientIDSecret('secret', this.props.type),
                username: this.state.username,
                password: values.password,
                grant_type: 'password',
                user_type: this.props.type
            })
            .then(response => {
                this.props.afterLogin()

                this.setState({
                    loading: false,
                    successBox: true,
                    message: {
                        type: 'info',
                        title: 'در حال انتقال به پروفایل',
                        message: `شما با این شماره یک ${this.state.typeFa} ثبت شده دارید.بزودی به پروفایل انتقال داده خواهید شد`,
                    },
                    timer: 15,
                });

                this.props.setAccessTokens(response.data.access_token, response.data.refresh_token)
            })

            .catch(error => {
                this.setState({ loading: false });
            });
    };


    adapt = Component => ({
        input,
        meta: { valid,
            touched },
        ...rest
    }) => <Component {...input} {...rest} valid={touched ? valid : ''} />;
    AdaptedInput = this.adapt(Input);
    AdaptedCheckbox = this.adapt(Checkbox);
    AdaptedRadio = this.adapt(Radio);
    AdaptedSelect = this.adapt(Select);
    AdaptedTextarea = this.adapt(Textarea);



    afterTimeFinished = () => {
        window.location.replace(Urls().Profile());

    }

    render() {
        const {
            username,
            checkMobileNumberStep1,
            MobileValidationStep2,
            loginForm,
            showLoginError,
            errorMessage,
            loading,
            successBox,
            message,
            timer


        } = this.state
        var url = window.location.href;
        return (
            <>

                {checkMobileNumberStep1 &&
                    <Row className='justify-content-md-center'>
                        {successBox &&
                            <MessageBox
                                title={message.title}
                                message={message.message}
                                type={message.type}
                                buttonText='رفتن به پروفایل'
                                seconds={timer}
                                afterTimeFinished={this.afterTimeFinished}
                            />
                        }
                        <Col lg={6} md={8} sm={12} xs={12}>

                            <Form
                                onSubmit={this.onCheckMobileNumberClick}
                                //initialValues={{}}
                                render={({ handleSubmit, form, submitting, pristine, values }) => (
                                    <form onSubmit={handleSubmit}>
                                        <FormGroup>
                                            <Label>شماره تلفن</Label>
                                            <Field
                                                name='username'
                                                component={this.AdaptedInput}
                                                placeholder='شماره تلفن'
                                                maxLength={11}
                                                tooLong='شماره تلفن باید ۱۱ رقم باشد'
                                                validate={this.MobileValidator}
                                                control
                                            />
                                            <Error name='username' />
                                        </FormGroup>



                                        <SubmitButton
                                            Text='ثبت شماره موبایل'
                                            Loading={loading}
                                            values={values}
                                        />
                                        {showLoginError &&
                                            <p className='formError'>{errorMessage}</p>
                                        }


                                    </form>
                                )}
                            />
                            <Alert
                                style={{ marginTop: 16 }}
                                description='دقت کنید که این شماره تماس صرفا برای ثبت هنرمند میباشد'
                                message='شماره تماس برای ثبت هنرمند'
                                type='warning'
                                rtl
                            />
                        </Col>
                    </Row>
                }





                {MobileValidationStep2 &&
                    <Row className='justify-content-md-center'>
                        <Col lg={6} md={8} sm={12} xs={12}>
                            <Form
                                onSubmit={this.confirmMobileCode}

                                initialValues={{ username: username }}

                                render={({ handleSubmit, form, submitting, pristine, values }) => (
                                    <form onSubmit={handleSubmit} autoComplete='off'>
                                        <FormGroup>
                                            <Label>شماره تلفن</Label>
                                            <Field
                                                name='username'
                                                component={this.AdaptedInput}
                                                disabled
                                                control
                                            />
                                            <Error name='username' />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>کد تایید</Label>
                                            <Field
                                                name='code'
                                                autoComplete='off'
                                                component={this.AdaptedInput}
                                                placeholder='کد تایید'
                                                validate={value => value ? undefined : 'وارد کردن کد تایید الزامی میباشد'}
                                                control
                                            />
                                            <Error name='code' />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>رمز عبور</Label>
                                            <Field
                                                name='password'
                                                type='password'
                                                component={this.AdaptedInput}
                                                placeholder='رمز عبور'
                                                validate={value => value ? undefined : 'وارد کردن نام کامل الزامی میباشد'}
                                                control
                                            />
                                            <Error name='password' />
                                        </FormGroup>

                                        <SubmitButton
                                            Text='تایید'
                                            Loading={loading}
                                            values={values}
                                        />
                                        {showLoginError &&
                                            <p className='formError'>{errorMessage}</p>
                                        }
                                    </form>
                                )}
                            />
                        </Col>
                    </Row>
                }






                {loginForm &&
                    <Row className='justify-content-md-center'>
                        <Col lg={6} md={8} sm={12} xs={12}>
                            <Form
                                onSubmit={this.loginSubmit}
                                initialValues={{ username: username }}
                                render={({ handleSubmit, form, submitting, pristine, values }) => (
                                    <form onSubmit={handleSubmit}>
                                        <FormGroup>
                                            <Label>شماره تلفن</Label>
                                            <Field
                                                name='username'
                                                component={this.AdaptedInput}
                                                disabled
                                                control
                                            />
                                            <Error name='username' />
                                        </FormGroup>

                                        <FormGroup>
                                            <Label>رمز عبور</Label>
                                            <Field
                                                name='password'
                                                type='password'
                                                component={this.AdaptedInput}
                                                placeholder='رمز عبور'
                                                validate={value => value ? undefined : 'وارد کردن نام کامل الزامی میباشد'}
                                                control
                                            />
                                            <Error name='password' />
                                        </FormGroup>

                                        <SubmitButton
                                            Text='ثبت'
                                            Loading={loading}
                                            values={values}
                                        />
                                        {showLoginError &&
                                            <p className='formError'>{errorMessage}</p>
                                        }
                                    </form>
                                )}
                            />
                        </Col>
                    </Row>
                }
            </>
        )
    }
}
export default AuthorizationForm