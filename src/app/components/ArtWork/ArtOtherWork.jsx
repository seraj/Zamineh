import React from 'react'
import { Link } from 'react-router-dom';
import Urls from '../Urls'
import { ListWithFollowBtn } from '../ui-components/List/List'
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { FourColumnArt } from '../ArtArtist/Arts';

import styles from './ArtWork.scss'
const sectionStyle = {
    marginTop: 10
}
const ArtOtherWorks = (props) => {

    return (
        <>
            {props.items.artist_other_works && props.config.artist && props.items.artist_other_works !== '' &&
                <Col xs={12} style={sectionStyle}>
                    <div className={styles.workTitle}>
                        <span>
                            آثار دیگر {props.config.artist.name}
                        </span>
                        <Link
                            to={`${Urls().artist()}${props.config.artist.slug}/overview/`}
                            style={{ marginBottom: 10 }}
                            className={`zbtn next white bradius`}
                        >دیدن همه</Link>
                    </div>

                    <FourColumnArt
                        Arts={props.items.artist_other_works}
                        type='artist_other_works'
                    />
                </Col>
            }

            {props.items.gallery_other_works && props.config.gallery && props.items.gallery_other_works !== '' &&
                <Col xs={12} style={sectionStyle}>
                    <div className={styles.workTitle}>
                        <span>
                            آثار دیگر {props.config.gallery.name}
                        </span>
                        <Link
                            to={`${Urls().gallery()}${props.config.gallery.slug}/arts/`}
                            style={{ marginBottom: 10 }}
                            className={`zbtn next white bradius`}
                        >دیدن همه</Link>
                    </div>

                    <FourColumnArt
                        Arts={props.items.gallery_other_works}
                        type={'gallery_other_works'}
                    />
                </Col>
            }




            {props.items.related_works && props.items.related_works !== '' &&
                <Col xs={12} style={sectionStyle}>
                    <div className={styles.workTitle}>
                        <span>
                            آثار مشابه
                        </span>
                    </div>

                    <FourColumnArt
                        Arts={props.items.related_works}
                        type={'related_works'}
                        openModal={props.openModal}
                        isLogined={props.handleLogin}
                    />
                </Col>
            }
            {props.items.related_artist && props.items.related_artist !== '' &&
                <Col xs={12} style={sectionStyle}>
                    <div className={styles.workTitle}>
                        <span>
                            همرندان مشابه
                        </span>
                    </div>
                    <Row>
                        {props.items.related_artist && props.items.related_artist.map((item, index) => (
                            <Col key={index} lg={3} md={4} sm={6} xs={12}>
                                <ListWithFollowBtn
                                    img={item.img}
                                    name={item.name}
                                    detail={item.detail}
                                    is_flw={item.is_flw}
                                    url={`${Urls().artist()}${item.slug}`}
                                    onFollowClick={props.handleLogin ? () => props.onFollowClick(item.id, index) : () => props.openModal(true)}
                                />
                            </Col>
                        ))}
                    </Row>
                </Col>
            }
        </>
    )
}
export default ArtOtherWorks