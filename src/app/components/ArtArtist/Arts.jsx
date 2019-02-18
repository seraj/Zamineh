import React from 'react';
import { Link } from 'react-router-dom';
import { IconSave } from '../Icons';
import { Img } from '../General'
import NumbersConvertor from '../NumbersConvertor';
import ThousandSeparator from '../ThousandSeparator';
import Urls from '../Urls';
import styles from './Arts.scss';


export const SingleArt = (props) => (
    <React.Fragment>
        <div className={styles.Arts}>
            <div className='thumb'>
                <a href={`${Urls().arts()}${props.item.slug}`}>
                    <Img
                        img={props.item.img.img}
                        alt={props.item.title}
                        width='100%'
                        divHeight='200px'
                    />
                </a>
                {props.onSaveItemClick &&
                    <div
                        className={'save_art ' + ((props.item.is_saved) ? 'saved' : '') + ((props.item.save_loading) ? ' loading' : '')}
                        onClick={
                            props.isLogined ?
                                () => props.onSaveItemClick(props.ArtIndex, props.type)
                                :
                                () => props.openModal(true)
                        }
                        id={props.item.id}>
                        {props.item.save_loading && <div className='loadingSpinner'></div>}
                        <IconSave height='80%' width='90%' fill='transparent' stroke='#fff' />
                    </div>
                }
            </div>

            <div className='art_details'>
                {props.item.price && props.item.price.is_for_sale &&
                    <span className='content item_price'>
                        {
                            !props.item.price.is_sold ?
                                `${NumbersConvertor().convertToPersian(ThousandSeparator(props.item.price.price))} تومان `
                                :
                                'فروخته شده'
                        }
                    </span>
                }
                {props.item.artist && <span className='content item_artist_name'><Link to={`${Urls().artist()}${props.item.artist.slug}/overview/`}>{props.item.artist.name}</Link></span>}
                <span className='content gallery_name'>
                    {props.item.title ? props.item.title : ''}
                    {props.item.name ? props.item.name : ''}
                </span>
                {props.item.gallery != null &&
                    <span className='content gallery_name'>
                        {props.item.gallery.slug ?
                            <Link to={`${Urls().gallery()}${props.item.gallery.slug}/overview/`}>{props.item.gallery.name}</Link>
                            :
                            props.item.gallery ? props.item.gallery.name : ''
                        }
                    </span>
                }
                {props.GalleryProfile ? props.GalleryProfileContent(props.item) : ''}

            </div>
        </div>
    </React.Fragment>
);


export const ThreeColumnArt = (props) => {
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
                        {artworksCol1.map((item) => (
                            <SingleArt
                                key={item.id}
                                item={item}
                                ArtIndex={item.id}
                                type={props.type}
                                onSaveItemClick={props.onSaveItemClick}
                                openModal={props.openModal}
                                isLogined={props.isLogined}
                                GalleryProfile={props.GalleryProfile}
                                GalleryProfileContent={props.GalleryProfileContent}
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
                        {artworksCol2.map((item) => (
                            <SingleArt
                                key={item.id}
                                item={item}
                                ArtIndex={item.id}
                                type={props.type}
                                onSaveItemClick={props.onSaveItemClick}
                                openModal={props.openModal}
                                isLogined={props.isLogined}
                                GalleryProfile={props.GalleryProfile}
                                GalleryProfileContent={props.GalleryProfileContent}
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
                        {artworksCol3.map((item) => (
                            <SingleArt
                                key={item.id}
                                item={item}
                                ArtIndex={item.id}
                                type={props.type}
                                onSaveItemClick={props.onSaveItemClick}
                                openModal={props.openModal}
                                isLogined={props.isLogined}
                                GalleryProfile={props.GalleryProfile}
                                GalleryProfileContent={props.GalleryProfileContent}
                            />
                        ))}
                    </div>
                }
            </div>
        </React.Fragment>
    )
}



export const FourColumnArt = (props) => {
    const artworksCol1 = props.Arts.filter((item, index) => index % 4 == 0);
    const artworksCol2 = props.Arts.filter((item, index) => index % 4 == 1);
    const artworksCol3 = props.Arts.filter((item, index) => index % 4 == 2);
    const artworksCol4 = props.Arts.filter((item, index) => index % 4 == 3);
    return (
        <React.Fragment>
            <div style={{ display: 'flex' }}>
                {artworksCol1 &&
                    <div style={{
                        flex: '1 1 0%',
                        minWidth: '0',
                        marginLeft: 20
                    }}>
                        {artworksCol1.map((item) => (
                            <SingleArt
                                key={item.id}
                                item={item}
                                ArtIndex={item.id}
                                type={props.type}
                                onSaveItemClick={props.onSaveItemClick}
                                openModal={props.openModal}
                                isLogined={props.isLogined}
                                GalleryProfile={props.GalleryProfile}
                                GalleryProfileContent={props.GalleryProfileContent}
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
                        {artworksCol2.map((item) => (
                            <SingleArt
                                key={item.id}
                                item={item}
                                ArtIndex={item.id}
                                type={props.type}
                                onSaveItemClick={props.onSaveItemClick}
                                openModal={props.openModal}
                                isLogined={props.isLogined}
                                GalleryProfile={props.GalleryProfile}
                                GalleryProfileContent={props.GalleryProfileContent}
                            />
                        ))}
                    </div>
                }
                {artworksCol3 &&
                    <div style={{
                        flex: '1 1 0%',
                        minWidth: '0',
                        marginLeft: 20
                    }}>
                        {artworksCol3.map((item) => (
                            <SingleArt
                                key={item.id}
                                item={item}
                                ArtIndex={item.id}
                                type={props.type}
                                onSaveItemClick={props.onSaveItemClick}
                                openModal={props.openModal}
                                isLogined={props.isLogined}
                                GalleryProfile={props.GalleryProfile}
                                GalleryProfileContent={props.GalleryProfileContent}
                            />
                        ))}
                    </div>
                }
                {artworksCol4 &&
                    <div style={{
                        flex: '1 1 0%',
                        minWidth: '0',
                        // marginLeft: 20
                    }}>
                        {artworksCol4.map((item) => (
                            <SingleArt
                                key={item.id}
                                item={item}
                                ArtIndex={item.id}
                                type={props.type}
                                onSaveItemClick={props.onSaveItemClick}
                                openModal={props.openModal}
                                isLogined={props.isLogined}
                                GalleryProfile={props.GalleryProfile}
                                GalleryProfileContent={props.GalleryProfileContent}
                            />
                        ))}
                    </div>
                }
            </div>
        </React.Fragment>
    )
}