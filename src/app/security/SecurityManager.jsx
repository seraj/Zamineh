import axios from "axios";
import cookie from "react-cookies";
import Urls from "../components/Urls";

export default function SecurityManager() {
  return {
    checkForLogin: function() {
      return axios
        .post("https://test.com/", {
          client_id: cookie.load("auth_client_id", { path: "/" }),
          client_secret: cookie.load("auth_client_secret", { path: "/" }),
          grant_type: "refresh_token"
        })
        .then(response => {
          cookie.save("access_token", response.data.access_token, {
            path: "/"
          });
          cookie.save("token_type", response.data.token_type, { path: "/" });

          return true;
        })
        .catch(function(error) {
          // cookie.save('access_token', null, { path: '/' });
          return false;
        });
    },
    isLogined() {
      var auth_token = cookie.load("access_token", { path: "/" });
      if (auth_token && auth_token != "null") {
        return true;
      } else {
        return false;
      }
    },

    refreshToken: function() {
      return axios.post(`${Urls().api()}/o/auth-token/`, {
        client_id: cookie.load("auth_client_id", { path: "/" }),
        client_secret: cookie.load("auth_client_secret", { path: "/" }),
        refresh_token: cookie.load("refresh_token", { path: "/" }),
        grant_type: "refresh_token"
      });
    },

    getAuthToken() {
      return cookie.load("access_token", { path: "/" });
    },
    setAccessToken(token) {
      return cookie.save("access_token", token, { path: "/" });
    },
    setRefreshToken(token) {
      return cookie.save("refresh_token", token, { path: "/" });
    },

    RemoveClientIDSecret() {
      cookie.remove("client_id");
      cookie.remove("client_secret");
    },
    RemoveAuthClientIDSecret() {
      cookie.remove("auth_client_id");
      cookie.remove("auth_client_secret");
    },

    removeLoginedUser() {
      console.log("remove");
      cookie.save("access_token", null, { path: "/" });
      cookie.remove("access_token");
      cookie.remove("token_type");
      cookie.remove("refresh_token");
    },

    //Gallery Registration Cookies

    getGalleryRegAuthToken() {
      return cookie.load("gallery_access_token", {
        path: Urls().GalleryPanel()
      });
    },
    setGalleryRegAccessToken(token) {
      return cookie.save("gallery_access_token", token, {
        path: Urls().GalleryPanel()
      });
    },
    setGalleryRegRefreshToken(token) {
      return cookie.save("gallery_refresh_token", token, {
        path: Urls().GalleryPanel()
      });
    },
    hasGalleryRegToken() {
      var gallery_access_token = cookie.load("gallery_access_token", {
        path: Urls().GalleryPanel()
      });
      if (gallery_access_token && gallery_access_token != "null") {
        return true;
      } else {
        return false;
      }
    },
    setGalleryRegClientIDSecret(id, secret) {
      cookie.save("gallery_auth_client_id", id, {
        path: Urls().GalleryPanel()
      });
      cookie.save("gallery_auth_client_secret", secret, {
        path: Urls().GalleryPanel()
      });
    },
    refreshGalleryRegToken: function() {
      return axios.post(`${Urls().api()}/o/auth-token/`, {
        client_id: cookie.load("gallery_auth_client_id", {
          path: Urls().GalleryPanel()
        }),
        client_secret: cookie.load("gallery_auth_client_secret", {
          path: Urls().GalleryPanel()
        }),
        refresh_token: cookie.load("gallery_refresh_token", {
          path: Urls().GalleryPanel()
        }),
        grant_type: "refresh_token"
      });
    },
    GalleryRegLogout() {
      cookie.save("gallery_access_token", null, {
        path: Urls().GalleryPanel()
      });
      cookie.remove("gallery_access_token");
      cookie.remove("gallery_refresh_token");
    },

    //Artist Registration Cookies
    getArtistRegAuthToken() {
      return cookie.load("artist_access_token", { path: Urls().ArtistPanel() });
    },
    setArtistRegAccessToken(token) {
      return cookie.save("artist_access_token", token, {
        path: Urls().ArtistPanel()
      });
    },
    setArtistRegRefreshToken(token) {
      return cookie.save("artist_refresh_token", token, {
        path: Urls().ArtistPanel()
      });
    },
    hasArtistRegToken() {
      var artist_access_token = cookie.load("artist_access_token", {
        path: Urls().ArtistPanel()
      });
      if (artist_access_token && artist_access_token != "null") {
        return true;
      } else {
        return false;
      }
    },
    refreshArtistRegToken: function() {
      return axios.post(`${Urls().api()}/o/auth-token/`, {
        client_id: cookie.load("artist_auth_client_id", {
          path: Urls().ArtistPanel()
        }),
        client_secret: cookie.load("artist_auth_client_secret", {
          path: Urls().ArtistPanel()
        }),
        refresh_token: cookie.load("artist_refresh_token", {
          path: Urls().ArtistPanel()
        }),
        grant_type: "refresh_token"
      });
    },
    setArtistRegClientIDSecret(id, secret) {
      cookie.save("artist_auth_client_id", id, { path: Urls().ArtistPanel() });
      cookie.save("artist_auth_client_secret", secret, {
        path: Urls().ArtistPanel()
      });
    },
    ArtistRegLogout() {
      cookie.save("artist_access_token", null, { path: Urls().ArtistPanel() });
      cookie.remove("artist_access_token");
      cookie.remove("artist_refresh_token");
    },

    getClientIDSecret(type, page) {
      if (type == "secret") {
        if (page == "Client" || page == "client") {
          return cookie.load("auth_client_secret", { path: "/" });
        } else if (page == "Gallery" || page == "gallery") {
          return cookie.load("gallery_auth_client_secret", {
            path: Urls().GalleryPanel()
          });
        } else if (page == "Artist" || page == "artist") {
          return cookie.load("artist_auth_client_secret", {
            path: Urls().ArtistPanel()
          });
        }
      }
      if (type == "id") {
        if (page == "Client" || page == "client") {
          return cookie.load("auth_client_id", { path: "/" });
        } else if (page == "Gallery" || page == "gallery") {
          return cookie.load("gallery_auth_client_id", {
            path: Urls().GalleryPanel()
          });
        } else if (page == "Artist" || page == "artist") {
          return cookie.load("artist_auth_client_id", {
            path: Urls().ArtistPanel()
          });
        }
      }
    },

    // Logout

    logout(client, userType, playerId) {
      var url;
      switch (client) {
        case "artist":
          url = "gallery-app/gallery";
          break;
        case "gallery":
          url = "gallery-app/gallery";
          break;
        case "client":
          url = "client-app/client";
          break;
        default:
          url = "client-app/client/ddd";
      }
      axios
        .post(
          `${Urls().api()}/${url}/logout/`,
          {
            client_id: this.getClientIDSecret("id", client),
            client_secret: this.getClientIDSecret("secret", client),
            user_type: userType ? userType : null,
            player_id: playerId ? playerId : 1234456
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          }
        )
        .then(res => {
          this.handleRemoveCookies(client);
          window.location.replace("/");
        })
        .catch(err => {
          // window.location.replace("/");
        });
    },
    handleRemoveCookies(client) {
      if (client === "client") {
        this.removeLoginedUser();
      } else if (client === "gallery") {
        this.GalleryRegLogout();
      } else if (client === "artist") {
        this.ArtistRegLogout();
      }
    },
    // Jury Panel
    setJuryPanelClientIDSecret(id, secret) {
      cookie.save("jury_auth_client_id", id, { path: Urls().JuryPanel() });
      cookie.save("jury_auth_client_secret", secret, {
        path: Urls().JuryPanel()
      });
    }
  };
}
