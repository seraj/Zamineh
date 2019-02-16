import React, { useState, useEffect } from "react";
import cookie from 'react-cookies'
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';


import axios from 'axios';
import SecurityManager from '../../security/SecurityManager'
import Urls from '../Urls'
import { Toast } from '../Toast/Toast';
import Modal from '../ui-components/Modal/Modal'

import { Loading } from '../Spinner/Spinner';
import Pagination from '../Pagination/Pagination';
import { FourColumnArt } from '../ArtArtist/Arts';
import { Flatlist } from '../ui-components/List/List';
import { Img } from '../General'

import styles from './Artists.scss'

export const Overview = ({ type, slug }) => {
    const [initialized, setInitialized] = useState(false)
    const [Data, setData] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!initialized) {
            getData(type, slug)
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
            {Data && Data.bio &&
                <>
                    <div className="about">
                        <h2>درباره نویسنده</h2>
                        {Data.bio}</div>
                    <hr />
                </>
            }


        </React.Fragment>
    )
}




