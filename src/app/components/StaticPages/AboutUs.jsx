import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import { withRouter } from "react-router-dom";
import Urls from "../Urls";
import ZaminehMap from "../map/ZaminehMap";

import { StaticPages } from "../Metatags/Metatags";

import styles from "./StaticPages.scss";
const AboutUs = () => {
  const [initialized, setInitialized] = useState(false);
  const [Data, setData] = useState({
    title: "درباره زمینه"
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
    }
  });
  return (
    <>
      <StaticPages title="درباره ما" url={Urls().aboutus()} />
      <Container>
        <Row>
          <Col xs="12">
            <div className=" singlePage" />
            {Data && (
              <div className={`${styles.about}`}>
                {Data.email && (
                  <div className="email">
                    <a href={`mailto:${Data.email}?subject=ارتباط با از زمینه`}>
                      ارتباط با زمینه از طریق ایمیل
                    </a>
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default withRouter(AboutUs);
