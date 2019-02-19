import React from 'react'

import { withRouter, Link } from 'react-router-dom';
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
import ArtOtherWork from './ArtOtherWork'
import NumbersConvertor from '../NumbersConvertor';
import ThousandSeparator from '../ThousandSeparator';
import AboutSection from '../ui-components/AboutSection'
import { Loading } from '../Spinner/Spinner';

import DefaultStyle from '../../static/scss/_boxStyle.scss'
import styles from './ArtWork.scss'

class ArtWork extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: {},
            artItems: {},
            loading: '',
            login: false,
        }
    }
    componentDidMount() {
        this.getConfig(this.props.match.params.slug)
        this.getArtItems(this.props.match.params.slug)
    }
    getConfig = (slug) => {
        axios
            .get(`${Urls().api()}/art/${slug}/`)
            .then(({ data }) => {
                this.setState({
                    config: data
                });
            })
    }
    getArtItems = (slug) => {
        axios
            .get(`${Urls().api()}/art/${slug}/recommendations/`)
            .then(({ data }) => {
                this.setState({
                    artItems: data
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
    onFollowClick = (id, type) => {
        const Type = type === 'artist' ? 'artists' : 'galleries';
        let Config = this.state.config[type]
        axios.post(`${Urls().api()}/follow/toggle/`, {
            id: id,
            type: Type
        },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        ).then(({ data }) => {
            Config.is_flw = data.state
            this.setState({
                ...this.state.config,
                Config
            });
        })
    }
    onRelatedArtistFollowClick = (id, index) => {
        let items = this.state.artItems.related_artist
        axios.post(`${Urls().api()}/follow/toggle/`, {
            id: id,
            type: 'artists'
        },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        ).then(({ data }) => {
            items[index].is_flw = data.state
            this.setState({
                ...this.state.artItems,
                items
            });
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
    render() {
        const parsed = queryString.parse(location.search);
        const { config, login, loading, artItems } = this.state;
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
                                    {config.artist &&
                                        <>
                                            <h1>{config.artist ? config.artist.name : ''}</h1>
                                            <span
                                                onClick={isLogined ? () => this.onFollowClick(config.artist.id, 'artist') : () => this.openModal(true)}
                                                className={`${DefaultStyle.MinimalfollowBtn} ${config.artist.is_flw ? 'following' : null}`}
                                            />
                                        </>
                                    }

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

                            <Col lg={8} md={8} sm={8} xs={12}>
                                <hr />
                                <div className={styles.ArtBio}>
                                    {config.gallery != null &&
                                        <AboutSection
                                            img={config.gallery.logo}
                                            title={config.gallery.name}
                                            underTitle={'تهران'}
                                            context={config.gallery.about}
                                            type={'artist'}
                                            follow={config.gallery}
                                            handleLogin={isLogined}
                                            onFollowClick={() => this.onFollowClick(config.gallery.id, 'gallery')}
                                            openModal={() => this.openModal(true)}
                                            url={`${Urls().gallery()}${config.gallery.slug}/overview/`}
                                        />
                                    }
                                    {config.artist &&
                                        <AboutSection
                                            img={config.artist.profile_pic}
                                            title={config.artist.name}
                                            underTitle={config.artist.detail}
                                            context={config.artist.bio}
                                            type={'artist'}
                                            follow={config.artist}
                                            handleLogin={isLogined}
                                            onFollowClick={() => this.onFollowClick(config.artist.id, 'artist')}
                                            openModal={() => this.openModal(true)}
                                            url={`${Urls().artist()}${config.artist.slug}/overview/`}
                                        />
                                    }
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            {artItems !== '' &&
                                <ArtOtherWork
                                    items={artItems}
                                    config={config}
                                    handleLogin={isLogined}
                                    onFollowClick={this.onRelatedArtistFollowClick}
                                />
                            }

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
