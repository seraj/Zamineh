import React from 'react';
import { Link } from 'react-router-dom';
import { Img } from '../../General'
import styles from './List.scss'

export const FlatList = (props) => {
    return (
        <React.Fragment>
            <div className={styles.FlatList}>
                <div className='avatar'>
                    <Link to={props.url}>
                        <Img
                            img={props.img}
                            alt={props.item.name}
                            width={50}
                        />
                    </Link>
                </div>
                <Link to={props.url}>
                    <span className={`name`}>{props.item.name}</span>
                </Link>

            </div>
        </React.Fragment>
    )
}