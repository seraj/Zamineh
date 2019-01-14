import axios from 'axios';
import cookie from 'react-cookies'
import Urls from "../components/Urls";

export default function SecurityManager() {

    return {

        checkForLogin: function () {
            return axios.post('https://test.com/', {
                client_id: cookie.load('auth_client_id', { path: '/' }),
                client_secret: cookie.load('auth_client_secret', { path: '/' }),
                grant_type: 'refresh_token'
            }).then((response) => {

                cookie.save('access_token', response.data.access_token, { path: '/' });
                cookie.save('token_type', response.data.token_type, { path: '/' });

                return true
            })
                .catch(function (error) {
                    // cookie.save('access_token', null, { path: '/' });
                    return false
                });
        },
        isLogined() {

            var auth_token = cookie.load('access_token', { path: '/' });

            if (auth_token && auth_token != 'null') {

                return true
            } else {
                return false
            }
        },
        hasGalleryToken() {
            var gallery_access_token = cookie.load('gallery_access_token', { path: '/' });
            if (gallery_access_token && gallery_access_token != 'null') {
                return true
            } else {
                return false
            }
        },
        refreshToken: function () {
            return axios.post(`${Urls().api()}/o/auth-token/`, {

                client_id: cookie.load('auth_client_id', { path: '/' }),
                client_secret: cookie.load('auth_client_secret', { path: '/' }),
                refresh_token: cookie.load('refresh_token', { path: '/' }),
                grant_type: 'refresh_token'
            }
            )
        },
        refreshGalleryToken: function () {
            return axios.post(`${Urls().api()}/o/auth-token/`, {
                client_id: cookie.load('gallery_auth_client_id', { path: '/' }),
                client_secret: cookie.load('gallery_auth_client_secret', { path: '/' }),
                refresh_token: cookie.load('gallery_refresh_token', { path: '/' }),
                grant_type: 'refresh_token'
            }
            )
        },
        getAuthToken() {
            return cookie.load('access_token', { path: '/' });
        },
        setAccessToken(token) {
            return cookie.save('access_token', token, { path: '/' });
        },
        setRefreshToken(token) {
            return cookie.save('refresh_token', token, { path: '/' });
        },


        getGalleryAuthToken() {
            return cookie.load('gallery_access_token', { path: '/' });
        },
        setGalleryAccessToken(token) {
            return cookie.save('gallery_access_token', token, { path: '/' });
        },
        setGalleryRefreshToken(token) {
            return cookie.save('gallery_refresh_token', token, { path: '/' });
        },
        RemoveClientIDSecret() {
            cookie.remove('client_id');
            cookie.remove('client_secret')
        },
        RemoveAuthClientIDSecret() {
            cookie.remove('auth_client_id');
            cookie.remove('auth_client_secret')
        },
        GalleryLogout() {
            cookie.save('gallery_access_token', null, { path: '/' });
            cookie.remove('gallery_access_token');
            cookie.remove('gallery_refresh_token')
        },
        logout() {
            cookie.save('access_token', null, { path: '/' });
            cookie.remove('access_token');
            cookie.remove('token_type')
            cookie.remove('refresh_token')
            // axios.get('/accounts/logout/').then((response) => {
            //     if (!window.location.href.includes('/mag/'))
            //         window.location = '/'
            // })
            // .catch(function (error) { });
        },
        removeLoginedUser() {
            cookie.remove('access_token');
            cookie.remove('refresh_token')
        }
    }
}
