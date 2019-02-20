import React from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Urls from '../../components/Urls';
import { Img } from '../../components/General'


class BottomShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'نمایشگاه‌های آینده',
            error: false
        };
    }
    renderItems = () => {
        if (this.props.features) {
            return this.props.features.map((item, index) => (
                <Col key={item.id} lg={index >= 2 ? '4' : '6'} md='6' sm='6' xs='12'>
                    <div className='feature'>
                        <a href={Urls().show() + item.slug} className='img-link'>
                            <div className='img img-hoverable'>
                                <Img img={item.img} alt={item.title} />
                            </div>
                        </a>
                        <div className='details'>
                            <a href={Urls().show() + item.slug} >
                                <h3>{item.title}</h3>
                                <h4>{item.detail}</h4>
                                <h5>{item.info}</h5>
                            </a>
                        </div>
                    </div>
                </Col>
            ));
        }
    };

    render() {


        return (
            <>
                <section className='section'>
                    <div className='section_header'>
                        <h1>{this.state.title}</h1>
                        <a href='#' className='view-all'>
                            دیدن همه نمایشگاه‌ها
                </a>
                    </div>
                    <div className='features home-shows'>
                        <Row>
                            {this.renderItems()}
                        </Row>
                    </div>
                </section>
            </>
        );
    }
}
export default BottomShow;
