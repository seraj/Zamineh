import React, { useState, useEffect } from "react";
import Flickity from "react-flickity-component";

import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { IconSave } from "../Icons";

import { Loading } from "../Spinner/Spinner";

import styles from "./ArtWork.scss";

const flickityOptions = {
  initialIndex: 0,
  pageDots: true,
  contain: true,
  rightToLeft: true,
  cellAlign: "right"

  //   groupCells: true
};
const Slide = ({ item, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: `url(${item.img}) center center / contain no-repeat`,
      height: 0,
      width: "100%",
      paddingBottom: "60vh"
    }}
  />
);
const ArtCarousel = ({
  items,
  openModal,
  onSaveItemClick,
  isLogined,
  isSaved
}) => {
  const [initialized, setInitialized] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightBox, setLightBox] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!initialized) {
      setLoading(false);
      setInitialized(true);
    }
  });

  return (
    <>
      {loading && (
        <div style={{ height: 150 }}>
          <Loading background="#fff" />
        </div>
      )}
      {items && (
        <>
          <div className={styles.artCarousel}>
            {items.length > 1 ? (
              <Flickity
                elementType={"div"}
                options={flickityOptions}
                disableImagesLoaded={false}
                reloadOnUpdate
              >
                {items &&
                  items.map((item, index) => (
                    <Col xs={12}>
                      <Slide
                        key={index}
                        item={item}
                        onClick={() => setLightBox(true)}
                      />
                    </Col>
                  ))}
              </Flickity>
            ) : (
              items.map((item, index) => (
                <Col xs={12}>
                  <Slide
                    key={index}
                    item={item}
                    onClick={() => setLightBox(true)}
                  />
                </Col>
              ))
            )}
            <ul className="list">
              <li
                className={`${isSaved ? "active" : ""}`}
                onClick={
                  isLogined ? () => onSaveItemClick() : () => openModal(true)
                }
              >
                <div className={`${styles.save_art} ${isSaved ? "saved" : ""}`}>
                  <IconSave
                    height="80%"
                    width="90%"
                    fill="transparent"
                    stroke="#000"
                  />
                </div>
                ذخیره
              </li>
            </ul>
          </div>
          {lightBox && (
            <Lightbox
              mainSrc={items[photoIndex].o_img}
              nextSrc={
                items.length > 1
                  ? items[(photoIndex + 1) % items.length].o_img
                  : null
              }
              prevSrc={
                items.length > 1
                  ? items[(photoIndex + items.length - 1) % items.length].o_img
                  : null
              }
              onCloseRequest={() => setLightBox(false)}
              onMovePrevRequest={() =>
                setPhotoIndex((photoIndex + items.length - 1) % items.length)
              }
              onMoveNextRequest={() =>
                setPhotoIndex((photoIndex + 1) % items.length)
              }
            />
          )}
        </>
      )}
    </>
  );
};
export default ArtCarousel;
