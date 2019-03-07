import React from "react";

import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip";
import queryString from "query-string";

import SecurityManager from "../../../security/SecurityManager";
import Modal from "../../ui-components/Modal/Modal";
import ZaminehMap from "../../map/ZaminehMap";

import Urls from "../../Urls";
import Section from "../../Section/Section";

import FollowInline from "../../ui-components/FollowInline";
import { SingleShowMetaTag } from "../../Metatags/Metatags";
import SHowArts from "./SHowArts";
import ShowCarousel from "./ShowCarousel";
import { Img } from "../../General";
import { ThreeColumnArt } from "../../ArtArtist/Arts";
import { Loading } from "../../Spinner/Spinner";

import DefaultStyle from "../../../static/scss/_boxStyle.scss";
import styles from "./Show.scss";

class Show extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {},
      artItems: {},
      loading: "",
      login: false,
      mapModal: false
    };
  }
  componentDidMount() {
    this.getConfig(this.props.match.params.slug);
    this.getArtItems(this.props.match.params.slug);
  }
  getConfig = slug => {
    axios.get(`${Urls().api()}/show/${slug}/`).then(({ data }) => {
      this.setState({
        config: data
      });
    });
  };
  getArtItems = slug => {
    axios
      .get(`${Urls().api()}/show/${slug}/other-shows/`, {
        params: {
          //count: 2
        }
      })
      .then(({ data }) => {
        this.setState({
          artItems: data
        });
      });
  };

  openMapModal = value => {
    this.setState({
      mapModal: value
    });
  };
  closeMapModal = () => {
    this.setState({
      mapModal: false
    });
  };

  render() {
    const parsed = queryString.parse(location.search);
    const { config, login, loading, artItems, mapModal } = this.state;
    const isLogined = SecurityManager().isLogined();
    const partnerUrl =
      config && config.artist_organizer ? Urls().artist() : Urls().gallery();
    return (
      <>
        <SingleShowMetaTag
          title={config.show ? config.show.name : ""}
          slug={this.props.match.params.slug}
        />
        <Section ExtraClass={`content singlePage ${styles.art}`}>
          {config && config.img_set && <ShowCarousel items={config.img_set} />}
          <Container>
            <Row>
              <Col lg={6} md={6} sm={12} xs={12}>
                <div className={styles.showHeader}>
                  <h1>{config && config.show && config.show.name}</h1>
                </div>
              </Col>
              <Col lg={6} md={6} sm={12} xs={12}>
                <div className={styles.showHeader}>
                  <div className="partner">
                    <div className="follow">
                      {config.organizer && (
                        <>
                          <a
                            className="name"
                            href={`${partnerUrl}${config.organizer.slug}`}
                          >
                            {config.organizer.name}
                          </a>
                          <FollowInline
                            id={config.organizer.id}
                            type={
                              config.artist_organizer ? "artists" : "galleries"
                            }
                            isFollowed={config.organizer.is_flw}
                          />
                        </>
                      )}
                    </div>
                    <div className="share">
                      <UncontrolledTooltip placement="bottom" target="mail">
                        ایمیل کن
                      </UncontrolledTooltip>
                      <UncontrolledTooltip placement="bottom" target="facebook">
                        به اشتراک گذاشتن در فیسبوک
                      </UncontrolledTooltip>
                      <UncontrolledTooltip placement="bottom" target="twitter">
                        به اشتراک گذاشتن در تویتر
                      </UncontrolledTooltip>

                      <a
                        id="mail"
                        href={`mailto:?subject=${config.show &&
                          config.show
                            .name}&body=این رو نگاه بنداز "${config.show &&
                          config.show
                            .name}" آدرس :"${Urls().client()}${Urls().show()}${config.show &&
                          config.show.slug}"`}
                      >
                        <i className="zicon icon-10" />
                      </a>

                      <a
                        id="facebook"
                        href={`https://www.facebook.com/sharer/sharer.php?u=${Urls().client()}${Urls().show()}${config.show &&
                          config.show.slug}`}
                        target="_blank"
                      >
                        <i className="zicon icon-11" />
                      </a>
                      <a
                        id="twitter"
                        href={`https://twitter.com/intent/tweet?&url=${Urls().client()}${Urls().show()}${config.show &&
                          config.show.slug}`}
                        target="_blank"
                      >
                        <i className="zicon icon-13" />
                      </a>
                    </div>
                  </div>
                  {config.show && (
                    <>
                      <div className="metadata">
                        <div className="date">{config.show.date}</div>
                        <div className="location">
                          {config.show.address.address}
                          <span
                            onClick={() => this.openMapModal(true)}
                            className={DefaultStyle.openMapBtn}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              {config.art_set && (
                <Col xs={12}>
                  <div className={styles.ArtSet}>
                    <ThreeColumnArt Arts={config.art_set} />
                  </div>
                </Col>
              )}
              {config.artist_set && config.artist_set.length > 0 && (
                <Col xs={12}>
                  <div className={styles.showSection}>
                    <h2>هنرمندانی که در این نمایشگاه اثر دارند را فالو کنید</h2>
                    <div className="artists">
                      {config.artist_set.map((artist, index) => (
                        <div className="artist">
                          <a
                            className="name"
                            href={`${Urls().artist()}${artist.slug}`}
                          >
                            {artist.name}
                          </a>
                          <FollowInline
                            id={artist.id}
                            type="artists"
                            isFollowed={artist.is_flw}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Col>
              )}
              {artItems.results && artItems.results.length > 0 && (
                <Col xs={12}>
                  <div className={styles.showSection}>
                    <h2>نمایشگاه‌های برگزیده</h2>
                    <hr />
                    <div className={styles.otherShows}>
                      {artItems.results.map((items, index) => (
                        <div key={index} className={styles.singleFeatureShow}>
                          <Row>
                            <Col
                              lg={4}
                              md={12}
                              sm={12}
                              xs={12}
                              className="organizer"
                            >
                              <div className="name">
                                <a href={`${Urls().show()}${items.slug}`}>
                                  {items.name}
                                </a>
                              </div>
                              <div className="partner">
                                <a
                                  to={`${Urls().gallery()}${
                                    items.organizer.slug
                                  }`}
                                >
                                  {items.organizer.name}
                                </a>
                              </div>
                              <div className="date">{items.date}</div>
                            </Col>
                            <Col lg={8} md={12} sm={12} xs={12}>
                              <a
                                className="all-arts"
                                href={`${Urls().show()}${items.slug}`}
                              >
                                {items.arts &&
                                  items.arts.map((showArts, index) => (
                                    <div key={index} className="show-arts">
                                      <div className="img-hoverable">
                                        <Img
                                          img={showArts.img.img}
                                          alt={items.name}
                                          width={250 * showArts.img.ratio}
                                          height="250px"
                                        />
                                      </div>
                                    </div>
                                  ))}
                              </a>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </Container>
        </Section>

        <Modal
          isOpen={mapModal}
          toggle={this.closeMapModal}
          title={"نقشه نمایشگاه"}
        >
          <Row>
            <Col xs={12}>
              {config.show && config.show.address && (
                <ZaminehMap
                  mapPosition={
                    config.show.address.lat != null
                      ? [config.show.address.lat, config.show.address.lng]
                      : null
                  }
                  markerPosition={
                    config.show.address.lat != null
                      ? [config.show.address.lat, config.show.address.lng]
                      : null
                  }
                  mapZoom={18}
                  currentLocation={
                    config.show.address.lat != null ? false : true
                  }
                />
              )}
            </Col>
          </Row>
        </Modal>
      </>
    );
  }
}
export default withRouter(Show);
