import React from 'react'

import { BrowserRouter as Router, withRouter, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import queryString from 'query-string';
import { Toast } from '../Toast/Toast';


import SecurityManager from '../../security/SecurityManager'
import Modal from '../ui-components/Modal/Modal'

import { LinearTabs } from '../ui-components/Tabs/Tabs'
import { Overview, Shows, CV } from './ArtistTab'
import { TopWorks } from './SingleArtist';

import Login from '../../login/Login';
import Urls from '../Urls';
import Section from '../Section/Section';

import { SingleArtistMetaTag } from './ArtistMetaTags'
import NumbersConvertor from '../NumbersConvertor';
import ThousandSeparator from '../ThousandSeparator';

import { Loading } from '../Spinner/Spinner';

import DefaultStyle from '../../static/scss/_boxStyle.scss'
import styles from './Artists.scss'




function NothingRendered() {
    return (
        <Section ExtraClass={'content singlePage'}>
            <h2>nothingRendered</h2>
        </Section>
    );
}


class Artist extends React.Component {
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
            .get(`${Urls().api()}/artist/${slug}/`)
            .then(response => {
                this.setState({
                    config: response.data
                });
            })
    }

    tabComponents = (tab) => {
        var component;
        switch (tab) {
            case '/overview/':
                component = <Overview type='overview' slug={this.props.match.params.slug} />;
                break;
            case '/cv/':
                component = <CV type='cv-solo' slug={this.props.match.params.slug} />;
                break;
            case '/articles/':
                component = <Overview type='articles' slug={this.props.match.params.slug} />;
                break;
            case '/shows/':
                component = <Overview type='shows' slug={this.props.match.params.slug} />;
                break;
            case '/related-artists/':
                component = <Overview type='related-artists' slug={this.props.match.params.slug} />;
                break;
            default:
                component = <NothingRendered />;
        }
        return component
    }


    onFollowClick = (id) => {
        axios.post(`${Urls().api()}/follow/toggle/`, {
            id: id,
            type: 'artists'
        }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        ).then((response) => {
            this.setState({
                config: {
                    ...this.state.config,
                    follow: {
                        is_flw: response.data.state,
                        count: response.data.count
                    }
                }
            });
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
                <SingleArtistMetaTag title={config.name} slug={this.props.match.params.slug} />
                <Section ExtraClass={'content singlePage'}>
                    <Container>
                        <Row>
                            <Col xs={12}>
                                <TopWorks item={config.art_set} />
                                <div className={styles.ArtistHeader}>

                                    <div className="info">
                                        <h1>{config.name}</h1>
                                        <span>
                                            <h2 style={{ marginLeft: 20, fontSize: 17, display: 'inline' }}>{config.detail}</h2>
                                            <div style={{ fontSize: 17, display: 'inline' }}> {(config.follow && config.follow.count > 0) ? `${NumbersConvertor().convertToPersian(config.follow.count)} دنبال کننده` : null}</div>
                                        </span>
                                    </div>
                                    <div className="follow">
                                        <button
                                            className={`${DefaultStyle.followBtn} min ${config.follow && config.follow.is_flw ? 'following' : ''}`}
                                            onClick={
                                                isLogined ?
                                                    () => this.onFollowClick(config.id)
                                                    :
                                                    () => this.openModal(true)}
                                        ></button>
                                    </div>

                                </div>
                                <React.Fragment>
                                    <LinearTabs tabs={config.tab_bars} slug={`${Urls().artist()}${this.props.match.params.slug}`} />
                                    <div className='clearfix' />
                                    <div className={styles.content}>

                                        {config.tab_bars && config.tab_bars.map((tabs, index) => (
                                            <Route
                                                key={index}
                                                path={`${Urls().artist()}${this.props.match.params.slug}${tabs.value}`}
                                                render={() => this.tabComponents(tabs.value)}
                                            />
                                        ))}
                                    </div>
                                </React.Fragment>
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
export default withRouter(Artist);
