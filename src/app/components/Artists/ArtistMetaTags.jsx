import React from 'react';

import { Helmet } from 'react-helmet';

export const SingleArtistMetaTag = (props) => {
    return (
        <Helmet>
            <title>{props.title}</title>
            <meta id='em_mtag1' property='og:description' content='' />
            <meta id='em_mtag2' property='og:url' content={`/artist/${props.slug}`} />
            <meta id='em_mtag3' name='keywords' content='' />
            <meta id='em_mtag4' name='description' content='' />
        </Helmet>
    )
}
