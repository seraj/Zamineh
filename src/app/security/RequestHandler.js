import axios from "axios";
import Urls from "../components/Urls";
import SecurityManager from "../security/SecurityManager";
import { Toast } from "../components/Toast/Toast";

axios.defaults.baseURL = Urls().api();
axios.defaults.timeout = 10000;
const Panels = window.location.href.includes("panel/");
const ArtistPanels = window.location.href.includes(Urls().ArtistPanel());
const GalleryPanels = window.location.href.includes(Urls().GalleryPanel());

axios.interceptors.request.use(
  function(config) {
    var token = "";
    if (Panels) {
      token = GalleryPanels
        ? SecurityManager().getGalleryRegAuthToken()
        : SecurityManager().getArtistRegAuthToken();
    } else {
      token = SecurityManager().getAuthToken();
    }

    if (token && token !== null && token !== "null") {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }
    return config;
  },
  error => Promise.reject(error)
);
let isRefreshing = false;
let subscribers = [];

axios.interceptors.response.use(undefined, err => {
  const {
    config,
    response: { status, data }
  } = err;

  const originalRequest = config;
  if (status === 400) {
    data.error ? Toast("error", data.error) : null;
  }
  if (status >= 500) {
    Toast("error", "مشکلی رخ داده است.لطفا دوباره تلاش نمایید");
  }
  if (status === 401) {
    if (Panels) {
      if (GalleryPanels) {
        if (!isRefreshing) {
          isRefreshing = true;
          SecurityManager()
            .refreshGalleryRegToken()
            .then(respaonse => {
              const { data } = respaonse;
              isRefreshing = false;
              onRrefreshed(data.access_token);
              SecurityManager().setGalleryRegAccessToken(data.access_token);
              SecurityManager().setGalleryRegRefreshToken(data.refresh_token);
              subscribers = [];
            });
        } else {
          SecurityManager().GalleryRegLogout();
        }
      }
      if (ArtistPanels) {
        if (!isRefreshing) {
          isRefreshing = true;
          SecurityManager()
            .refreshArtistRegToken()
            .then(respaonse => {
              const { data } = respaonse;
              isRefreshing = false;
              onRrefreshed(data.access_token);
              SecurityManager().setArtistRegAccessToken(data.access_token);
              SecurityManager().setArtistRegRefreshToken(data.refresh_token);
              subscribers = [];
            });
        } else {
          SecurityManager().ArtistRegLogout();
        }
      }
    } else {
      if (!isRefreshing) {
        isRefreshing = true;
        SecurityManager()
          .refreshToken()
          .then(respaonse => {
            const { data } = respaonse;
            isRefreshing = false;
            onRrefreshed(data.access_token);
            SecurityManager().setAccessToken(data.access_token);
            SecurityManager().setRefreshToken(data.refresh_token);
            subscribers = [];
          });
      } else {
        SecurityManager().logout();
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
  return Promise.reject(err);
});
function subscribeTokenRefresh(cb) {
  subscribers.push(cb);
}

function onRrefreshed(token) {
  subscribers.map(cb => cb(token));
}
