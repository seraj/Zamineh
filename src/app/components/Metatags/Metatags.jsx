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

export const ArtistProfileMetaTag = (props) => {
    return (
        <Helmet>
            <title>پنل مدیریت هنرمند</title>
            <meta id='em_mtag1' property='og:description' content='' />
            <meta id='em_mtag2' property='og:url' content={`/panel/artist/dashboard`} />
            <meta id='em_mtag3' name='keywords' content='' />
            <meta id='em_mtag4' name='description' content='' />
        </Helmet>
    )
}

export const GalleryProfileMetaTag = (props) => {
    return (
        <Helmet>
            <title>پنل مدیریت گالری</title>
            <meta id='em_mtag1' property='og:description' content='' />
            <meta id='em_mtag2' property='og:url' content={`/panel/gallery/dashboard`} />
            <meta id='em_mtag3' name='keywords' content='' />
            <meta id='em_mtag4' name='description' content='' />
        </Helmet>
    )
}