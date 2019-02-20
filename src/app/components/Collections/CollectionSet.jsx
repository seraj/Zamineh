import React from 'react';
import { Link } from 'react-router-dom';
import Urls from '../Urls';

import 'react-input-range-rtl/lib/css/index.css'
import styles from './Collections.scss'

function SingleCollection({ item }) {
    return (

        <div className={styles.items}>
            <div className={styles.img}>
                <Link to={`${Urls().collection()}${item.slug}`}>
                    <img src={item.img} alt={item.name} />
                </Link>
            </div>
            <div className={styles.name}>
                <Link to={`${Urls().collection()}${item.slug}`}>
                    <span>{item.name}</span>
                </Link>
            </div>
        </div>
    );
}
export function CollectionSet({ items }) {
    return (
        <>
            {
                items.map((item, index) => (

                    <div key={index} className={styles.collectionSet} id={item.en_name}>
                        <div className={styles.CollectionTitle}>{item.name}</div>
                        <div className={styles.dFlex}>
                            {item.collection_set.map(item => (
                                <SingleCollection
                                    key={item.id}
                                    item={item}
                                />
                            ))}
                        </div>

                    </div>
                ))
            }
        </>

    )
}
