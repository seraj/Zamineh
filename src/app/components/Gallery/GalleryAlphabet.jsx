import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from "axios";
import Container from "reactstrap/lib/Container";
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import ModelManager from '../Models';
import { BackLink } from "../General"


import Urls from "../Urls";
import Section from "../Section/Section";
import styles from "./Gallery.scss"


class GalleryAlphabet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            galleries: [],
            Loading: true
        };
    }

    componentDidMount() {
        this.getArtists();

    }

    getArtists = () => {

        let url = `${Urls().api()}/galleries/alphabet/`;
        axios
            .get(url)
            .then(response => {
                this.setState({
                    galleries: response.data,
                    Loading: false
                });


            })
            .catch(error => {
                this.setState({
                    error: true
                });
            });
    }

    render() {
        const {
            match
        } = this.props;
        return (
            <React.Fragment>
                <Section ExtraClass={`${styles.GalleryAlphabet} content singlePage`}>
                    <Container>
                        <Row>

                            <Col xs={12}>
                                <div className={styles.letters}>
                                    <h1 className="center-h1">{ModelManager().convertModelName('galleries')}</h1>
                                    <BackLink
                                        Text={ModelManager().convertModelName('galleries')}
                                        pageLink={Urls().galleries()}
                                    />

                                    {this.state.galleries &&
                                        this.state.galleries.map(item => (
                                            <div className={styles.AZrow}>
                                                <div className="letter">{item.name}</div>
                                                <ul className="column">
                                                    {item.gallery_set && item.gallery_set.map(items => (
                                                        <li>
                                                            <Link key={items.id} to={`${Urls().gallery()}${items.slug}`}>{items.name}</Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))
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

export default GalleryAlphabet;
