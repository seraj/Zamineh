import React from 'react';
import { Link } from 'react-router-dom';
import SaveButton from '../../components/ui-components/SaveButton';
import { Img } from '../../components/General';
import NumbersConvertor from '../../components/NumbersConvertor';
import ThousandSeparator from '../../components/ThousandSeparator';
import Urls from '../../components/Urls';

const SingleArts = (props) => (
  <div className='Arts'>
    <div className='thumb'>
      <Link to={`${Urls().arts()}${props.item.slug}`}>
        <Img
          img={props.item.img.img}
          alt={props.item.name}
          width={props.item.img.ratio * 197}
        />
      </Link>
      <SaveButton id={props.item.id} isSaved={props.item.is_saved} />
    </div>
    <div className='art_details'>
      {props.item.title && <span className='content item_title' style={{ marginBottom: 5 }}><Link to={`${Urls().arts()}${props.item.slug}`}>{props.item.title}</Link></span>}
      {props.item.artist && <span className='content '><Link to={`${Urls().artist()}${props.item.artist.slug}`}>{props.item.artist.name}</Link></span>}
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
);

export default SingleArts;
