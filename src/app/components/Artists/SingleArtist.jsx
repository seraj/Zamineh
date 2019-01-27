import React from 'react';
import { Link } from 'react-router-dom';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Urls from '../../components/Urls';
import Flickity from 'react-flickity-component';
import styles from './Artists.scss'
import DefaultStyle from '../../static/scss/_boxStyle.scss'
import { Img } from '../../components/General'

import { IconArrowLeft } from '../../components/Icons';

const flickityOptions = {
    initialIndex: 0,
    pageDots: false,
    contain: true,
    rightToLeft: true,
    cellAlign: 'right',
    groupCells: 2
    // wrapAround: true
};


export const TopArtists = (props) => (
    <React.Fragment>
        <div className={styles.TopArtistCarousel}>
            <h1 className='center-h1'>{props.title}</h1>
            <Row>
                <Flickity
                    className={'carousel items'}
                    elementType={'div'}
                    options={flickityOptions}
                    disableImagesLoaded={false}
                    reloadOnUpdate
                >
                    {props.item && props.item.map((artist, artistIndex) => (
                        <Col lg={6} md={6} sm={12} xs={12}>
                            <TopSingleArtist
                                item={artist}
                                artistIndex={artistIndex}
                                onFollowClick={props.onFollowClick}
                                openModal={props.openModal}
                                handleLogin={props.handleLogin}
                            />
                        </Col>
                    ))}
                </Flickity>
            </Row>
        </div>

    </React.Fragment>
)
export const TopSingleArtist = (props) => (
    <React.Fragment>
        <div className={`${styles.TopSingleArtist}`}>

            <div className={`${DefaultStyle.BorderedBox} big`}>
                <Link to={`${Urls().artist()}${props.item.slug}`}>
                    <div className='thumb img-hoverable'>
                        <Img
                            img={props.item.img}
                            alt={props.item.name}
                        />
                    </div>

                </Link>
                <div className={DefaultStyle.box_details_inline}>
                    <div className='details_right'>
                        <Link to={`${Urls().artist()}${props.item.slug}`}>
                            <span className={`${DefaultStyle.BoxContent} bold`}>{props.item.name}</span>
                        </Link>
                        {props.item.gallery &&
                            <Link to={`${Urls().gallery()}${props.item.gallery.slug}`}>
                                <span className={`${DefaultStyle.BoxContent} gallery`}>
                                    {props.item.gallery.name}
                                </span>
                            </Link>
                        }

                    </div>
                    <div className='details_left'>
                        <button
                            className={`${DefaultStyle.followBtn} big ${props.item.is_flw ? 'following' : ''}`}
                            onClick={
                                props.handleLogin ?
                                    () => props.onFollowClick(props.item.id, props.item.type, props.artistIndex, null, 'BigArtist')
                                    :
                                    () => props.openModal(true)}
                        >
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment >
);
export const SingleArtist = (props) => (
    <React.Fragment>
        <div className={`${styles.SingleArtist} ${styles.simpleArtist} `}>

            <div className={DefaultStyle.BorderedBox}>
                <div className='thumb img-hoverable'>
                    <Link to={`${Urls().artist()}${props.item.slug}`}>
                        <Img
                            img={props.item.img.img}
                            alt={props.item.name}
                            width={props.item.img.ratio * 197}
                        />
                    </Link>
                </div>
                <Link to={`${Urls().artist()}${props.item.slug}`}>
                    <div className={DefaultStyle.box_details_block}>
                        <span className={`${DefaultStyle.BoxContent} bold`}>{props.item.name}</span>
                        {props.item.detail &&
                            <span className={`${DefaultStyle.BoxContent} normal`}>
                                {props.item.detail}
                            </span>
                        }
                        {props.item.works &&
                            <span className={`${DefaultStyle.BoxContent} works`}>{props.item.works}</span>
                        }
                    </div>
                </Link>

                <button
                    className={`${DefaultStyle.followBtn} ${props.item.is_flw ? 'following' : ''}`}
                    onClick={
                        props.handleLogin ?
                            () => props.onFollowClick(props.item.id, props.item.type, props.artistIndex, props.parentIndex)
                            :
                            () => props.openModal(true)}
                ></button>

            </div>
        </div>
    </React.Fragment >
);
export const FeatureArtist = (props) => {

    return (
        <React.Fragment>
            {props.item && props.item.map((item, index) => (

                <div className={DefaultStyle.FeatureBoxSection} key={item.id}>
                    <h4>
                        <Link to={item.slug}>
                            {item.name}
                            <i>
                                <IconArrowLeft
                                    height='20px'
                                    width='20px'
                                    fill='transparent'
                                    stroke='#6b6b6b'
                                />
                            </i>
                        </Link>
                    </h4>
                    <Row>
                        {item.artist_set && item.artist_set.map((artist, artistIndex) => (
                            <Col lg={3} md={4} sm={6} xs={12} key={artistIndex}>
                                <SingleArtist
                                    item={artist}
                                    parentIndex={index}
                                    artistIndex={artistIndex}
                                    onFollowClick={props.onFollowClick}
                                    openModal={props.openModal}
                                    handleLogin={props.handleLogin}
                                />
                            </Col>
                        ))}
                    </Row>

                </div>
            ))}
        </React.Fragment>
    )
}
