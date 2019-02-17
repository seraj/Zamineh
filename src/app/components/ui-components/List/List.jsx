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
export const ListWithFollowBtn = (props) => {
    return (
        <React.Fragment>
            <div className={styles.ListWithFollowBtn}>
                <div className="info">
                    <div className='img'>
                        <Link to={props.url}>
                            <Img
                                img={props.img}
                                alt={props.name}
                                width={50}
                            />
                        </Link>
                    </div>
                    <Link to={props.url}>
                        <span className={`bold`}>{props.name}</span>
                        <span>{props.detail}</span>
                    </Link>
                </div>
                <div className="button">
                    <button
                        className={`${styles.followBtn} ${props.is_flw ? 'following' : ''}`}
                        onClick={props.onFollowClick}
                    ></button>
                </div>
            </div>
        </React.Fragment>
    )
}