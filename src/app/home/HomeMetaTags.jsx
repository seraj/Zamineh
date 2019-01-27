import React from 'react';

import { Helmet } from 'react-helmet';

const HomeMetaTags = (props) => {
    return (
        <Helmet>
            <title>صفحه اصلی Home</title>
            <meta id='em_mtag1' property='og:description' content='مقاله' />
            <meta id='em_mtag2' property='og:url' content='/' />
            <meta id='em_mtag3' name='keywords' content='' />
            <meta id='em_mtag4' name='description' content='' />
        </Helmet>
    )
}
export default HomeMetaTags;