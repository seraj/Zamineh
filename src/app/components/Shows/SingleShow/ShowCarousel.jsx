import React, { useState, useEffect } from "react";
import Flickity from 'react-flickity-component';

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import { Loading } from '../../Spinner/Spinner';


import styles from './Show.scss'

const flickityOptions = {
  initialIndex: 0,
  pageDots: true,
  contain: true,
  rightToLeft: true,
  cellAlign: 'right',

  //   groupCells: true
};
const Slide = ({ item, onClick }) => (
  <img onClick={onClick} src={item.img} width={772} height={552} style={{ marginLeft: 15 }} />
);
const ShowCarousel = ({ items }) => {
  const [initialized, setInitialized] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [lightBox, setLightBox] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!initialized) {
      setLoading(false)
      setInitialized(true)
    }
  })

  return (
    <>
      {loading &&
        <div style={{ height: 150 }}>
          <Loading background="#fff" />
        </div>
      }
      {items &&
        <>
          <div className={styles.showCarousel}>
            <Flickity
              elementType={'div'}
              options={flickityOptions}
              disableImagesLoaded={false}
              reloadOnUpdate
            >
              {items && items.map((item, index) => (
                <Slide key={index} item={item} onClick={() => setLightBox(true)} />
              ))}
            </Flickity>
          </div>
          {lightBox &&
            <Lightbox
              mainSrc={items[photoIndex].o_img}
              nextSrc={items[(photoIndex + 1) % items.length].o_img}
              prevSrc={items[(photoIndex + items.length - 1) % items.length].o_img}
              onCloseRequest={() => setLightBox(false)}
              onMovePrevRequest={() => setPhotoIndex((photoIndex + items.length - 1) % items.length)}
              onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % items.length)}
            />

          }
        </>
      }
    </>
  )
}
export default ShowCarousel;
