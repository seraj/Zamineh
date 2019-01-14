import React from "react";
import Arts from "./Arts";

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
                    viewsLink="link"
                    mode="artists"
                    key={index}
                    query={`slug=${item.slug}`}
                    title={item.name}
                    hasannotation={this.props.hasannotation}
                    based_name={item.based_name}
                    based_slug={item.based_slug}
                    annotation={`پیشنهاد فالو بر اساس `}
                />
            ));
        }
    };
    render() {
        return <React.Fragment>{this.renderItems()}</React.Fragment>;
    }
}
export default RecomArtist;