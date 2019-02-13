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
import { AddCredit } from './ProfileForms'

import { LinearTabs } from '../ui-components/Tabs/Tabs'
import { Saves, Settings, Notification, Transactions, ReportBug } from './ProfileTabs'
import { Img } from '../General';

import Login from '../../login/Login';
import Urls from '../Urls';
import Section from '../Section/Section';

import NumbersConvertor from '../NumbersConvertor';
import ThousandSeparator from '../ThousandSeparator';

import DefaultStyle from '../../static/scss/_boxStyle.scss'
import styles from './Profile.scss'




function NothingRendered() {
    return (
        <Section ExtraClass={'content singlePage'}>
            <h2>nothingRendered</h2>
        </Section>
    );
}


class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: {},
            credit: {
                modal: false,
                btn: 'افزایش اعتبار',
                loading: false
            },
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


    onFollowClick = (id) => {
        console.log('not Handled!')
        // axios.post(`${Urls().api()}/follow/toggle/`, {
        //     id: id,
        //     type: 'galleries'
        // }).then((response) => {
        //     this.setState({
        //         config: {
        //             ...this.state.config,
        //             is_flw: response.data.state
        //         }
        //     });
        // })
    }
    addCreditSubmit = values => {
        this.setState({
            credit: {
                ...this.state.credit,
                loading: true
            },
        })
        axios
            .post(`${Urls().api()}/client-app/credit/charge/`, values,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                })
            .then(({ data }) => {
                console.log(data)
                this.setState({
                    credit: {
                        ...this.state.credit,
                        btn: 'در حال انتقال به بانک'
                    }
                })
                window.location.replace(data.url)

            })
            .catch(err => {
                Toast('warning', `مشکلی پیش آمده است!`);
                this.setState({
                    credit: {
                        ...this.state.credit,
                        loading: false
                    },
                })
            })
    }
    openCreditModal = value => {
        this.setState({
            credit: {
                ...this.state.credit,
                modal: value
            },
        });
    };
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
        const { config, tabs, credit } = this.state;
        const isLogined = SecurityManager().isLogined();

        return (
            <React.Fragment>
                <Section ExtraClass={'content singlePage'}>
                    <Container>
                        <Row>
                            <Col xs={12}>
                                <div className={styles.user}>
                                    {config.profile_pic !== '' ?
                                        <Img
                                            img={config.profile_pic}
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
                                            <div onClick={() => this.openCreditModal(true)} className="creditbtn">افزایش اعتبار</div>
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
                                        <LinearTabs tabs={tabs} slug={`${Urls().profile()}`} />
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

                <Modal
                    isOpen={credit.modal}
                    toggle={this.closeCreditModal}
                    title={'افزایش اعتبار'}
                >
                    <Row>
                        <Col xs={12}>
                            <AddCredit
                                loading={credit.loading}
                                btn={credit.btn}
                                handleSubmit={this.addCreditSubmit}
                            />
                        </Col>
                    </Row>
                </Modal>
            </React.Fragment>
        )
    }
}
export default withRouter(Profile);
