import React from "react";

import { withRouter, Link, Redirect } from "react-router-dom";
import axios from "axios";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import queryString from "query-string";
import { Toast } from "../Toast/Toast";
import Modal from "../ui-components/Modal/Modal";

import SecurityManager from "../../security/SecurityManager";

import Login from "../../login/Login";
import Urls from "../Urls";
import Section from "../Section/Section";
import FollowInline from "../ui-components/FollowInline";

import { SingleArtWorkMetaTag } from "../Metatags/Metatags";
import ArtCarousel from "./ArtCarousel";
import ArtOtherWork from "./ArtOtherWork";
import NumbersConvertor from "../NumbersConvertor";
import ThousandSeparator from "../ThousandSeparator";
import AboutSection from "../ui-components/AboutSection";
import Payment from "../Payment/Payment";
import { Loading } from "../Spinner/Spinner";

import DefaultStyle from "../../static/scss/_boxStyle.scss";
import styles from "./ArtWork.scss";

class ArtWork extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seeArtModal: {
        modal: false,
        title: "",
        context: "",
        btn: "افزایش اعتبار",
        loading: false
      },
      BuyModal: {
        modal: false,
        cart_serial: null,
        title: "",
        context: "",
        btn: "افزایش اعتبار",
        loading: false
      },
      config: {},
      artItems: {},
      loading: "",
      login: false
    };
  }
  componentDidMount() {
    this.getConfig(this.props.match.params.slug);
    this.getArtItems(this.props.match.params.slug);
  }
  getConfig = slug => {
    axios.get(`${Urls().api()}/art/${slug}/`).then(({ data }) => {
      this.setState({
        config: data
      });
    });
  };
  getArtItems = slug => {
    axios
      .get(`${Urls().api()}/art/${slug}/recommendations/`)
      .then(({ data }) => {
        this.setState({
          artItems: data
        });
      });
  };
  onSaveItemClick = () => {
    let Art = this.state.config;
    axios
      .post(`${Urls().api()}/art/save/toggle/`, { id: Art.id })
      .then(({ data }) => {
        Art.is_saved = data.state;
        this.setState({ Art });
      });
  };

  handleBuyArtClick = () => {
    let Art = this.state.config;
    axios
      .post(`${Urls().api()}/client-app/pay/start/`, {
        art_set: [
          {
            id: Art.id
          }
        ]
      })
      .then(({ data }) => {
        this.setState({
          BuyModal: {
            ...this.state.BuyModal,
            cart_serial: data.cart_serial,
            modal: true
          }
        });
        // window.location.replace(`${Urls().payment()}${data.cart_serial}`)
      });
  };
  onFollowClick = (id, type) => {
    const Type = type === "artist" ? "artists" : "galleries";
    let Config = this.state.config[type];
    axios
      .post(
        `${Urls().api()}/follow/toggle/`,
        {
          id: id,
          type: Type
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      )
      .then(({ data }) => {
        Config.is_flw = data.state;
        this.setState({
          ...this.state.config,
          Config
        });
      });
  };

  handleViewArtClick = () => {
    let Art = this.state.config;
    axios
      .post(`${Urls().api()}/client-app/art/buy/log/`, {
        id: Art.id,
        type: "See"
      })
      .then(({ data }) => {
        this.setState({
          seeArtModal: {
            ...this.state.seeArtModal,
            title: "بازدید از اثر هنری",
            context:
              "درخواست شما برای بازدید از این اثر هنری با موفقیت ثبت شد. کارشناسان واحد فروش زمینه در اسرع وقت، جهت هماهنگی زمان و شیوه بازدید از این اثر هنری با شما تماس خواهند گرفت.",
            modal: true
          }
        });
      })
      .catch(err => {
        if (err.response.status == 406) {
          this.setState({
            seeArtModal: {
              ...this.state.seeArtModal,
              title: "مشاهده اثر هنری",
              context:
                "شما یک درخواست برای مشاهده این اثر هنری ثبت کرده اید.کارشناسان واحد فروش زمینه در اسرع وقت، جهت انجام هماهنگیلازم با شما تماس خواهند گرفت. لطفا تا پایان بررسی درخواست خود شکیبا باشید",
              modal: true
            }
          });
        }
      });
  };
  openModal = value => {
    this.setState({
      login: value
    });
  };
  closeSeeArtModal = () => {
    this.setState({
      seeArtModal: {
        ...this.state.seeArtModal,
        modal: false
      }
    });
  };
  closeBuyArtModal = () => {
    this.setState({
      BuyModal: {
        ...this.state.BuyModal,
        modal: false
      }
    });
  };
  render() {
    const parsed = queryString.parse(location.search);
    const { config, login, BuyModal, seeArtModal, artItems } = this.state;
    const isLogined = SecurityManager().isLogined();

    return (
      <>
        <SingleArtWorkMetaTag
          title={config.name}
          slug={this.props.match.params.slug}
        />
        <Section ExtraClass={`content singlePage ${styles.art}`}>
          <Container>
            <Row>
              <Col lg={8} md={8} sm={8} xs={12}>
                {config && config.img_set && (
                  <ArtCarousel
                    items={config.img_set}
                    openModal={this.openModal}
                    isLogined={isLogined}
                    isSaved={config.is_saved}
                    onSaveItemClick={this.onSaveItemClick}
                  />
                )}
              </Col>
              <Col lg={4} md={4} sm={4} xs={12}>
                <div className={styles.artDetails}>
                  {config.artist && (
                    <>
                      <h1>{config.artist ? config.artist.name : ""}</h1>
                      <FollowInline
                        id={config.artist.id}
                        type="artists"
                        isFollowed={config.artist.is_flw}
                      />
                    </>
                  )}

                  <div className="art-details">
                    <span>{config.name}</span>
                    {config.detail && (
                      <>
                        <span>{config.detail.material}</span>
                        <span>
                          {NumbersConvertor().convertToPersian(
                            config.detail.width
                          )}{" "}
                          ×{" "}
                          {NumbersConvertor().convertToPersian(
                            config.detail.height
                          )}{" "}
                          ×{" "}
                          {NumbersConvertor().convertToPersian(
                            config.detail.depth
                          )}{" "}
                          {config.detail.unit}
                        </span>

                        <span className="sp">{config.detail.quote}</span>
                      </>
                    )}
                  </div>
                  <hr />
                  {config.is_in_gallery ? (
                    <div className={styles.buySection}>
                      {config.price && config.price.is_for_sale ? (
                        <>
                          {!config.price.is_sold ? (
                            <>
                              <h2>برای خرید تماس بگیرید</h2>
                              <Link
                                to={`${Urls().gallery()}${
                                  config.gallery.slug
                                }/contact/`}
                                style={{ width: "100%", marginBottom: 10 }}
                                className={`zbtn next black bradius`}
                              >
                                تماس با گالری <i className="fas fa-phone" />
                              </Link>
                              {config.gallery && (
                                <div className="gallery">
                                  <Link
                                    to={`${Urls().gallery()}${
                                      config.gallery.slug
                                    }`}
                                  >
                                    <div className="name">
                                      {config.gallery.name}
                                    </div>
                                  </Link>
                                </div>
                              )}
                            </>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  ) : (
                    <>
                      <div className={styles.buySection}>
                        {config.price && config.price.is_for_sale ? (
                          <>
                            {!config.price.is_sold ? (
                              <>
                                <h2>
                                  {NumbersConvertor().convertToPersian(
                                    ThousandSeparator(config.price.price)
                                  )}{" "}
                                  تومان
                                </h2>
                                <button
                                  onClick={() => this.handleBuyArtClick()}
                                  style={{ width: "100%", marginBottom: 10 }}
                                  className={`zbtn next black bradius`}
                                >
                                  خرید اثر <i class="fal fa-shopping-cart" />
                                </button>
                                <button
                                  onClick={
                                    isLogined
                                      ? () => this.handleViewArtClick()
                                      : () => this.openModal(true)
                                  }
                                  style={{ width: "100%", marginBottom: 10 }}
                                  className={`zbtn next white bradius`}
                                >
                                  بازدید از اثر
                                </button>
                              </>
                            ) : (
                              <button
                                disabled
                                style={{ width: "100%", marginBottom: 10 }}
                                className={`zbtn next white bradius`}
                              >
                                اثر فروخته شده
                              </button>
                            )}
                          </>
                        ) : null}
                      </div>
                    </>
                  )}
                </div>
              </Col>

              <Col lg={8} md={8} sm={8} xs={12}>
                <hr />
                <div className={styles.ArtBio}>
                  {config.gallery != null && (
                    <AboutSection
                      img={config.gallery.logo}
                      title={config.gallery.name}
                      underTitle={"تهران"}
                      context={config.gallery.about}
                      follow={config.gallery}
                      type="galleries"
                      id={config.gallery.id}
                      url={`${Urls().gallery()}${
                        config.gallery.slug
                      }/overview/`}
                    />
                  )}
                  {config.artist && (
                    <AboutSection
                      img={config.artist.profile_pic}
                      title={config.artist.name}
                      underTitle={config.artist.detail}
                      context={config.artist.bio}
                      type="artists"
                      follow={config.artist}
                      id={config.artist.id}
                      url={`${Urls().artist()}${config.artist.slug}/overview/`}
                    />
                  )}
                </div>
              </Col>
            </Row>

            <Row>
              {artItems !== "" && (
                <ArtOtherWork items={artItems} config={config} />
              )}
            </Row>
          </Container>
        </Section>

        <Login hasModal modalisOpen={login} openModal={this.openModal} />
        <Modal
          isOpen={seeArtModal.modal}
          toggle={this.closeSeeArtModal}
          title={seeArtModal.title}
        >
          <Row>
            <Col xs={12}>
              <p>{seeArtModal.context}</p>
            </Col>
          </Row>
        </Modal>

        <Modal
          isOpen={BuyModal.modal}
          className={styles.BuyModal}
          toggle={this.closeBuyArtModal}
          title="خرید اثر"
        >
          <Row>
            <Col xs={12}>
              <p>
                <Payment
                  cart_serial={
                    BuyModal.cart_serial !== null ? BuyModal.cart_serial : null
                  }
                />
              </p>
            </Col>
          </Row>
        </Modal>
      </>
    );
  }
}
export default withRouter(ArtWork);
