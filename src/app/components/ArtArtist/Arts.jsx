import React from "react";
import { Link } from "react-router-dom";
import { IconSave } from "../Icons";
import { Img } from "../General"
import NumbersConvertor from "../NumbersConvertor";
import ThousandSeparator from "../ThousandSeparator";
import Urls from "../Urls";
import styles from "./Arts.scss";


export const SingleArt = (props) => (
    <React.Fragment>
        <div className={styles.Arts}>
            <div className="thumb">
                <Link to={`${Urls().arts()}${props.item.slug}`}>
                    <Img
                        img={props.item.img.img}
                        alt={props.item.title}
                        width='100%'
                        divHeight="200px"
                    />
                </Link>
                <div
                    className={"save_art " + ((props.item.is_saved) ? 'saved' : '') + ((props.item.save_loading) ? ' loading' : '')}
                    onClick={
                        props.isLogined ?
                            () => props.onSaveItemClick(props.ArtIndex)
                            :
                            () => props.openModal(true)
                    }
                    id={props.item.id}>
                    {props.item.save_loading && <div className="loadingSpinner"></div>}
                    <IconSave height="80%" width="90%" fill="transparent" stroke="#fff" />
                </div>
            </div>

            <div className="art_details">
                <span className="content item_price"><Link to={`${Urls().artist()}${props.item.artist.slug}`}>{NumbersConvertor().convertToPersian(ThousandSeparator(props.item.price))} تومان</Link></span>
                <span className="content item_artist_name"><Link to={`${Urls().artist()}${props.item.artist.slug}`}>{props.item.artist.name}</Link></span>
                <span className="content gallery_name">
                    {props.item.title}
                </span>
                {props.item.gallery != null &&
                    <span className="content gallery_name">
                        {props.item.gallery.slug ?
                            <Link to={`${Urls().gallery()}${props.item.gallery.slug}`}>{props.item.gallery.name}</Link>
                            :
                            props.item.gallery ? props.item.gallery.name : ''
                        }
                    </span>
                }

            </div>
        </div>
    </React.Fragment >
);
export const ThreeColumn = (props) => {
    const artworksCol1 = props.Arts.filter((item, index) => index % 3 == 0);
    const artworksCol2 = props.Arts.filter((item, index) => index % 3 == 1);
    const artworksCol3 = props.Arts.filter((item, index) => index % 3 == 2);
    return (
        <React.Fragment>
            <div style={{ display: 'flex' }}>
                {artworksCol1 &&
                    <div style={{
                        flex: '1 1 0%',
                        minWidth: '0',
                        marginLeft: 20
                    }}>
                        {artworksCol1.map((item, index) => (
                            <SingleArt
                                key={item.id}
                                item={item}
                                ArtIndex={index}
                                onSaveItemClick={props.onSaveItemClick}
                                openModal={props.openModal}
                                isLogined={props.isLogined}
                            />
                        ))}
                    </div>
                }
                {artworksCol2 &&
                    <div style={{
                        flex: '1 1 0%',
                        minWidth: '0',
                        marginLeft: 20
                    }}>
                        {artworksCol2.map((item, index) => (
                            <SingleArt
                                key={item.id}
                                item={item}
                                ArtIndex={index}
                                onSaveItemClick={props.onSaveItemClick}
                                openModal={props.openModal}
                                isLogined={props.isLogined}
                            />
                        ))}
                    </div>
                }
                {artworksCol3 &&
                    <div style={{
                        flex: '1 1 0%',
                        minWidth: '0',
                        // marginLeft: 20
                    }}>
                        {artworksCol3.map((item, index) => (
                            <SingleArt
                                key={item.id}
                                item={item}
                                ArtIndex={index}
                                onSaveItemClick={props.onSaveItemClick}
                                openModal={props.openModal}
                                isLogined={props.isLogined}
                            />
                        ))}
                    </div>
                }
            </div>
        </React.Fragment>
    )
}