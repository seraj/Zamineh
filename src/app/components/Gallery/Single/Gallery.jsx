import React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from "axios";
import Container from "reactstrap/lib/Container";
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import queryString from 'query-string';


import Login from "../../../login/Login";
import Urls from "../../Urls";
import Section from "../../Section/Section";

import styles from "./Gallery.scss"



function shows() {
    return (
        <Section ExtraClass={'content singlePage'}>
            <h2>shows</h2>
        </Section>
    );
}

function works() {
    return (
        <Section ExtraClass={'content singlePage'}>
            <h2>works</h2>
        </Section>
    );
}
function nothingRendered() {
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
            tabs: [
                { slug: 'shows', label: 'نمایشگاه' },
                { slug: 'works', label: 'تست' },
                { slug: 'ss', label: 'سراج' },
                { slug: 'bb', label: 'قاسم' },
                { slug: 'seraj', label: 'علی' },
            ]
        }
    }
    componentDidMount() {

    }

    tabComponents = (slug) => {
        var component;
        switch (slug) {
            case "shows":
                component = shows;
                break;
            case "works":
                component = works;
                break;
            default:
                component = nothingRendered;
        }
        return component
    }

    render() {
        const parsed = queryString.parse(location.search);
        return (
            <React.Fragment>

                <Section ExtraClass={'content singlePage'}>
                    <Container>
                        <Row>
                            <Col xs={12}>
                                <div className={styles.header}>
                                    <div className={styles.galleryHeader}>
                                        <div className="info">
                                            <h1 className="name">{this.props.match.params.slug} </h1>
                                            <span className="location">{location.pathname}</span>
                                        </div>
                                        <div className="icon">
                                            <div className="img">
                                                <img src="https://d32dm0rphc51dk.cloudfront.net/LuKVGRd8rMcdk3OXvazA3w/square140.png" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Router>
                                    <React.Fragment>
                                        <nav className={styles.tabs}>
                                            {this.state.tabs && this.state.tabs.map((tabs, index) => (
                                                <React.Fragment>
                                                    <Link key={index} to={`${Urls().gallery()}${this.props.match.params.slug}/${tabs.slug}`}>{tabs.label}</Link>
                                                    <div className={styles.separator} />
                                                </React.Fragment>
                                            ))}
                                        </nav>

                                        <div className="content">

                                            {this.state.tabs && this.state.tabs.map((tabs, index) => (

                                                <Route
                                                    key={index}
                                                    path={`${Urls().gallery()}${this.props.match.params.slug}/${tabs.slug}`}
                                                    component={this.tabComponents(tabs.slug)}
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
export default Gallery;

