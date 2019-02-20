import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip';
import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import axios from 'axios';
import SecurityManager from '../../security/SecurityManager'

import Urls from '../Urls'
import CategoriesArts from './CategoriesArts';

import FollowButton from '../ui-components/FollowButton'
import { SingleCategoryMetaTag } from '../Metatags/Metatags'

import styles from './Categories.scss'

const isLogined = SecurityManager().isLogined();


class Categories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: [],
            FormLoading: true,
            loading: false,
            login: false
        };
    }
    componentDidMount() {
        this.getPageConfig(this.props.match.params.slug);
    }

    getPageConfig = (slug) => {
        axios.get(`${Urls().api()}/gene/${slug}/`)
            .then(response => {
                this.setState({
                    config: response.data,
                    FormLoading: false
                });
            })
    }


    collectFormRef = (form) => {
        this.form = form;
        // console.log(form)
    }




    render() {
        const { config } = this.state;
        return (
            <>

                <SingleCategoryMetaTag title={config.category ? config.name : ''} slug={this.props.match.params.slug} />
                <Container>
                    <Row>
                        {config.category &&
                            <>
                                <Col xs={12}>
                                    <>
                                        <div className={styles.Header}>
                                            <h1>{config.category.name}</h1>
                                            <FollowButton id={config.category.id} type='cats' isFollowed={config.category.is_flw} />
                                            <div className="share">
                                                <UncontrolledTooltip placement="bottom" target="mail">ایمیل کن</UncontrolledTooltip>
                                                <UncontrolledTooltip placement="bottom" target="facebook">به اشتراک گذاشتن در فیسبوک</UncontrolledTooltip>
                                                <UncontrolledTooltip placement="bottom" target="twitter">به اشتراک گذاشتن در تویتر</UncontrolledTooltip>

                                                <a id='mail' href={`mailto:?subject=${config.category && config.category.name}&body=این رو نگاه بنداز "${config.category && config.category.name}" آدرس :"${Urls().client()}${Urls().gene()}${config.category && config.category.slug}"`}>
                                                    <i className='zicon icon-10'></i>
                                                </a>

                                                <a id='facebook' href={`https://www.facebook.com/sharer/sharer.php?u=${Urls().client()}${Urls().gene()}${config.category && config.category.slug}`} target='_blank'>
                                                    <i className='zicon icon-11'></i>
                                                </a>
                                                <a id='twitter' href={`https://twitter.com/intent/tweet?&url=${Urls().client()}${Urls().gene()}${config.category && config.category.slug}`} target='_blank'>
                                                    <i className='zicon icon-13'></i>
                                                </a>
                                            </div>
                                        </div>
                                    </>
                                </Col>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <div className={styles.categorySection}>
                                        <span className="title">درباره</span>
                                        <div className="about">{config.category.about}</div>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    {config.related_cats && config.related_cats.length > 0 &&
                                        <div className={styles.categorySection}>
                                            <span className="title">دسته بندی‌های مشابه</span>
                                            <div className="links">
                                                {config.related_cats.map((items, index) => (
                                                    <><a key={index} href={`${Urls().gene()}${items.slug}`}>{items.name}</a>, </>
                                                ))}
                                            </div>
                                        </div>
                                    }
                                    {config.related_artists && config.related_artists.length > 0 &&
                                        <div className={styles.categorySection} style={{ marginTop: 30 }}>
                                            <span className="title">هنرمندان</span>
                                            <div className="links">
                                                {config.related_artists.map((items, index) => (
                                                    <><a key={index} href={`${Urls().gene()}${items.slug}`}>{items.name}</a>, </>
                                                ))}
                                            </div>
                                        </div>
                                    }
                                </Col>
                            </>
                        }
                        <Col xs={12} style={{ marginTop: 50 }}>
                            {config.category &&
                                <CategoriesArts slug={config.category.slug} />
                            }
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}
export default withRouter(Categories);
