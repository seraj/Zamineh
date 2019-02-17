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
import { Flatlist } from '../ui-components/List/List';
import { Img } from '../General'

import styles from './Artists.scss'

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
                                {item.gallery.slug !== '' ? <Link to={`${Urls().gallery()}${item.slug}`}>{item.gallery.name}</Link> : item.gallery.name}
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
                                    {item.gallery.slug !== '' ? <Link to={`${Urls().gallery()}${item.slug}`}>{item.gallery.name}</Link> : item.gallery.name}
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
    const [Data, setData] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!initialized) {
            // getData(type, slug)
            setLoading(false)
            setInitialized(true)
        }
    })
    const getData = (type, slug, page) => {
        axios.get(`${Urls().api()}/artist/${slug}/${type}/`, {
            params: {
                page: page
            }
        })
            .then(({ data }) => {
                setData(data)
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

        </React.Fragment>
    )
}




