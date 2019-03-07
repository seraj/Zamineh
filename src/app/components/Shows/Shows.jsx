import React from "react";

import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";

import Login from "../../login/Login";
import Urls from "../Urls";
import Section from "../Section/Section";

import { Img } from "../General";
import { ShowsMetaTag } from "../Metatags/Metatags";
import ShowSet from "./showSet";
import { Loading } from "../Spinner/Spinner";

import styles from "./Shows.scss";

class Show extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {},
      artItems: {},
      loading: "",
      login: false
    };
  }
  componentDidMount() {
    this.getConfig();
    // this.getArtItems();
  }
  getConfig = () => {
    axios.get(`${Urls().api()}/shows/`).then(({ data }) => {
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

  openModal = value => {
    this.setState({
      login: value
    });
  };

  render() {
    const { isLogined } = this.props;
    const { config, login, loading, artItems } = this.state;
    return (
      <>
        <ShowsMetaTag
          title={config.show ? config.show.name : ""}
          slug={this.props.match.params.slug}
        />
        <Section ExtraClass={`content singlePage ${styles.art}`}>
          <Container>
            <div className={styles.FeatureShow}>
              <div className={styles.title}>نمایشگاه‌های برگزیده</div>
              <Row>
                {config &&
                  config.featured_shows &&
                  config.featured_shows.map((item, index) => (
                    <Col
                      key={item.id}
                      lg={index >= 2 ? "4" : "6"}
                      md="6"
                      sm="6"
                      xs="12"
                    >
                      <div className="feature">
                        <a
                          href={Urls().show() + item.slug}
                          className="img-link"
                        >
                          <div className="img img-hoverable">
                            <Img img={item.img} alt={item.title} />
                          </div>
                        </a>
                        <div className="details">
                          <Link to={Urls().show() + item.slug}>
                            <h3>{item.title}</h3>
                            {item.organizer && <h4>{item.organizer.name}</h4>}
                            {item.info && (
                              <h5>
                                {item.info.city}
                                {item.info.date && item.info.date.date}
                              </h5>
                            )}
                          </Link>
                        </div>
                      </div>
                    </Col>
                  ))}
                <Col lg={12} md={12} sm={12} xs={12}>
                  {config &&
                    config.gallery_shows &&
                    config.gallery_shows.map(items => (
                      <ShowSet key={items.id} items={items} />
                    ))}
                </Col>
              </Row>
            </div>
          </Container>
        </Section>

        <Login hasModal modalisOpen={login} openModal={this.openModal} />
      </>
    );
  }
}
export default withRouter(Show);
