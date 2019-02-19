import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import SecurityManager from '../../security/SecurityManager'

import Urls from '../Urls'
import CategoriesArts from './CategoriesArts';


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
            <React.Fragment>

                <SingleCategoryMetaTag title={config.show ? config.name : ''} slug={this.props.match.params.slug} />
                <Container>
                    <Row>
                        {config.category &&
                            <>
                                <Col xs={12}>
                                    <>
                                        <div className={styles.Header}>
                                            <h1>{config.category.name}</h1>
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
                                    <div className={styles.categorySection}>
                                        <span className="title">دسته بندی‌های مشابه</span>
                                        <div className="links">
                                            {config.related_cats &&
                                                config.related_cats.map((items, index) => (
                                                    <><Link key={index} to={`${Urls().gene()}${items.slug}`}>{items.name}</Link>, </>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className={styles.categorySection} style={{ marginTop: 30 }}>
                                        <span className="title">هنرمندان</span>
                                        <div className="links">
                                            {config.related_artists &&
                                                config.related_artists.map((items, index) => (
                                                    <><Link key={index} to={`${Urls().gene()}${items.slug}`}>{items.name}</Link>, </>
                                                ))
                                            }
                                        </div>
                                    </div>
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
            </React.Fragment>
        )
    }
}
export default Categories;
