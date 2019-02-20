
import React from 'react';
import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col'; import queryString from 'query-string';
import { withRouter } from 'react-router-dom'




class SingleArticle extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            data: null,

        }
    }
    render() {


        /**
          * 
          * 
          * @description Single Article Components
          * 
          * @memberOf Articles
          */
        var url = window.location.href;
        const parsed = queryString.parse(this.props.location.search);




        return (

            <React.Fragment>
                <Container>
                    <Row>
                        <Col xs='12'>

                        </Col>
                    </Row>
                </Container>
            </React.Fragment>

        )
    }
}
export default withRouter(SingleArticle);
