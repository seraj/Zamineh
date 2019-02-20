import React from 'react';
import Slide from './SingleSlide';
import Flickity from 'react-flickity-component';
const flickityOptions = {
  initialIndex: 0,
  pageDots: true,
  contain: true,
  rightToLeft: true,
  cellAlign: 'right',

  //   groupCells: true
};

class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false
    };
  }
  renderItems = () => {
    if (this.props.slides) {
      return this.props.slides.map(item => (
        <Slide
          key={item.id}
          sub_content={item.sub_content}
          text={item.url}
          content={item.content}
          btn_title={item.btn_title}
          img={item.img}
          item={item}
        />
      ));
    }
  };

  render() {


    return (
      <>
        <div className='header-slider'>
          <Flickity
            className={'carousel items'}
            elementType={'div'}
            options={flickityOptions}
            disableImagesLoaded={false}
            reloadOnUpdate
          >
            {this.renderItems()}
          </Flickity>
        </div>
      </>
    );
  }
}
export default Carousel;
