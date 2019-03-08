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
import { Toast } from "../Toast/Toast";

import SecurityManager from "../../security/SecurityManager";
import Modal from "../ui-components/Modal/Modal";
import { AddCredit } from "./ProfileForms";

import { LinearTabs } from "../ui-components/Tabs/Tabs";
import {
  Saves,
  Settings,
  Notification,
  Transactions,
  ReportBug
} from "./ProfileTabs";
import { Img } from "../General";

import Login from "../../login/Login";
import Urls from "../Urls";
import Section from "../Section/Section";

import NumbersConvertor from "../NumbersConvertor";
import ThousandSeparator from "../ThousandSeparator";

import { Loading } from "../Spinner/Spinner";
import styles from "./Profile.scss";

function NothingRendered() {
  return (
    <Section ExtraClass={"content singlePage"}>
      <h2>nothingRendered</h2>
    </Section>
  );
}

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {},
      loading: "",
      credit: {
        modal: false,
        btn: "افزایش اعتبار",
        loading: false
      },
      tabs: [
        {
          title: "ذخیره شده‌ها",
          value: "saves"
        },
        {
          title: "تنظیمات",
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
          title: "گزارش باگ",
          value: "report"
        }
      ]
    };
  }
  componentDidMount() {
    if (
      location.pathname === `/client/profile` ||
      location.pathname === `/client/profile/`
    ) {
      window.location.replace(`${Urls().profile()}saves`);
    }
    this.getConfig();
  }
  getConfig = slug => {
    axios.get(`${Urls().api()}/client-app/client/profile/`).then(response => {
      this.setState({
        config: response.data
      });
    });
  };

  tabComponents = tab => {
    var component;
    switch (tab) {
      case "saves":
        component = <Saves />;
        break;
      case "settings":
        component = <Settings />;
        break;
      case "notification":
        component = <Notification />;
        break;
      case "transactions":
        component = <Transactions />;
        break;
      case "report":
        component = <ReportBug />;
        break;
      default:
        component = <NothingRendered />;
    }
    return component;
  };

  onFollowClick = id => {
    console.log("not Handled!");
    // axios.post(`${Urls().api()}/follow/toggle/`, {
    //     id: id,
    //     type: 'galleries'
    // }).then((response) => {
    //     this.setState({
    //         config: {
    //             ...this.state.config,
    //             is_flw: response.data.state
    //         }
    //     });
    // })
  };
  addCreditSubmit = values => {
    this.setState({
      credit: {
        ...this.state.credit,
        loading: true
      }
    });
    axios
      .post(`${Urls().api()}/client-app/credit/charge/`, values, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
      .then(({ data }) => {
        // console.log(data)
        this.setState({
          credit: {
            ...this.state.credit,
            btn: "در حال انتقال به بانک"
          }
        });
        window.location.replace(data.url);
      })
      .catch(err => {
        Toast("warning", `مشکلی پیش آمده است!`);
        this.setState({
          credit: {
            ...this.state.credit,
            loading: false
          }
        });
      });
  };
  openCreditModal = value => {
    this.setState({
      credit: {
        ...this.state.credit,
        modal: value
      }
    });
  };
  closeCreditModal = () => {
    this.setState({
      credit: {
        ...this.state.credit,
        modal: false
      }
    });
  };

  uploadImage = (e, type) => {
    let file = e.target.files[0];
    let config = this.state.config;
    this.setState({ loading: type });
    const formData = new FormData();
    formData.append("image", file, file.name);
    const url = `${Urls().api()}/client-app/client/add-image/`;
    axios({
      method: "POST",
      url: `${url}`,
      data: formData,
      config: {
        headers: {}
      }
    })
      .then(response => {
        config.profile_pic = response.data.link;
        Toast("success", "عکس با موفقیت آپلود شد.");
        this.setState({
          loading: "",
          config
        });
      })

      .catch(error => {
        Toast("warning", "مشکلی در بارگذاری عکس به وجود آمده است.");
        this.setState({ loading: "" });
      });
  };
  render() {
    const parsed = queryString.parse(location.search);
    const { config, tabs, credit, loading } = this.state;
    const isLogined = SecurityManager().isLogined();

    return (
      <>
        <Section ExtraClass={"content singlePage"}>
          <Container>
            <Row>
              <Col xs={12}>
                <div className={styles.user}>
                  <div className="img">
                    {config.profile_pic && config.profile_pic !== "" ? (
                      <Img
                        img={config.profile_pic}
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
                      {loading === "profile" ? (
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
                        onChange={e => this.uploadImage(e, "profile")}
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
                      <span>
                        اعتبار شما :
                        {NumbersConvertor().convertToPersian(config.credit)}
                      </span>
                      <div
                        onClick={() => this.openCreditModal(true)}
                        className="creditbtn"
                      >
                        افزایش اعتبار
                      </div>
                    </div>
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
                    <br />
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
                <>
                  <LinearTabs tabs={tabs} slug={`${Urls().profile()}`} />
                  <div className={styles.content}>
                    {tabs &&
                      tabs.map((tabs, index) => (
                        <Route
                          key={index}
                          path={`${Urls().profile()}${tabs.value}`}
                          render={() => this.tabComponents(tabs.value)}
                        />
                      ))}
                  </div>
                </>
              </Col>
            </Row>
          </Container>
        </Section>

        <Modal
          isOpen={credit.modal}
          toggle={this.closeCreditModal}
          title={"افزایش اعتبار"}
        >
          <Row>
            <Col xs={12}>
              <AddCredit
                loading={credit.loading}
                btn={credit.btn}
                handleSubmit={this.addCreditSubmit}
              />
            </Col>
          </Row>
        </Modal>
      </>
    );
  }
}
export default withRouter(Profile);
