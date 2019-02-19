import React, { useState, useEffect } from "react";
import { generatePath } from 'react-router-dom';
import createBrowserHistory from "history/createBrowserHistory";

import axios from 'axios';
import Urls from '../../../Urls'
import { OverviewSets, ShowSet, FourColumnArtist, PaginationItem } from '../../Galleries/SingleGallery';
import { Loading } from '../../../Spinner/Spinner';
import Pagination from '../../../Pagination/Pagination';
import { FourColumnArt } from '../../../ArtArtist/Arts';
import { Checkbox } from '../../../ui-components/Form/inputs'
import NumbersConvertor from '../../../NumbersConvertor';

import styles from './GallerySections.scss'

const history = createBrowserHistory()

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
            {Data && Data.show_set && Data.show_set.length > 0 &&
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
            {Data && Data.article_set && Data.article_set.length > 0 &&
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
            {Data && Data.current_shows && Data.current_shows.length > 0 &&
                <div className={`${styles.Sections} nobb`}>
                    <OverviewSets
                        title='نمایشگاه‌های الان'
                        // viewAllUrl={`${Urls().gallery()}${slug}/shows/`}
                        item={Data.current_shows}
                        type='show'
                    />
                </div>
            }
            {Data && Data.upcoming_shows && Data.upcoming_shows.length > 0 &&
                <div className={`${styles.Sections}`}>
                    <OverviewSets
                        title='نمایشگاه‌های آتی'
                        // viewAllUrl={`${Urls().gallery()}${slug}/shows/`}
                        item={Data.upcoming_shows}
                        type='show'
                    />
                </div>
            }
            {Data && Data.past_shows && Data.past_shows.length > 0 &&
                <div className={styles.Sections}>
                    <PaginationItem
                        title='نمایشگاه‌های گذشته'
                        // viewAllUrl={`${Urls().gallery()}${slug}/shows/`}
                        item={Data.past_shows}
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
    const handleData = () => {
        axios
            .get(`${Urls().api()}/gallery/${slug}/artists/`)
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
            {Data && Data.up_artist_set &&
                <div className={`${styles.Sections} nobb`}>
                    <FourColumnArtist
                        title='هنرمندان'
                        sectionone='عنوان بخش اول'
                        sectiontwo='عنوان بخش دوم'
                        item={Data.up_artist_set}
                        type='artists'
                        artistTab
                    />
                </div>
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
            .get(`${Urls().api()}/gallery/${slug}/articles/`, { params: { page: page } })
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
            {Data && Data.article_set && Data.article_set.length > 0 &&
                <div className={`${styles.Sections} nobb`}>
                    <PaginationItem
                        item={Data.article_set}
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



export const Artworks = ({ slug, isLogined, openModal }) => {
    const [initialized, setInitialized] = useState(false)
    const [Data, setData] = useState()
    const [Values, setValues] = useState({
        only_for_sale: null,
        price_range: null,
        size: null,
        medium: null,
        sort: null
    })
    const [loading, setLoading] = useState(true)
    const [Resultloading, setResultloading] = useState(true)

    useEffect(() => {
        if (!initialized) {
            handleData()
            setInitialized(true)
        }
    })
    const handleData = (params) => {
        // console.log(params)
        axios
            .get(`${Urls().api()}/gallery/${slug}/artworks/`, { params: params })
            .then(({ data }) => {
                setData(data)
                setLoading(false)
                setResultloading(false)
            });
    }
    const handlePageClick = (data) => {
        let selected = data.selected + 1;
        setLoading(true)
        handleData(selected);
    }
    const handleFormChange = (type, value) => {
        setResultloading(true)
        let allValue = Values
        allValue[type] = value
        setValues(allValue)
        handleData(Values)
    }

    const urlParams = (
        sale,
        size,
        price,
        medium
    ) => {
        history.push({
            pathname: `
            ${sale ? `only_for_sale=${sale}&&` : ``}        
            ${size ? `size=${size}&&` : ``}        
            ${price ? `price=${price}&&` : ``}        
            ${medium ? `medium=${medium}` : ``}        
            `,
        })
    }
    const filterFormRef = (form) => {
        form = form;
    }
    return (
        <React.Fragment>
            {loading &&
                <div style={{ height: 150 }}>
                    <Loading background="#fff" />
                </div>
            }

            {Data && Data.filter &&
                <div className={styles.artFilter}>
                    <form ref={filterFormRef}>
                        {Values.only_for_sale !== '' &&
                            <div onClick={() => handleFormChange('only_for_sale', Values.only_for_sale ? null : true)} className={`filter-button ${Values.only_for_sale ? 'active' : ''}`}>
                                <Checkbox
                                    disabled={true}
                                    id={Data.filter.only_for_sale.value}
                                    label={Data.filter.only_for_sale.title}
                                    checked={Values.only_for_sale}
                                />
                            </div>
                        }
                        <FilterDropDown
                            name='اندازه'
                            data={Data.filter.size_set}
                            defaultOptionClick={() => handleFormChange('size', null)}
                            value={Values.size}
                            handleChange={handleFormChange}
                            options={Data.filter.size_set}
                        />
                        <FilterDropDown
                            name='قیمت'
                            data={Data.filter.price_set}
                            defaultOptionClick={() => handleFormChange('price_range', null)}
                            value={Values.price_range}
                            handleChange={handleFormChange}
                            options={Data.filter.price_set}
                        />
                        <FilterDropDown
                            name='بستر'
                            data={Data.filter.medium_set}
                            defaultOptionClick={() => handleFormChange('medium', null)}
                            value={Values.medium}
                            handleChange={handleFormChange}
                            options={Data.filter.medium_set}
                        />
                    </form>
                </div>
            }
            {Data && Data.art_set && Data.art_set.length > 0 &&
                <div className={`${styles.Sections} nobb`}>
                    {Resultloading && <Loading />}
                    <FourColumnArt
                        Arts={Data.art_set}
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

const FilterDropDown = ({ name, options, value, handleChange, defaultOptionClick, data }) => {
    const activeValue = data.filter(item => item.value === value)
    return (
        <React.Fragment>
            {options && options.length > 0 &&
                <div className={`filter-dropdown ${value != null ? 'is-active' : null}`}>
                    <div className="filter-nav-main-text">{name}</div>
                    <div className="filter-nav-active-text">{(value != null && activeValue !== null) ? activeValue[0].title : null}</div>
                    <i className='icon fas fa-caret-down' />
                    <nav className="filter-dropdown-nav">
                        <a onClick={defaultOptionClick}>
                            <span className="filter-dropdown-text">همه</span>
                        </a>
                        {options.map((item, index) => (
                            <a key={index} onClick={() => handleChange(item.type, item.value)}>
                                <span className="filter-dropdown-text">{item.title}</span>
                                <span className="filter-dropdown-count">({NumbersConvertor().convertToPersian(item.count)})</span>
                            </a>
                        ))}
                    </nav>
                </div>
            }
        </React.Fragment>
    )
}