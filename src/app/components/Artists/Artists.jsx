import React, { Component } from 'react';
import axios from 'axios';

// import Loadable from 'react-loadable';
// import ContentLoader from 'react-content-loader'

import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';

import ModelManager from '../Models';

import AlphabetSet from './AlphabetSet'
import Login from '../../login/Login';
import { FeatureArtist, TopArtists } from './SingleArtist';
import Error from '..//Error';
import Urls from '../Urls';

// const TopArtists = Loadable({
//     loader: () => import('./SingleArtist').then(module => module.TopArtists),
//     loading: Loading
//   });

class Artists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artist: [],
            error: false,
            login: false
        };
    }

    componentDidMount() {

        let mode = (this.props.mode);
        let url = `${Urls().api()}/artists/?count=4`;
        axios
            .get(url)
            .then(response => {
                this.setState({
                    artist: response.data
                });


            })
            .catch(error => {
                this.setState({
                    error: true
                });
            });
    }
    onTabClick = (value) => {
        this.setState({ currentTab: value })
    }
    openModal = value => {
        this.setState({
            login: value
        });
    }


    render() {
        let params = new URLSearchParams(location.search);

        return (
            <React.Fragment>
                <Container>
                    <Row>
                        <Col xs={12}>
                            <div className='section_header_single'>
                                <h1>{ModelManager().convertModelName('artists')}</h1>

                            </div>
                        </Col>
                    </Row>
                    <AlphabetSet />
                    <TopArtists
                        title='هنرمندان بولد'
                        item={this.state.artist.featured_artists}
                        onFollowClick={this.onFollowClick}
                        openModal={this.openModal}
                        handleLogin={this.props.isLogined}
                    />

                    <FeatureArtist
                        item={this.state.artist.genre_set}
                        onFollowClick={this.onFollowClick}
                        openModal={this.openModal}
                        handleLogin={this.props.isLogined}
                    />
                </Container>

                <Login
                    hasModal
                    modalisOpen={this.state.login}
                    openModal={this.openModal}
                />
            </React.Fragment >
        );
    }
}

export default Artists;