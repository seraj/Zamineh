import React from 'react';
import Arts from './Arts';
import ModelManager from '../../components/Models';

class Categories extends React.Component {
  renderItems = () => {
    if (this.props.cats) {
      return this.props.cats.map((item, index) => (
        <Arts
          follow
          visible
          ExtraClass={item.ExtraClass}
          isFollow={item.is_flw}
          mode='cats'
          id={item.id}
          artist={item.artist}
          gallery={item.gallery}
          key={index}
          query={`slug=${item.slug}`}
          title={item.name}
          hasannotation
          annotation={ModelManager().convertModelName('genre')}
        />
      ));
    }
  };
  render() {
    return <>{this.renderItems()}</>;
  }
}
export default Categories;