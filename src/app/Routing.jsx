import React from 'react';
import Urls from './components/Urls';
import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import {
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

import SecurityManager from './security/SecurityManager';



import Loadable from 'react-loadable';

import page404 from './components/errorPages/404';
// import Home from './home/Home';
import Artists from './components/Artists/Artists';
import ArtistAlphabet from './components/Artists/ArtistAlphabet';
import Login from './login/Login';

import Galleries from './components/Gallery/Galleries/Galleries';
import Gallery from './components/Gallery/Single/Gallery';

import GalleryAlphabet from './components/Gallery/GalleryAlphabet/GalleryAlphabet';

import Search from './components/Search/Search'
import Collect from './components/Collect/Collect'
import Collections from './components/Collections/Collections'
import Articles from './article/Articles';
import AddCollections from './registration/AddCollExb/AddCollections';
import AddExhibitions from './registration/AddCollExb/AddExhibitions';
import AddExhibitionsGallery from './registration/AddCollExb/AddExhibitions-gallery';
import AddSingleArt from './registration/AddCollExb/AddSingleArt';
import ArtistRegistration from './registration/artist/ArtistRegistration';
import GalleryRegistration from './registration/gallery/GalleryRegistration';
import Section from './components/Section/Section';

import Profile from './components/Profile/Profile';
import GalleryProfile from './components/GalleryProfile/GalleryProfile';


import { LoadingHome } from './components/Loaders/Loaders';



if (typeof document !== 'undefined') {

    var url = window.location.href;
}
else {
    url = ''
}




const Home = Loadable({
    loader: () => import('./home/Home'),
    loading: LoadingHome
});






export default function Routing({ isLogined }) {
    return (
        <Section ExtraClass={'content singlePage'}>
            <Switch>

                {/* Home Page */}
                <Route
                    path='/'
                    exact
                    render={() => <Home isLogined={isLogined} />}
                />

                {/* Login Page */}
                <Route
                    path='/login'
                    exact
                    render={props =>
                        isLogined ? (
                            <Redirect
                                to={{
                                    pathname: "/",
                                    state: { from: props.location }
                                }}
                            />
                        ) : (
                                <Login LoginPage={true} />
                            )
                    }
                />

                <PrivateRoute
                    path={`${Urls().profile()}`}
                    component={Profile}
                />
                <PrivateRoute
                    path={`${Urls().galleryProfile()}`}
                    component={GalleryProfile}
                />


                {/* Magzine */}
                <Route
                    path={Urls().Magzine()}
                    render={() => <Articles isLogined={isLogined} />}
                />


                {/* Artists */}
                <Route
                    path={Urls().artists()}
                    exact
                    render={() => <Artists isLogined={isLogined} />}
                />
                <Route
                    path={`${Urls().artists()}:artistChar`}
                    component={ArtistAlphabet}
                />

                {/* Galleries */}
                <Route
                    path={Urls().galleries()}
                    exact
                    render={() => <Galleries isLogined={isLogined} />}
                />
                <Route
                    path={Urls().galleriesAZ()}
                    exact
                    render={() => <GalleryAlphabet />}
                />
                <Route
                    path={`${Urls().gallery()}:slug`}
                    component={Gallery}
                />



                {/* Artist & Gallery Registration */}
                <Route
                    exact
                    path={Urls().ArtistRegistration()}
                    render={() => <ArtistRegistration />}
                />
                <Route
                    exact
                    path={`${Urls().AddSingleArt()}`}
                    render={() => <AddSingleArt />}
                />
                <Route
                    exact
                    path={`${Urls().AddCollections()}`}
                    render={() => <AddCollections />}
                />
                <Route
                    exact
                    path={`${Urls().AddExhibitions()}`}
                    render={() => <AddExhibitions />}
                />
                <Route
                    exact
                    path={`${Urls().AddExhibitionsGallery()}`}
                    render={() => <AddExhibitionsGallery />}
                />
                <Route
                    exact
                    path={Urls().GalleryRegistration()}
                    render={() => <GalleryRegistration />}
                />


                <Route
                    path={`${Urls().arts()}:artsId`}
                    render={() => <Articles />}
                />


                {/* Search */}
                <Route
                    path={Urls().search()}
                    exact
                    render={() => <Search isLogined={isLogined} />}
                />

                {/* Collections */}
                <Route
                    path={Urls().collect()}
                    exact
                    render={() => <Collect isLogined={isLogined} />}
                />
                <Route
                    path={Urls().collections()}
                    exact
                    render={() => <Collections isLogined={isLogined} />}
                />

                {/* 404 */}
                <Route component={page404} />
            </Switch>
        </Section>

    )
}

function NoMatch({ location }) {
    return (
        <Section ExtraClass={'content singlePage'}>
            <Container>
                <Row>
                    <Col xs={12}>
                        <h3>
                            چیزی یافت نشد <code>{location.pathname}</code>
                        </h3>
                    </Col>
                </Row>
            </Container>
        </Section>
    );
}
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            SecurityManager().isLogined() ? (
                <Component {...props} />
            ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                    />
                )
        }
    />
);