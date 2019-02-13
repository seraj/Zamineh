import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import queryString from 'query-string';
import SecurityManager from '../../../security/SecurityManager'

import { Tabs } from '../../ui-components/Tabs/Tabs'
import { Overview, Shows, Artists, Artworks, Articles } from './section/GalleryTabs'

import Login from '../../../login/Login';
import Urls from '../../Urls';
import Section from '../../Section/Section';

import DefaultStyle from '../../../static/scss/_boxStyle.scss'
import styles from './Gallery.scss'


function NothingRendered() {
    return (
        <Section ExtraClass={'content singlePage'}>
            <h2>nothingRendered</h2>
        </Section>
    );
}


class Gallery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: {}
        }
    }
    componentDidMount() {
        this.getConfig(this.props.match.params.slug)
    }
    getConfig = (slug) => {
        axios
            .get(`${Urls().api()}/gallery/${slug}/`)
            .then(response => {
                this.setState({
                    config: response.data

                });
            })
    }

    tabComponents = (tab) => {
        var component;
        // () => this.setTabContent(tab)

        switch (tab) {
            case '/overview/':
                component = <Overview slug={this.props.match.params.slug} />;
                break;
            case '/shows/':
                component = <Shows slug={this.props.match.params.slug} />;
                break;
            case '/artists/':
                component = <Artists slug={this.props.match.params.slug} />;
                break;
            case '/arts/':
                component = <Artworks slug={this.props.match.params.slug} isLogined={SecurityManager().isLogined()} openModal={this.openModal} />;
                break;
            case '/articles/':
                component = <Articles slug={this.props.match.params.slug} />;
                break;
            default:
                component = <NothingRendered />;
        }
        return component
    }


    onFollowClick = (id) => {
        axios.post(`${Urls().api()}/follow/toggle/`, {
            id: id,
            type: 'galleries'
        }).then((response) => {
            this.setState({
                config: {
                    ...this.state.config,
                    is_flw: response.data.state
                }
            });
        })

    }
    openModal = value => {
        this.setState({
            login: value
        });
    }




    render() {
        const parsed = queryString.parse(location.search);
        const { config } = this.state;
        const isLogined = SecurityManager().isLogined();

        return (
            <React.Fragment>

                <Section ExtraClass={'content singlePage'}>
                    <Container>
                        <Row>
                            <Col xs={12}>
                                <div className={styles.header}>
                                    <div className={styles.galleryHeader}>
                                        <div className='info'>
                                            <h1 className='name'>{config.name}</h1>
                                            <span className='location'>{location.pathname}</span>
                                            <div className="follow">
                                                <button
                                                    className={`${DefaultStyle.followBtn} min ${config.is_flw ? 'following' : ''}`}
                                                    onClick={
                                                        isLogined ?
                                                            () => this.onFollowClick(config.id)
                                                            :
                                                            () => this.openModal(true)}
                                                ></button>
                                            </div>
                                        </div>
                                        <div className='icon'>
                                            <div className='img'>
                                                <img src={config.logo} alt={config.name} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Router>
                                    <React.Fragment>
                                        {config && config.tab_bars ? <Tabs tabs={config.tab_bars} slug={`${Urls().gallery()}${this.props.match.params.slug}`} /> : null}
                                        <div className={styles.content}>

                                            {config && config.tab_bars && config.tab_bars.map((tabs, index) => (
                                                <Route
                                                    key={index}
                                                    path={`${Urls().gallery()}${this.props.match.params.slug}${tabs.value}`}
                                                    render={() => this.tabComponents(tabs.value)}
                                                />
                                            ))}
                                        </div>
                                    </React.Fragment>
                                </Router>
                            </Col>
                        </Row>
                    </Container>
                </Section>
                <Login
                    hasModal
                    modalisOpen={this.state.login}
                    openModal={this.openModal}
                />
            </React.Fragment>
        )
    }
}
export default Gallery;

