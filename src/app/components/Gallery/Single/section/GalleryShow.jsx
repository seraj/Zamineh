import React, { useState, useEffect } from "react";
import axios from 'axios';
import Urls from '../../../Urls'
import { OverviewSets } from '../../Galleries/SingleGallery';
import { Loading } from '../../../Spinner/Spinner';

import styles from './GallerySections.scss'

export const Shows = ({ slug }) => {
    const [initialized, setInitialized] = useState(false)
    const [Data, setData] = useState()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (!initialized) {
            axios
                .get(`${Urls().api()}/gallery/${slug}/show/`)
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

            {Data && Data.upcoming_shows &&
                <div className={styles.Sections}>
                    <OverviewSets
                        title='نمایشگاه‌های آینده'
                        viewAllUrl={`${Urls().gallery()}${slug}/shows/`}
                        item={Data.upcoming_shows}
                        type='show'
                    />
                </div>
            }


        </React.Fragment>
    )
}