import React from "react";
import { Link } from "react-router-dom";
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Urls from "../Urls";
import Flickity from "react-flickity-component";
import { Img } from "../General"
import { IconArrowLeft } from "../Icons";
import { FollowButton } from "../ui-components/Buttons";
import styles from "./Gallery.scss"
import DefaultStyle from "../../static/scss/_boxStyle.scss"



const TopGalleryflickityOptions = {
    initialIndex: 0,
    pageDots: true,
    contain: true,
    rightToLeft: true,
    cellAlign: "right",
    groupCells: 1
    // wrapAround: true
};



const flickityOptions = {
    initialIndex: 0,
    pageDots: false,
    contain: true,
    rightToLeft: true,
    cellAlign: "right",
    groupCells: 1
    // wrapAround: true
};


export const ShowSet = (props) => (
    <React.Fragment>
        <div className={styles.TopGalleryCarousel}>
            <Flickity
                className={"carousel items"}
                elementType={"div"}
                options={TopGalleryflickityOptions}
                disableImagesLoaded={false}
                reloadOnUpdate
            >
                {props.item && props.item.map((item, galleryIndex) => (
                    <SingleShowSet
                        key={item.id}
                        item={item}
                        GalleryIndex={galleryIndex}
                        onFollowClick={props.onFollowClick}
                        openModal={props.openModal}
                        handleLogin={props.handleLogin}
                    />
                ))}
            </Flickity>
        </div>

    </React.Fragment>
)
export const SingleShowSet = (props) => (
    <React.Fragment>
        <div className={`${styles.TopShowSet}`}>

            <div className={`${DefaultStyle.BorderedBox} big`}>
                <div className="right-section">
                    <Link to={`${Urls().show()}${props.item.slug}`}>
                        <div className={`thumb`}>
                            <Img
                                img={props.item.img}
                                alt={props.item.name}
                            />
                        </div>
                    </Link>
                </div>
                <div className="left-section">

                    <div className={`${DefaultStyle.box_details_block} box`}>
                        {props.item.gallery &&
                            <Link to={`${Urls().gallery()}${props.item.gallery.slug}`}>
                                <span className={`${DefaultStyle.BoxContent} title`}>
                                    {props.item.gallery.name}
                                </span>
                            </Link>
                        }
                        <span className={`${DefaultStyle.BoxContent} status bold`}>{props.item.state}</span>
                        <Link to={`${Urls().show()}${props.item.slug}`}>
                            <span className={`${DefaultStyle.BoxContent} state`}>{props.item.detail}</span>
                            <div className={`${DefaultStyle.BoxContent} state`}>
                                {props.item.info_1}
                                <span
                                    className={props.item.info_2.status == 1 ? `text-danger` : ``}
                                >
                                    {props.item.info_2.title}
                                </span>
                            </div>
                        </Link>

                        <FollowButton
                            is_flw={props.item.is_flw}
                            handleLogin={props.handleLogin}
                            onClick={() => props.onFollowClick(props.item.gallery.id, props.GalleryIndex, null, 'show_set')}
                            loginModal={() => props.openModal(true)}
                        />

                    </div>
                </div>
            </div>
        </div>
    </React.Fragment >
);
export const SingleGallery = (props) => (
    <React.Fragment>
        <div className={`${styles.SingleGallery} ${props.carousel ? styles.forCarousel : styles.simpleArtist} `}>

            <div className={`${DefaultStyle.unBorderedBox}`}>
                <Link to={`${Urls().gallery()}${props.item.slug}`}>
                    <div className={`thumb img-hoverable`}>
                        <Img
                            img={props.item.img}
                            alt={props.item.name}
                            hoverable
                        />
                    </div>

                </Link>

                <div className={`${DefaultStyle.box_details_inline} flex`}>
                    <div className="details_right">
                        <Link to={`${Urls().gallery()}${props.item.slug}`}>
                            <span className={`${DefaultStyle.BoxContent} bold`}>{props.item.name}</span>
                        </Link>
                        <span className={`${DefaultStyle.BoxContent} location`}>
                            {props.item.address}
                        </span>
                    </div>
                    <div className="details_left">
                        <FollowButton
                            is_flw={props.item.is_flw}
                            handleLogin={props.handleLogin}
                            onClick={() => props.onFollowClick(props.item.id, props.GalleryIndex, props.parentIndex, props.type)}
                            loginModal={() => props.openModal(true)}
                        />

                    </div>
                </div>

            </div>
        </div>
    </React.Fragment >
);
export const GenreSet = (props) => {

    return (
        <React.Fragment>
            {props.item && props.item.map((item, index) => (

                <div className={DefaultStyle.FeatureBoxSection} key={item.id}>
                    <h4>
                        <Link to={item.slug}>
                            {item.name}
                            <i>
                                <IconArrowLeft
                                    height="20px"
                                    width="20px"
                                    fill="transparent"
                                    stroke="#6b6b6b"
                                />
                            </i>
                        </Link>
                    </h4>
                    <Row>
                        <Flickity
                            className={"carousel items"}
                            elementType={"div"}
                            options={flickityOptions}
                            disableImagesLoaded={false}
                            reloadOnUpdate
                        >
                            {item.gallery_set && item.gallery_set.map((item, GalleryIndex) => (
                                <Col lg={4} md={4} sm={6} xs={12} key={GalleryIndex}>
                                    <SingleGallery
                                        item={item}
                                        parentIndex={index}
                                        GalleryIndex={GalleryIndex}
                                        onFollowClick={props.onFollowClick}
                                        openModal={props.openModal}
                                        handleLogin={props.handleLogin}
                                        type="genre_set"
                                    />
                                </Col>
                            ))}
                        </Flickity>
                    </Row>

                </div>
            ))}
        </React.Fragment>
    )
}
export const FeatureSet = (props) => {

    return (
        <React.Fragment>
            {props.item && props.item.map((item, index) => (

                <div className={DefaultStyle.FeatureBoxSection} key={index}>
                    <h4>
                        {item.name}
                    </h4>
                    <Row>
                        <Flickity
                            className={"carousel items"}
                            elementType={"div"}
                            options={flickityOptions}
                            disableImagesLoaded={false}
                            reloadOnUpdate
                        >
                            {item.gallery_set && item.gallery_set.map((items, GalleryIndex) => (
                                <Col lg={4} md={4} sm={6} xs={12} key={GalleryIndex}>
                                    <SingleGallery
                                        item={items}
                                        parentIndex={index}
                                        GalleryIndex={GalleryIndex}
                                        onFollowClick={props.onFollowClick}
                                        openModal={props.openModal}
                                        handleLogin={props.handleLogin}
                                        type="feature_set"
                                    />
                                </Col>
                            ))}
                        </Flickity>
                    </Row>

                </div>
            ))}
        </React.Fragment>
    )
}

export const ResultsGrid = (props) => {

    return (
        <React.Fragment>

            <div className={DefaultStyle.FeatureBoxSection}>
                <h4>
                    {props.title}
                </h4>
                <Row>
                    {props.item && props.item.map((items, GalleryIndex) => (
                        <Col lg={4} md={4} sm={6} xs={12} key={GalleryIndex}>
                            <SingleGallery
                                item={items}
                                GalleryIndex={GalleryIndex}
                                onFollowClick={props.onFollowClick}
                                openModal={props.openModal}
                                handleLogin={props.handleLogin}
                                type="gallery_set"
                            />
                        </Col>
                    ))}
                </Row>

            </div>
        </React.Fragment>
    )
}
