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

        refreshToken: function () {
            return axios.post(`${Urls().api()}/o/auth-token/`, {

                client_id: cookie.load('auth_client_id', { path: '/' }),
                client_secret: cookie.load('auth_client_secret', { path: '/' }),
                refresh_token: cookie.load('refresh_token', { path: '/' }),
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


        RemoveClientIDSecret() {
            cookie.remove('client_id');
            cookie.remove('client_secret')
        },
        RemoveAuthClientIDSecret() {
            cookie.remove('auth_client_id');
            cookie.remove('auth_client_secret')
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
        },











        //Gallery Registration Cookies
        getGalleryRegAuthToken() {
            return cookie.load('gallery_access_token', { path: Urls().GalleryRegistration() });
        },
        setGalleryRegAccessToken(token) {
            return cookie.save('gallery_access_token', token, { path: Urls().GalleryRegistration() });
        },
        setGalleryRegRefreshToken(token) {
            return cookie.save('gallery_refresh_token', token, { path: Urls().GalleryRegistration() });
        },
        hasGalleryRegToken() {
            var gallery_access_token = cookie.load('gallery_access_token', { path: Urls().GalleryRegistration() });
            if (gallery_access_token && gallery_access_token != 'null') {
                return true
            } else {
                return false
            }
        },
        setGalleryRegClientIDSecret(id, secret) {
            cookie.save('gallery_auth_client_id', id, { path: Urls().GalleryRegistration() });
            cookie.save('gallery_auth_client_secret', secret, { path: Urls().GalleryRegistration() });
        },
        refreshGalleryRegToken: function () {
            return axios.post(`${Urls().api()}/o/auth-token/`, {
                client_id: cookie.load('gallery_auth_client_id', { path: Urls().GalleryRegistration() }),
                client_secret: cookie.load('gallery_auth_client_secret', { path: Urls().GalleryRegistration() }),
                refresh_token: cookie.load('gallery_refresh_token', { path: Urls().GalleryRegistration() }),
                grant_type: 'refresh_token'
            }
            )
        },
        GalleryRegLogout() {
            cookie.save('gallery_access_token', null, { path: Urls().GalleryRegistration() });
            cookie.remove('gallery_access_token');
            cookie.remove('gallery_refresh_token')
        },





        //Artist Registration Cookies
        getArtistRegAuthToken() {
            return cookie.load('artist_access_token', { path: Urls().ArtistRegistration() });
        },
        setArtistRegAccessToken(token) {
            return cookie.save('artist_access_token', token, { path: Urls().ArtistRegistration() });
        },
        setArtistRegRefreshToken(token) {
            return cookie.save('artist_refresh_token', token, { path: Urls().ArtistRegistration() });
        },
        hasArtistRegToken() {
            var artist_access_token = cookie.load('artist_access_token', { path: Urls().ArtistRegistration() });
            if (artist_access_token && artist_access_token != 'null') {
                return true
            } else {
                return false
            }
        },
        refreshArtistRegToken: function () {
            return axios.post(`${Urls().api()}/o/auth-token/`, {
                client_id: cookie.load('artist_auth_client_id', { path: Urls().ArtistRegistration() }),
                client_secret: cookie.load('artist_auth_client_secret', { path: Urls().ArtistRegistration() }),
                refresh_token: cookie.load('artist_refresh_token', { path: Urls().ArtistRegistration() }),
                grant_type: 'refresh_token'
            }
            )
        },
        setArtistRegClientIDSecret(id, secret) {
            cookie.save('artist_auth_client_id', id, { path: Urls().ArtistRegistration() });
            cookie.save('artist_auth_client_secret', secret, { path: Urls().ArtistRegistration() });
        },
        ArtistRegLogout() {
            cookie.save('artist_access_token', null, { path: Urls().ArtistRegistration() });
            cookie.remove('artist_access_token');
            cookie.remove('artist_refresh_token')
        },


        getRegClientIDSecret(type, page) {

            if (type == 'secret') {
                if (page == 'Gallery') {
                    return cookie.load('gallery_auth_client_secret', { path: Urls().GalleryRegistration() })
                } else {
                    return cookie.load('artist_auth_client_secret', { path: Urls().ArtistRegistration() })
                }
            }
            if (type == 'id') {
                if (page == 'Gallery') {
                    return cookie.load('gallery_auth_client_id', { path: Urls().GalleryRegistration() })
                } else {
                    return cookie.load('artist_auth_client_id', { path: Urls().ArtistRegistration() })
                }
            }
        }

    }
}
