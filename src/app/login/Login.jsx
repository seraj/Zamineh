import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import Row from 'reactstrap/lib/Row';
import Container from 'reactstrap/lib/Container';
import Col from 'reactstrap/lib/Col';
import LoginForm from './LoginForm';
import SecurityManager from '../security/SecurityManager';
import NumbersConvertor from '../components/NumbersConvertor';
import Urls from '../components/Urls';
import moment from 'moment-jalaali';
import LoginModal from './LoginModal';
import Section from '../components/Section/Section';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasModal: this.props.hasModal,
      loading: false,
      checkMobileNumberStep1: true,
      loginForm: false,
      isMobileValidationStep2: false,
      signUpFormStep3: false,
      showLoginError: false,
      errorMessage: '',
      birthday_start: '',
      birthday_end: '',
      cities: [],
      birthday: ''
    };
  }
  componentDidMount = () => { };

  onCheckMobileNumberClick = async values => {

    this.setState({ loading: true })
    values.username = await NumbersConvertor().convertToLatin(values.username);

    axios
      .post(
        `${Urls().api()}/client-app/client/check/`,
        {
          client_id: cookie.load('client_id', { path: '/' }),
          client_secret: cookie.load('client_secret', { path: '/' }),
          player_id: '12345539',
          username: values.username
        },
        {}
      )
      .then(response => {
        if (response.data.sms_exc == '') {
          if (response.data.has_client === false) {
            this.setState({
              username: values.username,
              checkMobileNumberStep1: false,
              isMobileValidationStep2: true,
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
            errorMessage: response.data.sms_exc,
            loading: false
          });
        }
      })
      .catch(error => {

        this.setState({ loading: false });
      });
    // window.alert(JSON.stringify(values, 0, 2));
  };
  confirmMobileCode = values => {
    this.setState({ loading: true })
    values.code = NumbersConvertor().convertToLatin(values.code);
    axios
      .post(
        `${Urls().api()}/client-app/phone/validate/`,
        {
          client_id: cookie.load('client_id', { path: '/' }),
          client_secret: cookie.load('client_secret', { path: '/' }),
          player_id: '12345539',
          username: this.state.username,
          code: values.code
        },
        {}
      )
      .then(response => {
        // console.log(response)
        if (response.status == 200) {
          this.setState({
            isMobileValidationStep2: false,
            signUpFormStep3: true,
            loading: false
          });
        }
        this.getCities();
        this.getBirthyears();
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  };
  loginSubmit = values => {
    this.setState({ loading: true })

    axios
      .post(`${Urls().api()}/client-app/login/`, {
        client_id: cookie.load('auth_client_id', { path: '/' }),
        client_secret: cookie.load('auth_client_secret', { path: '/' }),
        username: this.state.username,
        password: values.password,
        grant_type: 'password'
      })
      .then(response => {
        this.setState({ loading: false })
        SecurityManager().setAccessToken(response.data.access_token);
        SecurityManager().setRefreshToken(response.data.refresh_token);
      })
      .then(() => {
        location.reload();
      })
      .catch(error => {
        this.setState({ loading: false });
      })

  };
  registerSubmit = values => {
    this.setState({ loading: true })

    axios
      .post(`${Urls().api()}/client-app/register/`, {
        client_id: cookie.load('client_id', { path: '/' }),
        client_secret: cookie.load('client_secret', { path: '/' }),
        username: this.state.username ? this.state.username : '09120535594',
        password: values.password,
        name: values.fullname,
        birthday: this.state.birthday,
        email: values.email,
        city_id: parseInt(values.city_id)
      })
      .then(response => {
        SecurityManager().setAccessToken(response.data.access_token);
        SecurityManager().setRefreshToken(response.data.refresh_token);
        this.setState({ loading: false })
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  };
  getBirthyears = () => {
    axios
      .post(`${Urls().api()}/birthday/range/`, {
        client_id: cookie.load('client_id', { path: '/' }),
        client_secret: cookie.load('client_secret', { path: '/' })
      })
      .then(response => {
        this.setState({
          birthday_start: response.data.b_start,
          birthday_end: response.data.b_end,
        });
      })
      .catch(error => {

      });
  };
  getCities = () => {
    axios
      .post(`${Urls().api()}/cities/`, {
        client_id: cookie.load('client_id', { path: '/' }),
        client_secret: cookie.load('client_secret', { path: '/' })
      })
      .then(response => {
        this.setState({
          cities: response.data
        });
      })
      .catch(error => {

      });
  };
  onChangeDatepicker = async value => {
    const date = await `${value.jYear()}-${value.jMonth() +
      1}-${value.jDate()}`;
    const endate = moment(date, 'jYYYY-jM-jD').format('YYYY-MM-DD');
    console.log(value);
    await this.setState(
      {
        birthday: endate
      },
      () => {
        this.forceUpdate();
      }
    );
    // console.log(this.state.birthday)
    // console.log(endate)
  };
  closeModal = () => {
    this.props.openModal(false);
  };

  render() {
    const { modalisOpen, LoginPage } = this.props;

    return (
      <React.Fragment>

        {this.state.hasModal && (
          <LoginModal
            isOpen={modalisOpen}
            toggle={this.closeModal}
            birthday_start={this.state.birthday_start}
            birthday_end={this.state.birthday_end}
          />
        )}
        {!this.state.hasModal && !LoginPage &&
          <LoginForm
            onCheckMobileNumberClick={this.onCheckMobileNumberClick}
            loginSubmit={this.loginSubmit}
            confirmMobileCode={this.confirmMobileCode}
            registerSubmit={this.registerSubmit}
            cities={this.state.cities}
            checkMobileNumberStep1={this.state.checkMobileNumberStep1}
            loginForm={this.state.loginForm}
            isMobileValidationStep2={this.state.isMobileValidationStep2}
            signUpFormStep3={this.state.signUpFormStep3}
            onChangeDatepicker={this.onChangeDatepicker}
            showLoginError={this.state.showLoginError}
            errorMessage={this.state.errorMessage}

            birthday_start={this.state.birthday_start}
            birthday_end={this.state.birthday_end}
            username={this.state.username}
            loading={this.state.loading}
          />

        }
        {LoginPage &&
          <Section ExtraClass={'content singlePage'}>
            <Container>
              <Row className='justify-content-center'>
                <Col lg={5} md={8} sm={10} xs={12}>
                  <LoginForm
                    onCheckMobileNumberClick={this.onCheckMobileNumberClick}
                    loginSubmit={this.loginSubmit}
                    confirmMobileCode={this.confirmMobileCode}
                    registerSubmit={this.registerSubmit}
                    cities={this.state.cities}
                    checkMobileNumberStep1={this.state.checkMobileNumberStep1}
                    loginForm={this.state.loginForm}
                    isMobileValidationStep2={this.state.isMobileValidationStep2}
                    signUpFormStep3={this.state.signUpFormStep3}
                    onChangeDatepicker={this.onChangeDatepicker}
                    showLoginError={this.state.showLoginError}
                    errorMessage={this.state.errorMessage}

                    birthday_start={this.state.birthday_start}
                    birthday_end={this.state.birthday_end}
                    username={this.state.username}
                    loading={this.state.loading}
                  />
                </Col>
              </Row>
            </Container>
          </Section>
        }
      </React.Fragment>
    );
  }
}

export default Login;
