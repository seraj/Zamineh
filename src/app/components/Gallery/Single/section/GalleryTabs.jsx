import React, { useState, useEffect } from "react";
import axios from 'axios';
import Urls from '../../../Urls'
import { OverviewSets, ShowSet, FourColumnArtist, PaginationItem } from '../../Galleries/SingleGallery';
import { Loading } from '../../../Spinner/Spinner';
import Pagination from '../../../Pagination/Pagination';

import styles from './GallerySections.scss'


export const Overview = ({ slug }) => {
    const [initialized, setInitialized] = useState(false)
    const [Data, setData] = useState()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (!initialized) {
            axios
                .get(`${Urls().api()}/gallery/${slug}/overview/`)
                .then(({ data }) => {
                    setData(data)
                    setLoading(false)
                });
            setInitialized(true)
        }
    })
    return (
        <React.Fragment>
            {loading &&
                <div style={{ height: 150 }}>
                    <Loading background="#fff" />
                </div>
            }
            {Data && Data.carousel_set &&
                <div className="carousel">
                    <ShowSet
                        item={Data.carousel_set}
                    />
                </div>
            }
            {Data && Data.about &&
                <section className={styles.overiewAbout}>
                    <h3>درباره گالری</h3>
                    <p>{Data.about}</p>
                </section>
            }
            {Data && Data.show_set &&
                <div className={styles.Sections}>
                    <OverviewSets
                        title='نمایشگاه‌ها'
                        viewAllUrl={`${Urls().gallery()}${slug}/shows/`}
                        item={Data.show_set}
                        type='show'
                    />
                </div>
            }
            {Data && Data.artist &&
                <div className={styles.Sections}>
                    <FourColumnArtist
                        title='هنرمندان'
                        viewAllUrl={`${Urls().gallery()}${slug}/artists/`}
                        sectionone='عنوان بخش اول'
                        sectiontwo='عنوان بخش دوم'
                        item={Data.artist}
                        type='artists'
                    />
                </div>
            }
            {Data && Data.article_set &&
                <div className={styles.Sections}>
                    <OverviewSets
                        title='مجلات'
                        viewAllUrl={`${Urls().gallery()}${slug}/articles/`}
                        item={Data.article_set}
                        type='article'
                    />
                </div>
            }
        </React.Fragment>
    )
}







export const Shows = ({ slug }) => {
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
            .get(`${Urls().api()}/gallery/${slug}/shows/`, { params: { page: page } })
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
            {Data && Data.current_shows &&
                <div className={`${styles.Sections} nobb`}>
                    <OverviewSets
                        title='نمایشگاه‌های الان'
                        // viewAllUrl={`${Urls().gallery()}${slug}/shows/`}
                        item={Data.current_shows}
                        type='show'
                    />
                </div>
            }
            {Data && Data.upcoming_shows &&
                <div className={styles.Sections}>
                    <PaginationItem
                        title='نمایشگاه‌های آینده'
                        // viewAllUrl={`${Urls().gallery()}${slug}/shows/`}
                        item={Data.upcoming_shows}
                        type='show'
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