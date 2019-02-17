import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';


import axios from 'axios';
import SecurityManager from '../../security/SecurityManager'
import Urls from '../Urls'
import { Toast } from '../Toast/Toast';
import Modal from '../ui-components/Modal/Modal'
import ArtistArtFiltering from './ArtistArtFiltering';
import { OverviewSets, ShowSet, FourColumnArtist, PaginationItem } from '../Gallery/Galleries/SingleGallery';


import { Loading } from '../Spinner/Spinner';
import Pagination from '../Pagination/Pagination';
import { FourColumnArt } from '../ArtArtist/Arts';
import { ListWithFollowBtn } from '../ui-components/List/List';
import { Img } from '../General'

import styles from './Artists.scss'

const isLogined = SecurityManager().isLogined();


export const Overview = ({ type, slug }) => {
    const [initialized, setInitialized] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!initialized) {
            setLoading(false)
            setInitialized(true)
        }
    })
    const handlePageClick = (data) => {
        let selected = data.selected + 1;
        setLoading(true)
        getData(type, selected);
    };
    return (
        <React.Fragment>
            {loading &&
                <div style={{ height: 150 }}>
                    <Loading background="#fff" />
                </div>
            }
            <ArtistArtFiltering slug={slug} />
        </React.Fragment>
    )
}

export const Cv = ({ slug }) => {
    const [initialized, setInitialized] = useState(false)
    const [soloData, setSoloData] = useState()
    const [groupData, setGroupData] = useState()
    const [otherData, setOtherData] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!initialized) {
            getSoloData()
            getGroupData()
            getOtherData()
            setInitialized(true)
        }
    })
    const getSoloData = () => {
        axios.get(`${Urls().api()}/artist/${slug}/cv-solo/`)
            .then(({ data }) => {
                setSoloData(data)
                setLoading(false)
            });
    }
    const getGroupData = () => {
        axios.get(`${Urls().api()}/artist/${slug}/cv-group/`)
            .then(({ data }) => {
                setGroupData(data)
                setLoading(false)
            });
    }
    const getOtherData = () => {
        axios.get(`${Urls().api()}/artist/${slug}/cv-bpp/`)
            .then(({ data }) => {
                setOtherData(data)
                setLoading(false)
            });
    }
    const handlePageClick = (data) => {
        let selected = data.selected + 1;
        setLoading(true)
        getData(type, selected);
    };
    return (
        <React.Fragment>
            {loading &&
                <div style={{ height: 150 }}>
                    <Loading background="#fff" />
                </div>
            }
            {soloData && soloData.results.length > 0 &&
                <div className={styles.cvList}>
                    {soloData.results.map((item, index) => (
                        <Row>
                            <Col lg={2} md={12} sm={12} xs={12} className='name'>{index === 0 ? 'نمایشگاه‌های انفرادی' : ''}</Col>
                            <Col lg={1} md={1} sm={1} xs={1}>{item.year}</Col>
                            <Col lg={9} md={11} sm={11} xs={11}>
                                {item.slug !== '' ? <><Link to={`${Urls().show()}${item.slug}`}>{item.name}</Link>, </> : `${item.name},`}
                                {item.gallery != '' ? item.gallery.slug !== '' ? <Link to={`${Urls().gallery()}${item.slug}`}>{item.gallery.name}</Link> : item.gallery.name : null}
                            </Col>
                        </Row>
                    ))}
                </div>
            }
            {groupData && groupData.results.length > 0 &&
                <>
                    <hr />
                    <div className={styles.cvList}>
                        {groupData.results.map((item, index) => (
                            <Row>
                                <Col lg={2} md={12} sm={12} xs={12} className='name'>{index === 0 ? 'نمایشگاه‌های گروهی' : ''}</Col>
                                <Col lg={1} md={1} sm={1} xs={1}>{item.year}</Col>
                                <Col lg={9} md={11} sm={11} xs={11}>
                                    {item.slug !== '' ? <><Link to={`${Urls().show()}${item.slug}`}>{item.name}</Link>, </> : `${item.name},`}
                                    {item.gallery != '' ? item.gallery.slug !== '' ? <Link to={`${Urls().gallery()}${item.slug}`}>{item.gallery.name}</Link> : item.gallery.name : null}
                                </Col>
                            </Row>
                        ))}
                    </div>
                </>
            }

            {otherData && otherData.books.length > 0 &&
                <>
                    <hr />
                    <div className={styles.cvList}>
                        {otherData.books.map((item, index) => (
                            <Row>
                                <Col lg={2} md={12} sm={12} xs={12} className='name'>{index === 0 ? 'کتاب‌ها' : ''}</Col>
                                <Col lg={10} md={12} sm={12} xs={12}>{item.name}</Col>
                            </Row>
                        ))}
                    </div>
                </>
            }
            {otherData && otherData.presses.length > 0 &&
                <>
                    <hr />
                    <div className={styles.cvList}>
                        {otherData.presses.map((item, index) => (
                            <Row>
                                <Col lg={2} md={12} sm={12} xs={12} className='name'>{index === 0 ? 'مصاحبه‌ها' : ''}</Col>
                                <Col lg={10} md={12} sm={12} xs={12}>{item.name}</Col>
                            </Row>
                        ))}
                    </div>
                </>
            }
        </React.Fragment>
    )
}


export const Articles = ({ slug }) => {
    const [initialized, setInitialized] = useState(false)
    const [Data, setData] = useState()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (!initialized) {
            handleData()
            setInitialized(true)
        }
    })
    const handleData = (page) => {
        axios
            .get(`${Urls().api()}/artist/${slug}/articles/`, { params: { page: page } })
            .then(({ data }) => {
                setData(data)
                setLoading(false)
            });
    }
    const handlePageClick = (data) => {
        let selected = data.selected + 1;
        setLoading(true)
        handleData(selected);
    }
    return (
        <React.Fragment>
            {loading &&
                <div style={{ height: 150 }}>
                    <Loading background="#fff" />
                </div>
            }
            {Data && Data.results.length > 0 &&
                <div className={`${styles.Sections} nobb`}>
                    <PaginationItem
                        item={Data.results}
                        type='article'
                    />
                    {Data && Data.page_count > 1 &&
                        <Pagination
                            pageCount={Data.page_count}
                            onPageChange={handlePageClick}
                        />
                    }
                </div>
            }
        </React.Fragment>
    )
}

export const Shows = ({ type, slug }) => {
    const [initialized, setInitialized] = useState(false)
    const [currentShows, setCurrentShows] = useState()
    const [pastShows, setPastShows] = useState()
    const [upcomingShows, setUpcomingShows] = useState()

    const [currentShowsLoading, setCurrentShowsLoading] = useState(true)
    const [pastShowsLoading, setPastShowsLoading] = useState(true)
    const [upcomingShowsLoading, setUpcomingShowsLoading] = useState(true)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!initialized) {
            getCurrentShowsData()
            getPastShowsData()
            getUpcomingShowsData()
            setLoading(false)
            setInitialized(true)
        }
    })
    const getCurrentShowsData = (page) => {
        axios.get(`${Urls().api()}/artist/${slug}/shows-current/`, {
            params: {
                page: page
            }
        }).then(({ data }) => {
            setCurrentShows(data)
            setCurrentShowsLoading(false)
        });
    }
    const getPastShowsData = (page) => {
        axios.get(`${Urls().api()}/artist/${slug}/shows-past/`, {
            params: {
                page: page
            }
        }).then(({ data }) => {
            setPastShows(data)
            setPastShowsLoading(false)
        });
    }
    const getUpcomingShowsData = (page) => {
        axios.get(`${Urls().api()}/artist/${slug}/shows-upcoming/`, {
            params: {
                page: page
            }
        }).then(({ data }) => {
            setUpcomingShows(data)
            setUpcomingShowsLoading(false)
        });
    }


    //Handle Pagination Click
    const handleCurrentShowPageClick = (data) => {
        let selected = data.selected + 1;
        setCurrentShowsLoading(true)
        getCurrentShowsData(selected);
    };
    const handlePastShowPageClick = (data) => {
        let selected = data.selected + 1;
        setPastShowsLoading(true)
        getPastShowsData(selected);
    };
    const handleUpcomingShowPageClick = (data) => {
        let selected = data.selected + 1;
        setUpcomingShows(true)
        getPastShowsData(selected);
    };


    return (
        <React.Fragment>
            {loading &&
                <div style={{ height: 150 }}>
                    <Loading background="#fff" />
                </div>
            }

            {currentShows && currentShows.results.length > 0 ?
                <>
                    <h2 className={styles.title}>نمایشگاه‌های حال</h2>
                    <section className={`${styles.tabSection} shows`}>
                        {currentShowsLoading && <Loading />}
                        <Row>
                            {currentShows.results.map((show, index) => (
                                <Col key={index} lg={6} md={6} sm={6} xs={12}>
                                    <div className='feature'>
                                        <a href={Urls().show() + show.slug} className='img-link'>
                                            <div className='img img-hoverable'>
                                                <Img img={show.img} alt={show.title} width='100%' height='400px' />
                                            </div>
                                        </a>
                                        <div className='details'>
                                            <a href={Urls().show() + show.slug}>
                                                <h3>{show.name}</h3>
                                                <h4>{show.info}</h4>
                                            </a>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                            {currentShows && currentShows.page_count > 1 &&
                                <>
                                    <Col lg={12} md={12} sm={12} xs={12}>
                                        <hr />
                                        <Pagination
                                            pageCount={currentShows.page_count}
                                            onPageChange={handleCurrentShowPageClick}
                                        />
                                    </Col>
                                </>
                            }
                        </Row>
                    </section>
                </>
                :
                <h2 className={styles.title}>نمایشگاهی برای نمایش وجود ندارد</h2>
            }

            {pastShows && pastShows.results.length > 0 &&
                <>
                    <h2 className={styles.title}>نمایشگاه‌های گذشته</h2>
                    <hr />
                    <section className={`${styles.tabSection} shows`}>
                        {pastShowsLoading && <Loading />}
                        <>
                            <div className={styles.cvList}>
                                {pastShows.results.map((item, index) => (
                                    <Row>
                                        <Col xs={3}>{item.info}</Col>
                                        <Col xs={9}>
                                            {item.slug !== '' ? <><Link to={`${Urls().show()}${item.slug}`}>{item.name}</Link>, </> : `${item.name}, `}
                                            {item.gallery !== '' ? item.gallery.slug !== '' ? <Link to={`${Urls().show()}${item.slug}`}>{item.gallery.name}</Link> : item.gallery.name : null}
                                        </Col>

                                    </Row>
                                ))}
                            </div>
                            <hr />
                        </>
                        {pastShows && pastShows.page_count > 1 &&
                            <Row>

                                <Col lg={12} md={12} sm={12} xs={12}>
                                    <Pagination
                                        pageCount={pastShows.page_count}
                                        onPageChange={handlePastShowPageClick}
                                    />
                                </Col>
                            </Row>
                        }
                    </section>
                </>
            }

            {upcomingShows && upcomingShows.results.length > 0 &&
                <>
                    <h2 className={styles.title}>نمایشگاه‌های آینده</h2>
                    <hr />
                    <section className={`${styles.tabSection} shows`}>
                        {upcomingShowsLoading && <Loading />}
                        <>
                            <div className={styles.cvList}>
                                {upcomingShows.results.map((item, index) => (
                                    <Row>
                                        <Col xs={3}>{item.info}</Col>
                                        <Col xs={9}>
                                            {item.slug !== '' ? <><Link to={`${Urls().show()}${item.slug}`}>{item.name}</Link>, </> : `${item.name}, `}
                                            {item.gallery !== '' ? item.gallery.slug !== '' ? <Link to={`${Urls().show()}${item.slug}`}>{item.gallery.name}</Link> : item.gallery.name : null}
                                        </Col>

                                    </Row>
                                ))}
                            </div>
                            <hr />
                        </>
                        {upcomingShows && upcomingShows.page_count > 1 &&
                            <Row>

                                <Col lg={12} md={12} sm={12} xs={12}>
                                    <Pagination
                                        pageCount={upcomingShows.page_count}
                                        onPageChange={handleUpcomingShowPageClick}
                                    />
                                </Col>
                            </Row>
                        }
                    </section>
                </>
            }
        </React.Fragment>
    )
}





export const Artists = ({ slug }) => {
    const [initialized, setInitialized] = useState(false)
    const [Data, setData] = useState()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (!initialized) {
            handleData()
            setInitialized(true)
        }
    })
    const handleData = (page) => {
        axios
            .get(`${Urls().api()}/artist/${slug}/related-artists/`, { params: { page: page } })
            .then(({ data }) => {
                setData(data)
                setLoading(false)
            });
    }
    const onFollowClick = (index, id) => {
        let Artist = Data.results
        axios.post(`${Urls().api()}/follow/toggle/`, {
            id: id,
            type: 'artists'
        }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        ).then(({ data }) => {
            Artist[index].is_flw = data.state
            setData({ ...Data, Artist })
        })

    }

    const handlePageClick = (data) => {
        let selected = data.selected + 1;
        setLoading(true)
        handleData(selected);
    }
    return (
        <React.Fragment>
            {loading &&
                <div style={{ height: 150 }}>
                    <Loading background="#fff" />
                </div>
            }
            {Data && Data.results.length > 0 &&
                <div className={`${styles.Sections} nobb`}>
                    <Row>
                        {Data.results.map((item, index) => (
                            <Col key={index} lg={3} md={4} sm={6} xs={12}>
                                <ListWithFollowBtn
                                    img={item.img}
                                    name={item.name}
                                    detail={item.detail}
                                    is_flw={item.is_flw}
                                    url={`${Urls().artist()}${item.slug}`}
                                    onFollowClick={isLogined ? () => onFollowClick(index, item.id) : () => openModal(true)}
                                />
                            </Col>
                        ))}
                    </Row>

                    {Data && Data.page_count > 1 &&
                        <Pagination
                            pageCount={Data.page_count}
                            onPageChange={handlePageClick}
                        />
                    }
                </div>
            }
        </React.Fragment>
    )
}