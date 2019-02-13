import React from 'react'

import { BrowserRouter as Router, withRouter, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import queryString from 'query-string';
import SecurityManager from '../../security/SecurityManager'
import { LinearTabs } from '../ui-components/Tabs/Tabs'
import { Saves, Settings, ReportBug } from './GalleryProfile'

import Login from '../../login/Login';
import Urls from '../Urls';
import Section from '../Section/Section';

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
            config: {},
            tabs: [
                {
                    title: 'ذخیره شده‌ها',
                    value: 'saves'
                },
                {
                    title: 'تنظیمات',
                    value: 'settings'
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
            .get(`${Urls().api()}/client-app/client/profile/`)
            .then(response => {
                this.setState({
                    config: response.data
                });
            })
    }

    tabComponents = (tab) => {
        var component;
        switch (tab) {
            case 'saves':
                component = <Saves />;
                break;
            case 'settings':
                component = <Settings />;
                break;
            case 'report':
                component = <ReportBug />;
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
        const { config, tabs } = this.state;
        const isLogined = SecurityManager().isLogined();

        return (
            <React.Fragment>

                <Section ExtraClass={'content singlePage'}>
                    <Container>
                        <Row>
                            <Col xs={12}>
                                <div className='section_header_single'>
                                    <h1>{config.name}</h1>
                                </div>

                                <Router>
                                    <React.Fragment>
                                        {tabs ? <LinearTabs tabs={tabs} slug={`${Urls().profile()}`} /> : null}
                                        <div className={styles.content}>

                                            {tabs && tabs.map((tabs, index) => (
                                                <Route
                                                    key={index}
                                                    path={`${Urls().profile()}${tabs.value}`}
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
export default withRouter(GalleryProfile);
