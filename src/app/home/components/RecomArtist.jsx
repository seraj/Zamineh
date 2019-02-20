import React from 'react';
import Urls from '../../components/Urls'
import Arts from './Arts';

class RecomArtist extends React.Component {
    renderItems = () => {
        if (this.props.artist) {
            return this.props.artist.map((item, index) => (
                <Arts
                    follow
                    visible
                    ExtraClass={item.ExtraClass}
                    isFollow={item.is_flw}
                    id={item.id}
                    viewsLink={`${Urls().artist()}${item.slug}/overview/`}
                    mode='artists'
                    key={index}
                    query={`slug=${item.slug}`}
                    title={item.name}
                    hasannotation={this.props.hasannotation}
                    based_name={item.based_name}
                    based_slug={item.based_slug}
                    annotation={`پیشنهاد فالو بر اساس `}
                    foreignItems={this.props.foreignItems}
                    items={this.props.foreignItems ? this.props.artist : null}
                />
            ));
        }
    };
    render() {
        return <>{this.renderItems()}</>;
    }
}
export default RecomArtist;