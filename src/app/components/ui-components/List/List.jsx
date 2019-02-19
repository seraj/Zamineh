import React from 'react';
import { Img } from '../../General'
import styles from './List.scss'

export const FlatList = (props) => {
    return (
        <React.Fragment>
            <div className={styles.FlatList}>
                <div className='avatar'>
                    <a href={props.url}>
                        <Img
                            img={props.img}
                            alt={props.item.name}
                            width={50}
                        />
                    </a>
                </div>
                <a href={props.url}>
                    <span className={`name`}>{props.item.name}</span>
                </a>

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
                        <a href={props.url}>
                            <Img
                                img={props.img}
                                alt={props.name}
                                width={50}
                            />
                        </a>
                    </div>
                    <a href={props.url}>
                        <span className={`bold`}>{props.name}</span>
                        <span>{props.detail}</span>
                    </a>
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