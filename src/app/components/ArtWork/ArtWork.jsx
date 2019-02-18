import React from 'react'

import { BrowserRouter as Router, withRouter, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import queryString from 'query-string';
import { Toast } from '../Toast/Toast';


import SecurityManager from '../../security/SecurityManager'

import Login from '../../login/Login';
import Urls from '../Urls';
import Section from '../Section/Section';

import { SingleArtWorkMetaTag } from '../Metatags/Metatags'
import ArtCarousel from './ArtCarousel'
import NumbersConvertor from '../NumbersConvertor';
import ThousandSeparator from '../ThousandSeparator';

import { Loading } from '../Spinner/Spinner';

import DefaultStyle from '../../static/scss/_boxStyle.scss'
import styles from './ArtWork.scss'

class ArtWork extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: {},
            loading: '',
            login: false,
        }
    }
    componentDidMount() {
        this.getConfig(this.props.match.params.slug)
    }
    getConfig = (slug) => {
        axios
            .get(`${Urls().api()}/art/${slug}/`)
            .then(response => {
                this.setState({
                    config: response.data
                });
            })
    }

    onSaveItemClick = () => {
        let Art = this.state.config
        axios.post(`${Urls().api()}/art/save/toggle/`, { id: Art.id })
            .then(({ data }) => {
                Art.is_saved = data.state
                this.setState({ Art });
            })
    }
    handleBuyArtClick = () => {
        let Art = this.state.config
        axios.post(`${Urls().api()}/art/BUY/`, { id: Art.id })
            .then(({ data }) => {

            })
    }
    handleViewArtClick = () => {
        let Art = this.state.config
        axios.post(`${Urls().api()}/art/handleClick/`, { id: Art.id })
            .then(({ data }) => {

            })
    }
    openModal = value => {
        this.setState({
            login: value
        });
    }
    closeCreditModal = () => {
        this.setState({
            credit: {
                ...this.state.credit,
                modal: false
            },
        });
    };
    render() {
        const parsed = queryString.parse(location.search);
        const { config, login, loading } = this.state;
        const isLogined = SecurityManager().isLogined();

        return (
            <React.Fragment>
                <SingleArtWorkMetaTag title={config.name} slug={this.props.match.params.slug} />
                <Section ExtraClass={`content singlePage ${styles.art}`}>
                    <Container>
                        <Row>
                            <Col lg={8} md={8} sm={8} xs={12}>
                                {config && config.img_set &&
                                    <ArtCarousel
                                        items={config.img_set}
                                        openModal={this.openModal}
                                        isLogined={isLogined}
                                        isSaved={config.is_saved}
                                        onSaveItemClick={this.onSaveItemClick}
                                    />}
                            </Col>
                            <Col lg={4} md={4} sm={4} xs={12}>
                                <div className={styles.artDetails}>
                                    <h1>{config.artist ? config.artist.name : ''}</h1>
                                    <span className={DefaultStyle.MinimalfollowBtn}></span>

                                    <div className='art-details'>
                                        <span>{config.name}</span>
                                        {config.detail &&
                                            <>
                                                <span>{config.detail.material}</span>
                                                <span>{NumbersConvertor().convertToPersian(config.detail.width)} × {NumbersConvertor().convertToPersian(config.detail.height)} × {NumbersConvertor().convertToPersian(config.detail.depth)} {config.detail.unit}</span>

                                                <span className="sp">{config.detail.quote}</span>
                                            </>
                                        }
                                    </div>
                                    <hr />
                                    {config.is_in_gallery ?
                                        <div className={styles.buySection}>
                                            {config.price && config.price.is_for_sale ?
                                                <>
                                                    {!config.price.is_sold ?
                                                        <>
                                                            <h2>برای خرید تماس بگیرید</h2>
                                                            <Link
                                                                to={`${Urls().gallery()}${config.gallery.slug}/contact/`}
                                                                style={{ width: '100%', marginBottom: 10 }}
                                                                className={`zbtn next black bradius`}
                                                            >
                                                                تماس با گالری <i className='fas fa-phone' />
                                                            </Link>
                                                            {config.gallery &&
                                                                <div className="gallery">
                                                                    <Link to={`${Urls().gallery()}${config.gallery.slug}`}>
                                                                        <div className="name">{config.gallery.name}</div>
                                                                    </Link>
                                                                </div>
                                                            }
                                                        </>
                                                        : null
                                                    }
                                                </>
                                                : null
                                            }
                                        </div>
                                        :
                                        <>
                                            <div className={styles.buySection}>
                                                {config.price && config.price.is_for_sale ?
                                                    <>
                                                        {!config.price.is_sold ?
                                                            <>
                                                                <h2>{NumbersConvertor().convertToPersian(ThousandSeparator(config.price.price))} تومان</h2>
                                                                <button
                                                                    onClick={() => this.handleBuyArtClick()}
                                                                    style={{ width: '100%', marginBottom: 10 }}
                                                                    className={`zbtn next black bradius`}
                                                                >
                                                                    خرید اثر <i class="fal fa-shopping-cart" />
                                                                </button>
                                                                <button
                                                                    onClick={() => this.handleViewArtClick()}
                                                                    style={{ width: '100%', marginBottom: 10 }}
                                                                    className={`zbtn next white bradius`}
                                                                >
                                                                    بازدید از اثر
                                                                </button>
                                                            </>
                                                            :
                                                            <button
                                                                disabled
                                                                style={{ width: '100%', marginBottom: 10 }}
                                                                className={`zbtn next white bradius`}
                                                            >
                                                                اثر فروخته شده
                                                            </button>
                                                        }
                                                    </>
                                                    : null
                                                }
                                            </div>
                                        </>
                                    }

                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Section>

                <Login
                    hasModal
                    modalisOpen={login}
                    openModal={this.openModal}
                />
            </React.Fragment>
        )
    }
}
export default withRouter(ArtWork);
