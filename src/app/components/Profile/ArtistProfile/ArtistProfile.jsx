import React from "react";

import {
  BrowserRouter as Router,
  withRouter,
  Route,
  Link
} from "react-router-dom";
import axios from "axios";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import queryString from "query-string";
import { Toast } from "../../Toast/Toast";

import SecurityManager from "../../../security/SecurityManager";
import Modal from "../../ui-components/Modal/Modal";

import { ArtistProfileMetaTag } from "../../Metatags/Metatags";

import { LinearTabs } from "../../ui-components/Tabs/Tabs";
import {
  Tabz,
  Settings,
  Notification,
  Transactions,
  Ticket
} from "./ArtistProfileTabs";
import { Img } from "../../General";

import Urls from "../../Urls";
import Section from "../../Section/Section";

import { Loading } from "../../Spinner/Spinner";
import NumbersConvertor from "../../NumbersConvertor";
import ThousandSeparator from "../../ThousandSeparator";

import styles from "../Profile.scss";

function NothingRendered() {
  return (
    <Section ExtraClass={"content singlePage"}>
      <h2>nothingRendered</h2>
    </Section>
  );
}

class ArtistProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: [],
      loading: "",
      tabs: [
        {
          title: "آثار",
          value: "arts"
        },
        {
          title: "مجموعه‌ها",
          value: "collections"
        },
        {
          title: "نمایشگاه‌ها",
          value: "shows"
        },
        {
          title: "ویرایش اطلاعات",
          value: "settings"
        },
        {
          title: "رخدادها",
          value: "notification"
        },
        {
          title: "تراکنش‌ها",
          value: "transactions"
        },
        {
          title: "تیکت پشتیبانی",
          value: "ticket"
        }
      ]
    };
  }
  componentDidMount() {
    if (
      location.pathname === `/panel/artist/dashboard` ||
      location.pathname === `/panel/artist/dashboard/`
    ) {
      window.location.replace(`${Urls().ArtistDashboard()}arts`);
    }
    this.getConfig();
  }
  getConfig = slug => {
    axios.get(`${Urls().api()}/gallery-app/panel/`).then(response => {
      this.setState({
        config: response.data
      });
    });
  };

  tabComponents = tab => {
    var component;
    switch (tab) {
      case "arts":
        component = <Tabz type="art" />;
        break;
      case "collections":
        component = <Tabz type="collection" />;
        break;
      case "shows":
        component = <Tabz type="show" />;
        break;
      case "settings":
        component = <Settings Config={this.state.config} />;
        break;
      case "notification":
        component = <Notification />;
        break;
      case "transactions":
        component = <Transactions />;
        break;
      case "ticket":
        component = <Ticket />;
        break;
      default:
        component = <NothingRendered />;
    }
    return component;
  };

  render() {
    const parsed = queryString.parse(location.search);
    const { config, tabs, loading } = this.state;

    return (
      <>
        <ArtistProfileMetaTag />
        <Section ExtraClass={"content singlePage"}>
          <div
            className={styles.userCover}
            style={{
              backgroundImage: `url(${config.cover !== "" ? config.cover : ""})`
            }}
          >
            {loading === "cover" ? <Loading text="" /> : ""}
            <button className={styles.editCover}>
              <input
                onChange={e => this.uploadImage(e, "cover")}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
              />
              ویرایش کاور گالری
            </button>
            <Container>
              <Row>
                <Col xs={12}>
                  <div className={styles.user}>
                    <div className="img">
                      {config.logo && config.logo !== "" ? (
                        <Img
                          img={config.logo}
                          alt={config.name}
                          width={100}
                          height={100}
                          style={{
                            minWidth: 50
                          }}
                        />
                      ) : (
                        <img
                          src="/static/img/avatar.png"
                          width="100"
                          height="100"
                          style={{
                            minWidth: 50
                          }}
                          alt={config.name}
                        />
                      )}
                      <button className={`editable`}>
                        {loading === "logo" ? (
                          <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fal"
                            data-icon="spinner-third"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            class="svg-inline--fa fa-spinner-third fa-w-16 fa-spin fa-lg"
                          >
                            <path
                              fill="currentColor"
                              d="M460.115 373.846l-6.941-4.008c-5.546-3.202-7.564-10.177-4.661-15.886 32.971-64.838 31.167-142.731-5.415-205.954-36.504-63.356-103.118-103.876-175.8-107.701C260.952 39.963 256 34.676 256 28.321v-8.012c0-6.904 5.808-12.337 12.703-11.982 83.552 4.306 160.157 50.861 202.106 123.67 42.069 72.703 44.083 162.322 6.034 236.838-3.14 6.149-10.75 8.462-16.728 5.011z"
                              class=""
                            />
                          </svg>
                        ) : (
                          ""
                        )}
                        <input
                          onChange={e => this.uploadImage(e, "logo")}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                        />
                        <div className="icon">
                          <i class="fal fa-image" />
                        </div>
                      </button>
                    </div>
                    <div className="detail">
                      <div className="info">
                        <h1>{config.name}</h1>
                      </div>
                      <div className="list">
                        {config.saved_art_count !== 0 && (
                          <span>
                            {NumbersConvertor().convertToPersian(
                              config.saved_art_count
                            )}{" "}
                            اثر ذخیره شده دارید,{" "}
                          </span>
                        )}
                        {config.artist_follow_count !== 0 && (
                          <span>
                            {NumbersConvertor().convertToPersian(
                              config.artist_follow_count
                            )}{" "}
                            هنرمند دنبال میکنید,{" "}
                          </span>
                        )}
                        {config.medium_follow_count !== 0 && (
                          <span>
                            {NumbersConvertor().convertToPersian(
                              config.medium_follow_count
                            )}{" "}
                            بستر دنبال میکنید,{" "}
                          </span>
                        )}
                        {config.genre_follow_count !== 0 && (
                          <span>
                            {NumbersConvertor().convertToPersian(
                              config.genre_follow_count
                            )}{" "}
                            ژانر دنبال میکنید,{" "}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
          <Container>
            <Row>
              <Col xs={12}>
                <>
                  <LinearTabs
                    tabs={tabs}
                    slug={`${Urls().ArtistDashboard()}`}
                  />
                  <div className={styles.content}>
                    {tabs &&
                      tabs.map((tabs, index) => (
                        <Route
                          key={index}
                          path={`${Urls().ArtistDashboard()}${tabs.value}`}
                          render={() => this.tabComponents(tabs.value)}
                        />
                      ))}
                  </div>
                </>
              </Col>
            </Row>
          </Container>
        </Section>
      </>
    );
  }
}
export default withRouter(ArtistProfile);
