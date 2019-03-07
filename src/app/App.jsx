import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import axios from "axios";
import { ToastMessageBox, Toast } from "./components/Toast/Toast";
import queryString from "query-string";
import { isMobile } from "react-device-detect";

import cookie from "react-cookies";
import SecurityManager from "./security/SecurityManager";
import Urls from "./components/Urls";

import RequestHandler from "./security/RequestHandler";
/* Components */
import Routing from "./Routing";
import Login from "./login/Login";
import Header from "./components/Header/Header";
import AppFooter from "./AppFooter";

import "./static/App.scss";

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
    };
    RequestHandler;
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
  };
  getClientsIDSecret = async () => {
    const Panels = window.location.href.includes("panel/");
    const ArtistPanel = window.location.href.includes(Urls().ArtistProfile());
    const GalleryPanel = window.location.href.includes(Urls().GalleryProfile());
    const JuryPanel = window.location.href.includes(Urls().JuryPanel());

    try {
      var client_id = cookie.load("client_id", { path: "/" });
      var client_secret = cookie.load("client_secret", { path: "/" });
      var auth_client_id = cookie.load("auth_client_id", { path: "/" });

      var galleryReg_auth_client_id = cookie.load("gallery_auth_client_id", {
        path: Urls().GalleryProfile()
      });
      var artistReg_auth_client_secret = cookie.load(
        "artist_auth_client_secret",
        { path: Urls().ArtistProfile() }
      );
      var jury_auth_client_id = cookie.load("jury_auth_client_id", {
        path: Urls().JuryPanel()
      });

      if (Panels) {
        if (JuryPanel) {
          if (jury_auth_client_id == "" || jury_auth_client_id == undefined) {
            await axios
              .post(`${Urls().api()}/a9pY5kS7L3KgG44r/KKu6wWGVbn5Kq/`, {
                is_jury: true
              })
              .then(response => {
                SecurityManager().setJuryPanelClientIDSecret(
                  response.data.client_id,
                  response.data.client_secret
                );
              });
          }
        }
        if (GalleryPanel) {
          if (
            galleryReg_auth_client_id == "" ||
            galleryReg_auth_client_id == undefined
          ) {
            await axios
              .post(`${Urls().api()}/a9pY5kS7L3KgG44r/KKu6wWGVbn5Kq/`, {
                is_gallery: true
              })
              .then(response => {
                SecurityManager().setGalleryRegClientIDSecret(
                  response.data.client_id,
                  response.data.client_secret
                );
              });
          }
        }
        if (ArtistPanel) {
          if (
            artistReg_auth_client_secret == "" ||
            artistReg_auth_client_secret == undefined
          ) {
            await axios
              .post(`${Urls().api()}/a9pY5kS7L3KgG44r/KKu6wWGVbn5Kq/`, {
                is_gallery: true
              })
              .then(response => {
                SecurityManager().setArtistRegClientIDSecret(
                  response.data.client_id,
                  response.data.client_secret
                );
              });
          }
        }
      }

      if (auth_client_id == "" || auth_client_id == undefined) {
        await axios
          .post(`${Urls().api()}/a9pY5kS7L3KgG44r/KKu6wWGVbn5Kq/`)
          .then(response => {
            cookie.save("auth_client_id", response.data.client_id, {
              path: "/"
            });
            cookie.save("auth_client_secret", response.data.client_secret, {
              path: "/"
            });
          });
        auth_client_id = await cookie.load("auth_client_id", { path: "/" });
        auth_client_secret = await cookie.load("auth_client_secret", {
          path: "/"
        });
      }

      if (client_id == "" || client_id == undefined) {
        await axios
          .post(`${Urls().api()}/2sFrKCs7p8L5fhtV/me37TEkRuXKVz/`)
          .then(response => {
            cookie.save("client_id", response.data.client_id, { path: "/" });
            cookie.save("client_secret", response.data.client_secret, {
              path: "/"
            });
          });
        client_id = await cookie.load("client_id", { path: "/" });
        client_secret = await cookie.load("client_secret", { path: "/" });
      }
      await this.callConfingAPI(client_id, client_secret);
    } catch (error) {
      console.log(error);
    }
  };

  callConfingAPI = (ID, Secret) => {
    var body = {
      client_id: ID,
      client_secret: Secret
    };
    axios({
      method: "post",
      url: `${Urls().api()}/configs/`,
      data: body,
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(response => {
        this.setState({
          baseContent: response.data
        });
      })
      .catch(response => {
        console.log(response);
      });
  };
  getUserInfo = () => {
    axios
      .get("/api/user-profile/")
      .then(response => {
        this.setState({ userInfo: response.data });
      })
      .catch(function(error) {});
  };
  openModal = value => {
    this.setState({
      LoginModal: value
    });
  };
  onLogoutClick = () => {
    this.setState({ userInfo: null });
    SecurityManager().logout();
    this.forceUpdate();
  };
  render() {
    const isLogined = SecurityManager().isLogined();
    const { nav_list } = this.state.baseContent;
    const parsed = queryString.parse(location.search);
    return (
      <>
        <ToastMessageBox />
        {(parsed["xeYDSM2fWgsJvFuN"] == "ios" ||
          parsed["xeYDSM2fWgsJvFuN"] == "android") &&
        isMobile ? null : (
          <Header
            isLogined={isLogined}
            onLogoutClick={this.onLogoutClick}
            onMenuClick={this.updateApp}
            navList={nav_list}
            openModal={this.openModal}
          />
        )}
        <Routing isLogined={isLogined} />

        <Login
          hasModal
          modalisOpen={this.state.LoginModal}
          openModal={this.openModal}
        />
        {(parsed["xeYDSM2fWgsJvFuN"] == "ios" ||
          parsed["xeYDSM2fWgsJvFuN"] == "android") &&
        isMobile ? null : (
          <AppFooter />
        )}
      </>
    );
  }
}
export default withRouter(App);
