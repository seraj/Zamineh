import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';

import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col'; import axios from 'axios';
import queryString from 'query-string';
import Urls from '../Urls'
import ModelManager from '../Models';
import CollectionsMetaTags from './CollectionsMetaTags'
import { CollectionSet } from './CollectionSet'

import { Loading } from '../Spinner/Spinner';
import styles from './Collections.scss'


class Collections extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Results: [],
            loading: false
        };
    }
    componentDidMount() {
        this.getOffers();
    }

    getOffers = () => {
        this.setState({ loading: true });
        axios
            .get(`${Urls().api()}/collections/`)
            .then((response) => {
                this.setState({
                    loading: false,
                    Results: response.data,
                }, () => {
                    this.forceUpdate();
                });

            })
            .catch(error => {
                this.setState({ loading: false });
            });
    }


    render() {
        const parsed = queryString.parse(location.search);
        const { isLogined } = this.props;
        const { Results, loading } = this.state
        return (
            <React.Fragment>

                <CollectionsMetaTags />
                <Container>
                    <Row>
                        <Col xs={12}>
                            <div className='section_header_single'>
                                <h1>{ModelManager().convertModelName('collections')}</h1>
                                <Link to={Urls().collect()} className='view-all'>{ModelManager().convertModelName('collect')}</Link>

                            </div>

                        </Col>
                        <Col lg={12} md={12} sm={12} xs={12}>
                            <div className={styles.CollectionsPage}>
                                <div className={styles.searchResult}>

                                    {loading &&
                                        <Loading />
                                    }
                                    {Results &&
                                        <CollectionSet items={Results} />
                                    }
                                </div>


                            </div>
                        </Col>
                    </Row>
                </Container>

            </React.Fragment>
        )
    }
}
export default Collections;
