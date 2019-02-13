import React from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Urls from '../../components/Urls';
import { Img } from '../../components/General'

class TopShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
    }
    renderItems = () => {
        if (this.props.features) {
            return this.props.features.map(item => (
                <Col key={item.id} lg='3' md='6' sm='6' xs='12'>
                    <a href={Urls().show() + item.slug} >
                        <div className='feature'>
                            <div className='img'>
                                <Img img={item.img} alt={item.title} divHeight='44px' divWidth='60px' />
                            </div>
                            <div className='details'>
                                <h3>{item.title}</h3>
                                <h4>{item.detail}</h4>
                            </div>
                        </div>
                    </a>
                </Col>
            ));
        }
    };

    render() {


        return (
            <React.Fragment>
                <div className='features top-features'>
                    <Row>
                        {this.renderItems()}
                    </Row>
                </div>
            </React.Fragment>
        );
    }
}
export default TopShow;
