import React from 'react';

import { Helmet } from 'react-helmet';

const RegisterMetaTags = (props) => {
    return (
        <Helmet>
            <title>{props.title}</title>
            <meta id="em_mtag1" property="og:description" content="" />
            <meta id="em_mtag2" property="og:url" content="/registration" />
            <meta id="em_mtag3" name="keywords" content="" />
            <meta id="em_mtag4" name="description" content="" />
        </Helmet>
    )
}
export default RegisterMetaTags;