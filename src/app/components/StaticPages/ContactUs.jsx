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
const ContactUs = () => {
  const [initialized, setInitialized] = useState(false);
  const [Data, setData] = useState({
    email: "info@zamineh.net",
    address: {
      lat: 35.7,
      lng: 51.4,
      address: "تهران بزرگ"
    }
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
    }
  });
  return (
    <>
      <StaticPages title="تماس با ما" url={Urls().contactus()} />
      <Container>
        <Row>
          <Col xs="12">
            <div className=" singlePage" />
            {Data && (
              <div className={`${styles.contact}`}>
                {Data.email && (
                  <div className="email">
                    <a href={`mailto:${Data.email}?subject=ارتباط با از زمینه`}>
                      ارتباط با زمینه از طریق ایمیل
                    </a>
                  </div>
                )}
                {Data.address && (
                  <>
                    <div className="map">
                      <ZaminehMap
                        mapPosition={
                          Data.address.lat != null
                            ? [Data.address.lat, Data.address.lng]
                            : null
                        }
                        markerPosition={
                          Data.address.lat != null
                            ? [Data.address.lat, Data.address.lng]
                            : null
                        }
                      />
                    </div>
                    <div className="address">{Data.address.address}</div>
                  </>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default withRouter(ContactUs);
