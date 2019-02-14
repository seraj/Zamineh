import React, { useState, useEffect } from "react";
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';

import axios from 'axios';
import Urls from '../Urls'
import { Toast } from '../Toast/Toast';

import { Loading } from '../Spinner/Spinner';
import Pagination from '../Pagination/Pagination';
import { FourColumnArt } from '../ArtArtist/Arts';
import { FlatArtist } from '../Artists/SingleArtist';
import { Img } from '../General'

import { EditGallery, Report } from './GalleryProfileForms'

import styles from './GalleryProfile.scss'

export const Tabz = ({ type }) => {
    const [initialized, setInitialized] = useState(false)
    const [Data, setData] = useState()

    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (!initialized) {
            getData(type)
            setInitialized(true)
        }
    })
    const getData = (slug, page) => {
        axios.get(`${Urls().api()}/gallery-app/gallery/${slug}/list/`, {
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
    const onGalleryBtnClick = (item) => {
        let Result = Data.results.filter(art => art.id === item.id)
        axios.post(`${Urls().api()}/gallery-app/show-in-zamineh/toggle/`, {
            type: 'Art',
            art_id: item.id
        })
            .then(({ data }) => {
                Result[0].in_zamineh = data.status
                setData({
                    ...Data,
                    Result
                })
            });
    }
    const showInZaminehShowClick = (item) => {
        let Result = Data.results.filter(items => items.id === item.id)
        axios.post(`${Urls().api()}/gallery-app/show-in-zamineh/toggle/`, {
            type: 'Show',
            show_id: item.id
        })
            .then(({ data }) => {
                Result[0].in_zamineh = data.status
                setData({
                    ...Data,
                    Result
                })
            });
    }
    const GalleryProfileBtn = (item) => <div onClick={() => onGalleryBtnClick(item)} className={`${styles.GalleryBtn} ${item.in_zamineh ? 'active' : ''}`}>{item.in_zamineh ? 'برداشتن از زمینه' : 'نمایش در زمینه'}</div>
    const showInZaminehSHOWS = (item) => <div onClick={() => showInZaminehShowClick(item)} className={`${styles.GalleryBtn} ${item.in_zamineh ? 'active' : ''}`}>{item.in_zamineh ? 'برداشتن از زمینه' : 'نمایش در زمینه'}</div>
    return (
        <React.Fragment>
            {loading &&
                <div style={{ height: 150 }}>
                    <Loading background="#fff" />
                </div>
            }
            {type === 'art' &&
                <>
                    {Data && Data.results && Data.results.length > 0 ?
                        <section className={styles.tabSection}>
                            <h2 className={styles.title}></h2>
                            <FourColumnArt
                                Arts={Data.results}
                                GalleryProfile={true}
                                GalleryProfileContent={GalleryProfileBtn}
                            />

                            {Data.page_count > 1 &&
                                <Row>
                                    <Col xs={12}>
                                        <Pagination
                                            pageCount={Data.page_count}
                                            onPageChange={handlePageClick}
                                        />
                                    </Col>
                                </Row>
                            }
                        </section>
                        :
                        <h2 className={styles.title}>شما اثر ثبت شده ای در این گالری ندارید</h2>
                    }
                </>
            }
            {type === 'artist' &&
                <>
                    {Data && Data.results && Data.results.length > 0 ?
                        <section className={styles.tabSection}>
                            <h2 className={styles.title}></h2>
                            <Row>
                                {Data.results.map((artist, index) => (
                                    <Col lg={3} md={4} sm={6} xs={12} key={index}>
                                        <FlatArtist item={artist} />
                                    </Col>
                                ))}
                                {Data.page_count > 1 &&
                                    <Col xs={12}>
                                        <Pagination
                                            pageCount={Data.page_count}
                                            onPageChange={handlePageClick}
                                        />
                                    </Col>
                                }
                            </Row>
                        </section>
                        :
                        <h2 className={styles.title}>شما هنرمند ثبت شده ای در این گالری ندارید</h2>
                    }
                </>
            }

            {type === 'show' &&
                <>
                    {Data && Data.results && Data.results.length > 0 ?
                        <section className={`${styles.tabSection} shows`}>
                            <h2 className={styles.title}></h2>
                            <Row>
                                {Data.results.map((show, index) => (
                                    <Col key={index} lg={4} md={6} sm={6} xs={12}>
                                        <div className='feature'>
                                            <a href={Urls().show() + show.slug} className='img-link'>
                                                <div className='img img-hoverable'>
                                                    <Img img={show.img} alt={show.title} width='100%' height='250px' />
                                                </div>
                                            </a>
                                            <div className='details'>
                                                <a href={Urls().show() + show.slug}>
                                                    <h3>{show.title}</h3>
                                                    <h4>{show.full_title}</h4>
                                                </a>
                                                {showInZaminehSHOWS(show)}
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </section>
                        :
                        <h2 className={styles.title}>شما نمایشگاه ثبت شده ای در این گالری ندارید</h2>
                    }
                </>
            }
            {/* 
            {followedGalleries && followedGalleries.gallery_set &&
                <section className={styles.tabSection}>
                    <h2 className={styles.title}>گالری‌هایی که دنبال میکنید <span>{followedGalleries.count} گالری‌ دنبال میکنید</span></h2>
                    <ResultsGrid
                        item={followedGalleries.gallery_set}
                        onFollowClick={onFollowClick}
                    />
                </section>
            } */}

        </React.Fragment>
    )
}







export const Settings = ({ Config }) => {
    const [initialized, setInitialized] = useState(false)
    const [Data, setData] = useState()
    const [MapData, setMapData] = useState()
    const [loading, setLoading] = useState(true)
    const [formLoading, setFormLoading] = useState(false)
    useEffect(() => {
        if (!initialized) {
            handleData()
            setInitialized(true)
        }
    })
    const handleData = () => {
        axios
            .get(`${Urls().api()}/gallery-app/gallery/profile/edit/`)
            .then(({ data }) => {
                setData(data)
                setLoading(false)
            });
    }
    const onMapClick = (event) => {
        setMapData(event.latlng)
    }
    const handleSubmit = values => {
        setFormLoading(true)
        console.log(values)
        if (!Validation(values)) {
            Toast('warning', 'اطلاعات تکمیل نمیباشد');
        }
        else {
            axios
                .post(`${Urls().api()}/gallery-app/gallery/profile/edit/`, values,
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }
                    })
                .then(({ data }) => {
                    setData(data)
                    setFormLoading(false)
                    Toast('success', `اطلاعات شما با موفقیت ثبت شد`);
                })
                .catch(err => {
                    if (err.response.status == 403) {
                        Toast('warning', 'پروفایل شما تایید نشده است.');
                        setFormLoading(false)
                    } else {
                        Toast('warning', 'مشکلی رخ داده است!');
                        setFormLoading(false)
                    }
                })
        }
    }

    const Validation = (value) => {
        if (
            value.name == '' ||
            value.address.address == undefined ||
            value.address.address == '' ||
            value.address.tel == undefined ||
            value.address.tel == '' ||
            value.work_hours.start_time == undefined ||
            value.work_hours.start_time == '' ||
            value.work_hours.end_time == undefined ||
            value.work_hours.end_time == '' ||
            value.holiday_set == undefined ||
            value.holiday_set == '' ||
            value.email == null ||
            value.email == '' ||
            value.sheba_num == null ||
            value.sheba_num == '' ||
            value.owner.name == undefined ||
            value.owner.name == '' ||
            value.owner.tel == undefined ||
            value.owner.tel == ''
        ) {
            return false
        } else {
            return true
        }
    }
    return (
        <React.Fragment>
            {loading &&
                <div style={{ height: 150 }}>
                    <Loading background="#fff" />
                </div>
            }
            <section className={styles.tabSection}>

                <EditGallery
                    loading={formLoading}
                    values={Data}
                    handleSubmit={handleSubmit}
                    onMapClick={onMapClick}
                    config={Config}
                />
            </section>


        </React.Fragment>
    )
}






export const Notification = () => {
    const [initialized, setInitialized] = useState(false)
    const [Data, setData] = useState()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (!initialized) {
            handleData()
            setInitialized(true)
        }
    })
    const handleData = () => {
        axios
            .get(`${Urls().api()}/gallery-app/gallery/notifications/`)
            .then(({ data }) => {
                setData(data)
                sendData()
                setLoading(false)
            });
    }
    const sendData = () => {
        axios.post(`${Urls().api()}/gallery-app/gallery/notifications/`)
    }
    return (
        <React.Fragment>
            {loading &&
                <div style={{ height: 150 }}>
                    <Loading background="#fff" />
                </div>
            }

            <section className={styles.tabSection}>
                <h2 className={styles.title}>رخدادها</h2>
                {Data &&
                    Data.results.map((item, index) => (
                        <div key={index} className={`${styles.notification} ${item.is_seen ? '' : 'seen'}`}>
                            <h2>{item.body}</h2>
                            <span className='notification_time'>{item.date} {item.time}</span>
                        </div>
                    ))
                }
            </section>


        </React.Fragment>
    )
}



export const Transactions = () => {
    const [initialized, setInitialized] = useState(false)
    const [Data, setData] = useState()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (!initialized) {
            handleData()
            setInitialized(true)
        }
    })
    const handleData = () => {
        axios
            .get(`${Urls().api()}/gallery-app/panel/transaction/list/`)
            .then(({ data }) => {
                setData(data)
                setLoading(false)
            });
    }

    return (
        <React.Fragment>
            {loading &&
                <div style={{ height: 150 }}>
                    <Loading background="#fff" />
                </div>
            }

            <section className={styles.tabSection}>
                <h2 className={styles.title}>تراکنش‌ها</h2>
                {Data &&
                    Data.results.length > 0 ?
                    Data.results.map((item, index) => (
                        <TransactionList key={index} item={item} />
                    ))
                    :
                    <h2>شما تابحال تراکنشی ثبت نکرده‌اید.</h2>
                }
            </section>


        </React.Fragment>
    )
}


export const ReportBug = () => {
    const [initialized, setInitialized] = useState(false)
    const [Data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const [formLoading, setFormLoading] = useState(false)
    useEffect(() => {
        if (!initialized) {
            setLoading(false)
            setInitialized(true)
        }
    })
    const handleSubmit = values => {
        setFormLoading(true)
        console.log(values)
        axios
            .post(`${Urls().api()}/client-app/client/report-bug/`, values)
            .then(({ data }) => {
                setData(data)
                Toast('success', `گزارش با موفقیت ثبت شد`);

                setFormLoading(false)
            })
            .catch(err => {
                setFormLoading(false)
            })
    }

    return (
        <React.Fragment>
            {loading &&
                <div style={{ height: 150 }}>
                    <Loading background="#fff" />
                </div>
            }

            <section className={styles.tabSection}>
                <h2 className={styles.title}>گزارش خطا در وبسایت</h2>
                <Report
                    loading={formLoading}
                    values={Data}
                    handleSubmit={handleSubmit}
                />
            </section>


        </React.Fragment>
    )
}