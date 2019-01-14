import React from 'react';
import {
    Route,
    Switch,
    withRouter
} from 'react-router-dom';
import axios from 'axios';
import { ToastMessageBox, Toast } from './components/Toast/Toast';


import cookie from 'react-cookies';
import SecurityManager from './security/SecurityManager'
import Urls from "./components/Urls";

/* Components */
import Routing from "./Routing";
import Login from "./login/Login";
import Header from './components/Header/Header';
import AppFooter from './AppFooter';


import './static/App.scss';














/**
 * 
 * 
 * @class App
 * @extends {React.Component}
 * @description The main class of Zamineh ReactJS project
 */

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            LoginModal: false,
            test: false,
            baseContent: []
        }

        axios.defaults.baseURL = Urls().api();
        axios.defaults.timeout = 10000;
        const RegistrationPage = window.location.href.includes('registration');

        axios
            .interceptors
            .request
            .use(function (config) {
                const token = RegistrationPage ? SecurityManager().getGalleryAuthToken() : SecurityManager().getAuthToken()

                if (token && token !== null && token !== 'null') {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
                error => Promise.reject(error),
            );
        let isRefreshing = false;
        let subscribers = [];

        axios.interceptors.response.use(undefined, err => {

            const { config, response: { status, data } } = err;

            const originalRequest = config;
            if (status === 400) {
                data.error ? Toast('error', data.error) : null
                console.log(data)
            }
            if (status >= 500) {
                Toast('error', 'مشکلی پیش آمده است.لطفا دوباره تلاش نمایید')
            }
            if (status === 401) {
                if (RegistrationPage) {
                    if (!isRefreshing) {
                        isRefreshing = true;
                        SecurityManager().refreshGalleryToken().then(respaonse => {
                            const { data } = respaonse;
                            isRefreshing = false;
                            onRrefreshed(data.access_token);
                            SecurityManager().setGalleryAccessToken(data.access_token);
                            SecurityManager().setGalleryRefreshToken(data.refresh_token);
                            subscribers = [];
                        })
                    }
                    else {
                        // console.log('error 401')
                        // reject(error);
                        SecurityManager().GalleryLogout();
                        // window.location.href = '/'
                    }
                } else {
                    if (!isRefreshing) {
                        isRefreshing = true;
                        // console.log('client refresh token')
                        SecurityManager().refreshToken().then(respaonse => {
                            const { data } = respaonse;
                            isRefreshing = false;
                            onRrefreshed(data.access_token);
                            SecurityManager().setAccessToken(data.access_token);
                            SecurityManager().setRefreshToken(data.refresh_token);
                            subscribers = [];
                        })


                    } else {
                        // console.log('error 401')
                        // reject(error);
                        SecurityManager().logout();
                        // window.location.href = '/'
                    }
                }

                const requestSubscribers = new Promise(resolve => {
                    subscribeTokenRefresh(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(axios(originalRequest));
                    });
                });
                return requestSubscribers;
            }
            return (Promise.reject(err));
        });
        function subscribeTokenRefresh(cb) {
            subscribers.push(cb);
        }

        function onRrefreshed(token) {
            subscribers.map(cb => cb(token));
        }
    }


    componentDidMount() {

        this.getClientsIDSecret();

    }


    /**
     *
     *
     *
     * @memberOf App
     * @description Force update React app when needed
     */


    updateApp = () => {
        setTimeout(() => {
            this.forceUpdate();
        }, 200);
    }
    getClientsIDSecret = async () => {
        var RegistrationPage = window.location.href.includes('registration');
        if (RegistrationPage) {
            // SecurityManager().RemoveAuthClientIDSecret();
        }
        try {
            var client_id = cookie.load('client_id', { path: '/' });
            var client_secret = cookie.load('client_secret', { path: '/' });
            var auth_client_id = cookie.load('auth_client_id', { path: '/' });
            var auth_client_secret = cookie.load('auth_client_secret', { path: '/' });
            var gallery_auth_client_id = cookie.load('gallery_auth_client_id', { path: '/' });
            var gallery_auth_client_secret = cookie.load('gallery_auth_client_secret', { path: '/' });



            if (RegistrationPage) {
                if (gallery_auth_client_id == "" || gallery_auth_client_id == undefined) {
                    // console.log('get new client ID Secret')
                    await axios.post(`${Urls().api()}/a9pY5kS7L3KgG44r/KKu6wWGVbn5Kq/`, {
                        is_gallery: true
                    }).then((response) => {
                        cookie.save('gallery_auth_client_id', response.data.client_id, { path: '/registration' });
                        cookie.save('gallery_auth_client_secret', response.data.client_secret, { path: '/registration' });
                    });
                    auth_client_id = await cookie.load('auth_client_id', { path: '/registration' });
                    auth_client_secret = await cookie.load('auth_client_secret', { path: '/registration' });
                }
            }



            if (auth_client_id == "" || auth_client_id == undefined) {
                await axios.post(`${Urls().api()}/a9pY5kS7L3KgG44r/KKu6wWGVbn5Kq/`).then((response) => {
                    cookie.save('auth_client_id', response.data.client_id, { path: '/' });
                    cookie.save('auth_client_secret', response.data.client_secret, { path: '/' });
                });
                auth_client_id = await cookie.load('auth_client_id', { path: '/' });
                auth_client_secret = await cookie.load('auth_client_secret', { path: '/' });
            }



            if (client_id == "" || client_id == undefined) {
                await axios.post(`${Urls().api()}/2sFrKCs7p8L5fhtV/me37TEkRuXKVz/`).then((response) => {
                    cookie.save('client_id', response.data.client_id, { path: '/' });
                    cookie.save('client_secret', response.data.client_secret, { path: '/' });
                });
                client_id = await cookie.load('client_id', { path: '/' });
                client_secret = await cookie.load('client_secret', { path: '/' });
            } else {
            }
            await this.callConfingAPI(client_id, client_secret);
        }
        catch (error) {
            console.log(error);
        }
    }
    callConfingAPI = (ID, Secret) => {
        var body = {
            client_id: ID,
            client_secret: Secret
        }
        axios({
            method: 'post',
            url: `${Urls().api()}/configs/`,
            data: body,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then((response) => {
                this.setState({
                    baseContent: response.data
                })
            })
            .catch((response) => {
                console.log(response);
            });
    }
    getUserInfo = () => {
        axios.get('/api/user-profile/').then((response) => {

            this.setState({ userInfo: response.data });
        })
            .catch(function (error) { });


    }
    openModal = value => {
        this.setState({
            LoginModal: value
        });
    };
    onLogoutClick = () => {
        this.setState({ userInfo: null })
        SecurityManager().logout();
        this.forceUpdate();
    }
    render() {
        const isLogined = SecurityManager().isLogined();
        const { nav_list } = this.state.baseContent;

        return (
            <React.Fragment>
                <ToastMessageBox />
                <Header
                    isLogined={isLogined}
                    onLogoutClick={this.onLogoutClick}
                    onMenuClick={this.updateApp}
                    navList={nav_list}
                    openModal={this.openModal}
                />

                <Routing isLogined={isLogined} />

                <Login
                    hasModal
                    modalisOpen={this.state.LoginModal}
                    openModal={this.openModal}
                />

                <AppFooter></AppFooter>
            </React.Fragment>
        )
    }
}
export default withRouter(App);

