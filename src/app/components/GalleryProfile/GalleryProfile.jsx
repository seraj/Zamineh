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
import { Tabz, Settings, Notification, Transactions, ReportBug } from './GalleryProfileTabs'
import { Img } from '../General';

import Urls from '../Urls';
import Section from '../Section/Section';

import NumbersConvertor from '../NumbersConvertor';
import ThousandSeparator from '../ThousandSeparator';

import DefaultStyle from '../../static/scss/_boxStyle.scss'
import styles from './GalleryProfile.scss'




function NothingRendered() {
    return (
        <Section ExtraClass={'content singlePage'}>
            <h2>nothingRendered</h2>
        </Section>
    );
}


class GalleryProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: [],
            tabs: [
                {
                    title: 'آثار',
                    value: 'arts'
                },
                {
                    title: 'هنرمندان',
                    value: 'artists'
                },
                {
                    title: 'نمایشگاه‌ها',
                    value: 'shows'
                },
                {
                    title: 'تنظیمات',
                    value: 'settings'
                },
                {
                    title: 'رخدادها',
                    value: 'notification'
                },
                {
                    title: 'تراکنش‌ها',
                    value: 'transactions'
                },
                {
                    title: 'گزارش باگ',
                    value: 'report'
                }
            ]
        }
    }
    componentDidMount() {
        this.getConfig()
    }
    getConfig = (slug) => {
        axios
            .get(`${Urls().api()}/gallery-app/panel/`)
            .then(response => {
                this.setState({
                    config: response.data
                });
            })
    }

    tabComponents = (tab) => {
        var component;
        switch (tab) {
            case 'arts':
                component = <Tabz type='art' />;
                break;
            case 'artists':
                component = <Tabz type='artist' />;
                break;
            case 'shows':
                component = <Tabz type='show' />;
                break;
            case 'settings':
                component = <Settings Config={this.state.config} />;
                break;
            case 'notification':
                component = <Notification />;
                break;
            case 'transactions':
                component = <Transactions />;
                break;
            case 'report':
                component = <ReportBug />;
                break;
            default:
                component = <NothingRendered />;
        }
        return component
    }


    render() {
        const parsed = queryString.parse(location.search);
        const { config, tabs } = this.state;

        return (
            <React.Fragment>
                <Section ExtraClass={'content singlePage'}>
                    <Container>
                        <Row>
                            <Col xs={12}>
                                <div className={styles.user}>
                                    {config.logo && config.logo !== '' ?
                                        <Img
                                            img={config.logo}
                                            alt={config.name}
                                            width={100}
                                            style={{
                                                minWidth: 50
                                            }}
                                        />
                                        :
                                        <img src='/static/img/avatar.png' alt={config.name} />
                                    }
                                    <div className="detail">
                                        <div className="info">
                                            <h1>{config.name}</h1>
                                        </div>
                                        {config.saved_art_count !== 0 &&
                                            <span>{NumbersConvertor().convertToPersian(config.saved_art_count)} اثر ذخیره شده دارید, </span>
                                        }
                                        {config.artist_follow_count !== 0 &&
                                            <span>{NumbersConvertor().convertToPersian(config.artist_follow_count)} هنرمند دنبال میکنید, </span>
                                        }
                                        {config.medium_follow_count !== 0 &&
                                            <span>{NumbersConvertor().convertToPersian(config.medium_follow_count)} بستر دنبال میکنید, </span>
                                        }
                                        {config.genre_follow_count !== 0 &&
                                            <span>{NumbersConvertor().convertToPersian(config.genre_follow_count)} ژانر دنبال میکنید, </span>
                                        }
                                    </div>

                                </div>
                                <Router>
                                    <React.Fragment>
                                        <LinearTabs tabs={tabs} slug={`${Urls().GalleryDashboard()}`} />
                                        <div className={styles.content}>

                                            {tabs && tabs.map((tabs, index) => (
                                                <Route
                                                    key={index}
                                                    path={`${Urls().GalleryDashboard()}${tabs.value}`}
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

            </React.Fragment>
        )
    }
}
export default withRouter(GalleryProfile);
