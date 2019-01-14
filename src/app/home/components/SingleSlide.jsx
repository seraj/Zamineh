import React from "react";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
const SingleSlide = ({ item }) => (
  <div
    className={`header_slide ${item.is_black ? 'black' : ''}`}
    style={{
      backgroundImage: `url(${item.img})`,
      backgroundSize: "cover"
    }}
  >
    <Container>
      <Row>
        <Col>
          <div className="slidecontent">
            <span className="sub_content">{item.sub_content}</span>
            <h3 className="title">{item.title}</h3>
            <span className="context">{item.content}</span>
            <div className="button">{item.btn_title}</div>

          </div>
        </Col>
      </Row>
    </Container>
  </div>

);
export default SingleSlide;
