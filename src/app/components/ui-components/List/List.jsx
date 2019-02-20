import React from 'react';
import { Img } from '../../General'
import FollowButton from '../FollowButton'

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
                    <FollowButton id={props.id} type='artists' isFollowed={props.is_flw} wide />

                </div>
            </div>
        </React.Fragment>
    )
}