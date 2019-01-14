import axios from 'axios';
import LocalSetting from '../LocalSetting';
import SecurityManager from './SecurityManager'

const request = axios.create({
  baseURL: LocalSetting.getConfig().baseUrl,
  timeout: 10000
});
console.log(`token is ${SecurityManager().getAuthToken()}`)
request.interceptors.request.use(
  config => {
    const token = SecurityManager().getAuthToken();
    if (token) {
      config.headers.Authorization = `SBearer ${token}`;
    }

    const url = config.url.split('/');

    if (url[url.length - 1] === 'login') {
      delete config.headers['Authorization'];
    }

    return config;
  },
  error => Promise.reject(error),
);

let isRefreshing = false;

let subscribers = [];

request.interceptors.response.use(undefined, err => {
  const { config, response: { status } } = err;
  const originalRequest = config;

  if (status === 401) {
    console.log('401')
    if (!isRefreshing) {
      isRefreshing = true;
      SecurityManager().refreshToken().then(respaonse => {
        const { data } = respaonse;
        isRefreshing = false;
        onRrefreshed(data.access_token);
        SecurityManager().setAccessToken(data.access_token);
        SecurityManager().setRefreshToken(data.refresh_token);
        subscribers = [];
      })
    }
    const requestSubscribers = new Promise(resolve => {
      subscribeTokenRefresh(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        resolve(axios(originalRequest));
      });
    });
    return requestSubscribers;
  }
  return Promise.reject(err);
});

function subscribeTokenRefresh(cb) {
  subscribers.push(cb);
}

function onRrefreshed(token) {
  subscribers.map(cb => cb(token));
}

export default request;