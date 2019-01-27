import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import ModelManager from '../Models';
import Pagination from '../Pagination/Pagination';
import { BackLink } from '../General'

import AlphabetSet from './AlphabetSet'

import Urls from '..//Urls';
import Section from '../Section/Section';
import styles from './Artists.scss'


class ArtistAlphabet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artist: [],
            selectedPage: '',
            Loading: false
        };
    }

    componentDidMount() {
        this.getArtists();

    }

    getArtists = (page) => {
        if (page == undefined || page == '') {
            page = 1;
        }
        let url = `${Urls().api()}/artists/alphabet/?letter=${this.props.match.params.artistChar}&page=${page}`;
        axios
            .get(url)
            .then(response => {
                this.setState({
                    artist: response.data.artist_set,
                    pageCount: response.data.page_count,
                    Loading: false
                });


            })
            .catch(error => {
                this.setState({
                    error: true
                });
            });
    }
    handlePageClick = (data) => {

        let selected = data.selected + 1;
        this.setState({ selectedPage: selected, Loading: true }, () => {
            this.handleSearch(selected);
        });
    };
    render() {
        const {
            match
        } = this.props;
        return (
            <React.Fragment>
                <Section ExtraClass={`${styles.ArtistAlphabet} content singlePage`}>
                    <Container>
                        <Row>
                            <Col xs={12}>
                                <AlphabetSet word={match.params.artistChar} />
                            </Col>
                            <Col xs={12}>
                                <div className={styles.letters}>
                                    <h1 className='center-h1'>{ModelManager().convertModelName('artists')} - {match.params.artistChar}</h1>
                                    <BackLink
                                        Text={ModelManager().convertModelName('artists')}
                                        pageLink={Urls().artists()}
                                    />

                                    <div className={styles.artistsColumns}>
                                        {this.state.artist &&
                                            this.state.artist.map(item => (
                                                <Link key={item.id} to={`${Urls().artist()}${item.slug}`}>{item.name}</Link>
                                            ))}
                                    </div>
                                    {this.state.pageCount > 1 &&
                                        <Pagination
                                            pageCount={this.state.pageCount}
                                            onPageChange={this.handlePageClick}
                                        />
                                    }
                                </div>
                            </Col>
                        </Row>
                    </Container>

                </Section>
            </React.Fragment >
        );
    }
}

export default ArtistAlphabet;
