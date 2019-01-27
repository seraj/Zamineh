import React from 'react';
import Col from 'reactstrap/lib/Col';
import Urls from '../../components/Urls'

class itemMedium extends React.Component {
  mediumsItem = () => {
    if (this.props.items) {
      return this.props.items.map(item => (
        <Col lg='3' md='3' sm='6' xs='12' key={item.id}>
          <a href={`${Urls().medium()}${item.slug}`} className='medium_item'>
            <span className='content'>{item.name}</span>
          </a>
        </Col>
      ));
    }
  };
  render() {
    return <React.Fragment>{this.mediumsItem()}</React.Fragment>;
  }
}
export default itemMedium;