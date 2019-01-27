import React from 'react';

import { Helmet } from 'react-helmet';

const SearchMetaTags = (props) => {
    return (
        <Helmet>
            <title>جستجو برای ...</title>
            <meta id='em_mtag1' property='og:description' content='' />
            <meta id='em_mtag2' property='og:url' content='/search' />
            <meta id='em_mtag3' name='keywords' content='' />
            <meta id='em_mtag4' name='description' content='' />
        </Helmet>
    )
}
export default SearchMetaTags;