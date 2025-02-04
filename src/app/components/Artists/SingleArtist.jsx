import React from 'react';
import { Link } from 'react-router-dom';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Urls from '../../components/Urls';
import Flickity from 'react-flickity-component';
import styles from './Artists.scss'
import DefaultStyle from '../../static/scss/_boxStyle.scss'
import { Img } from '../../components/General'
import FollowButton from '../ui-components/FollowButton'

import { IconArrowLeft } from '../../components/Icons';
import { style } from '@smooth-ui/core-sc';

const flickityOptions = {
    initialIndex: 0,
    pageDots: false,
    contain: true,
    rightToLeft: true,
    cellAlign: 'right',
    groupCells: 2
    // wrapAround: true
};


export const TopWorks = (props) => (
    <>
        <div className={styles.TopArtistWork}>
            <>
                <Flickity
                    className={'carousel items'}
                    elementType={'div'}
                    options={flickityOptions}
                    disableImagesLoaded={false}
                    reloadOnUpdate
                >
                    {props.item && props.item.map((item, index) => (
                        <div key={index} style={{ marginLeft: 10 }}>
                            <div className='thumb'>
                                <Link to={`${Urls().arts()}${item.slug}`}>
                                    <Img
                                        img={item.img.img}
                                        alt={item.name}
                                        width={item.img.ratio * 197}
                                    />
                                </Link>
                            </div>
                        </div>
                    ))}
                </Flickity>
            </>
        </div>
    </>
)
export const TopArtists = (props) => (
    <>
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

    </>
)
export const TopSingleArtist = (props) => (
    <>
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
                        <FollowButton id={props.item.id} type='artists' isFollowed={props.item.is_flw} big />
                    </div>
                </div>
            </div>
        </div>
    </>
);
export const SingleArtist = (props) => (
    <>
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
                <FollowButton id={props.item.id} type='artists' isFollowed={props.item.is_flw} wide />

            </div>
        </div>
    </>
);
export const FeatureArtist = (props) => {

    return (
        <>
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
        </>
    )
}

export const FlatArtist = (props) => {
    return (
        <>
            <div className={`${styles.SingleArtist} ${styles.simpleArtist} `}>
                <div className={styles.FlatArtist}>
                    <div className='avatar'>
                        <Link to={`${Urls().artist()}${props.item.slug}`}>
                            <Img
                                img={props.item.img}
                                alt={props.item.name}
                                width={50}
                            />
                        </Link>
                    </div>
                    <Link to={`${Urls().artist()}${props.item.slug}`}>
                        <span className={`name`}>{props.item.name}</span>
                    </Link>

                </div>
            </div>
        </>
    )
}