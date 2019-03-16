import React from "react";
import { Helmet } from "react-helmet";
import Urls from "../Urls";
export const SingleArtistMetaTag = props => {
  return (
    <Helmet>
      <title>{props.title}</title>
      <meta id="em_mtag1" property="og:description" content="" />
      <meta
        id="em_mtag2"
        property="og:url"
        content={`${Urls().artist()}${props.slug}`}
      />
      <meta id="em_mtag3" name="keywords" content="" />
      <meta id="em_mtag4" name="description" content="" />
    </Helmet>
  );
};

export const ArtistProfileMetaTag = props => {
  return (
    <Helmet>
      <title>پنل مدیریت هنرمند</title>
      <meta id="em_mtag1" property="og:description" content="" />
      <meta
        id="em_mtag2"
        property="og:url"
        content={Urls().ArtistDashboard()}
      />
      <meta id="em_mtag3" name="keywords" content="" />
      <meta id="em_mtag4" name="description" content="" />
    </Helmet>
  );
};

export const GalleryProfileMetaTag = props => {
  return (
    <Helmet>
      <title>پنل مدیریت گالری</title>
      <meta id="em_mtag1" property="og:description" content="" />
      <meta
        id="em_mtag2"
        property="og:url"
        content={Urls().GalleryDashboard()}
      />
      <meta id="em_mtag3" name="keywords" content="" />
      <meta id="em_mtag4" name="description" content="" />
    </Helmet>
  );
};

export const SingleArtWorkMetaTag = props => {
  return (
    <Helmet>
      <title>{props.title}</title>
      <meta id="em_mtag1" property="og:description" content="" />
      <meta
        id="em_mtag2"
        property="og:url"
        content={`${Urls().arts()}${props.slug}`}
      />
      <meta id="em_mtag3" name="keywords" content="" />
      <meta id="em_mtag4" name="description" content="" />
    </Helmet>
  );
};
export const ShowsMetaTag = props => {
  return (
    <Helmet>
      <title>{props.title}</title>
      <meta id="em_mtag1" property="og:description" content="" />
      <meta id="em_mtag2" property="og:url" content={`${Urls().shows()}`} />
      <meta id="em_mtag3" name="keywords" content="" />
      <meta id="em_mtag4" name="description" content="" />
    </Helmet>
  );
};
export const SingleShowMetaTag = props => {
  return (
    <Helmet>
      <title>{props.title}</title>
      <meta id="em_mtag1" property="og:description" content="" />
      <meta
        id="em_mtag2"
        property="og:url"
        content={`${Urls().show()}${props.slug}`}
      />
      <meta id="em_mtag3" name="keywords" content="" />
      <meta id="em_mtag4" name="description" content="" />
    </Helmet>
  );
};
export const SingleCollectionMetaTag = props => {
  return (
    <Helmet>
      <title>{props.title}</title>
      <meta id="em_mtag1" property="og:description" content="" />
      <meta
        id="em_mtag2"
        property="og:url"
        content={`${Urls().collection()}${props.slug}`}
      />
      <meta id="em_mtag3" name="keywords" content="" />
      <meta id="em_mtag4" name="description" content="" />
    </Helmet>
  );
};
export const SingleCategoryMetaTag = props => {
  return (
    <Helmet>
      <title>{props.title}</title>
      <meta id="em_mtag1" property="og:description" content="" />
      <meta
        id="em_mtag2"
        property="og:url"
        content={`${Urls().gene()}${props.slug}`}
      />
      <meta id="em_mtag3" name="keywords" content="" />
      <meta id="em_mtag4" name="description" content="" />
    </Helmet>
  );
};
export const StaticPages = ({ title, url }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta id="em_mtag1" property="og:description" content="" />
      <meta id="em_mtag2" property="og:url" content={url} />
      <meta id="em_mtag3" name="keywords" content="" />
      <meta id="em_mtag4" name="description" content="" />
    </Helmet>
  );
};
