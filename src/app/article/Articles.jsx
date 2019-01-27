
import React from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import { Container, Row, Col } from 'reactstrap';
import { Route, Switch, withRouter } from 'react-router-dom'
import queryString from 'query-string';
import Urls from '../components/Urls';
import Section from '../components/Section/Section';

import ArticleMetaTags from './ArticleMetaTags';
import { LimitContent } from '../components/General';

class Article extends React.Component {
    render() {
        return (
            <div className='items'>
                <Row>
                    <Col lg='2' md='2' sm='12' xs='12'>
                        <a href={this.props.link}>
                            <div className='cover'>
                                <img src={this.props.cover} alt={this.props.cover_title} />
                            </div>
                        </a>
                    </Col>
                    <Col lg='9' md='7' sm='12' xs='12'>
                        <div className='content'>

                            <h2><a href={this.props.link}>{this.props.title}</a></h2>
                            <p>
                                {LimitContent(this.props.content, this.props.Contentlimit)}
                            </p>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}
class Articles extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            articles: []
        }
    }

    componentDidMount() {
        this.GetArticles();
    }
    GetArticles = () => {

        axios.get(`${Urls().api()}/mag/list/`)
            .then((response) => {
                this.setState({
                    articles: response.data
                })
            })
            .catch((response) => {
                console.log(response);
            });
    }
    render() {


        /**
          * 
          * 
          * @description Article Component | check if it's single or all articles
          * use it to determine stepper level
          * 
          * @memberOf Articles
          */
        var url = window.location.href;
        const parsed = queryString.parse(this.props.location.search);

        return (
            <React.Fragment>

                <ArticleMetaTags></ArticleMetaTags>
                <Section ExtraClass={'content singlePage'}>
                    <Container>
                        <Row>
                            <Col xs='12'>
                                <div className='magzine singlePage'>
                                    {this.state.articles.article_set &&
                                        this
                                            .state
                                            .articles
                                            .article_set
                                            .map((item, index) => (
                                                <Article
                                                    key={index}
                                                    title={item.name}
                                                    link={item.slug}
                                                    content={item.lead}
                                                    cover={item.img}
                                                    cover_title={item.img_title}
                                                    Contentlimit={1300}
                                                />
                                            ))}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Section>

            </React.Fragment>

        )
    }
}

export default withRouter(Articles);
