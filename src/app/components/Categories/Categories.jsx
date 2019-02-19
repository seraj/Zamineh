import React from 'react';
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
                        <Col xs={12}>
                            {config.category &&
                                <>
                                    <div className='section_header_single'>
                                        <h1>{config.category.name}</h1>
                                    </div>
                                    <div className="about">{config.category.about}</div>
                                </>
                            }


                        </Col>
                        <Col xs={12}>
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
