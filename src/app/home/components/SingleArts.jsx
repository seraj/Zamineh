import React from 'react';
import { Link } from 'react-router-dom';
import { IconSave } from '../../components/Icons';
import { Img } from '../../components/General';
import NumbersConvertor from '../../components/NumbersConvertor';
import ThousandSeparator from '../../components/ThousandSeparator';
import Urls from '../../components/Urls';

const SingleArts = (props) => (
  <React.Fragment>
    <div className='Arts'>
      <div className='thumb'>
        <Link to={`${Urls().arts()}${props.item.slug}`}>
          <Img
            img={props.item.img.img}
            alt={props.item.name}
            width={props.item.img.ratio * 197}
          />
        </Link>
        <div
          className={'save_art ' + ((props.item.is_saved) ? 'saved' : '') + ((props.item.save_loading) ? ' loading' : '')}
          onClick={
            props.isLogined ?
              () => props.onSaveItemClick(props.ArtIndex)
              :
              () => props.openModal(true)
          }

          id={props.item.id}>
          {props.item.save_loading && <div className='loadingSpinner'></div>}
          <IconSave height='80%' width='90%' fill='transparent' stroke='#fff' />
        </div>
      </div>
      <div className='art_details'>
        <span className='content item_title'><Link to={`${Urls().artist()}${props.item.artist.slug}`}>{props.item.artist.name}</Link></span>
        <span className='content gallery_name'>
          {props.item.gallery != null &&
            props.item.gallery.slug ?
            <Link to={`${Urls().gallery()}${props.item.gallery.slug}`}>{props.item.gallery.name}</Link>
            :
            props.item.gallery ? props.item.gallery.name : ''
          }
        </span>
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
      </div>
    </div>
  </React.Fragment >
);

export default SingleArts;
