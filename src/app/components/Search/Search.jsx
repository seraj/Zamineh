import React, { Suspense } from 'react';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import queryString from 'query-string';
import Urls from '../Urls'
import SearchMetaTags from './SearchMetaTags'
import { IconArrowLeft } from '../../components/Icons';
import ModelManager from '../../components/Models';
import Pagination from '../Pagination/Pagination';
import { Img } from '../../components/General';

import { Loading } from '../Spinner/Spinner';
import styles from './Search.scss'


const ResultsItem = (props) => {
    return (
        <a
            href={`${Urls().withProps(props.item.model)}${props.item.slug}`}
            className={`${styles.ResultItems} ${props.item.model}`}>

            {(props.item.model == 'artist' || props.item.model == 'category') &&
                <div className={`${styles.ResultItems}-no-thumbnail`}></div>
            }
            {(props.item.model != 'artist' && props.item.model != 'category') &&
                <div className={`${styles.ResultItems}-thumbnail`}>
                    <div className={`${styles.ResultItems}-fallback`}>
                        <Img img={props.item.img.img} width='70' height='70' divHeight='70px' divWidth='70px' />
                    </div>
                </div>
            }
            <div className={`${styles.ResultItems}-info`}>
                <div className={`${styles.ResultItems}-kind`}>{ModelManager().convertModelName(props.item.model)}</div>
                <div className={`${styles.ResultItems}-title`}>{props.item.name}</div>
                <div className={`${styles.ResultItems}-about`}>{props.item.about}</div>

                {(props.item.model == 'artist' || props.item.model == 'category') &&
                    <React.Fragment>
                        {props.item.artworks != '' &&
                            <div className={`${styles.ResultItems}-works`}>
                                {props.item.artworks.map(works => (
                                    <Img key={works.id} img={works.img} alt={works.name} />
                                ))}
                            </div>
                        }
                    </React.Fragment>
                }
            </div>
            <div className={`${styles.ResultItems}-icon`}>
                <IconArrowLeft
                    height='30px'
                    width='30px'
                    fill='transparent'
                    stroke='#333'
                />
            </div>
        </a>
    )
}
class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Results: [],
            pageCount: 0,
            selectedPage: '',
            Loading: false
        };
    }
    componentDidMount() {
        this.handleSearch()
    }

    handleSearch = (page) => {
        if (page == undefined || page == '') {
            page = 1;
        }
        axios
            .get(`${Urls().api()}/search/`, {
                params: {
                    phrase: queryString.parse(location.search)['query'],
                    page: page
                }
            })
            .then(response => {
                this.setState({
                    Results: response.data.results,
                    pageCount: response.data.page_count,
                    Loading: false
                });
            })
            .catch((response) => {
                console.log(response);
            });
    }
    handlePageClick = (data) => {

        let selected = data.selected + 1;

        this.setState({ selectedPage: selected, Loading: true }, () => {
            this.handleSearch(selected);
        });
    };
    render() {
        const parsed = queryString.parse(location.search);
        const { isLogined } = this.props;
        return (
            <React.Fragment>

                <SearchMetaTags />
                <Container>
                    <Row>
                        <Col xs='12'>
                            <div className={styles.SearchPage}>
                                {parsed['query'] != '' &&
                                    <span className='searchFor'>جستجو برای “{parsed['query']}”</span>
                                }
                                <div className={styles.searchResult}>
                                    {this.state.Loading &&
                                        <Loading text='' background='#fff' />
                                    }
                                    {this.state.Results &&
                                        this.state.Results.map(items => (
                                            <ResultsItem key={items.id} item={items} />
                                        ))}
                                </div>
                                {this.state.pageCount > 1 &&
                                    <Pagination
                                        pageCount={this.state.pageCount}
                                        onPageChange={this.handlePageClick}
                                    />
                                }

                            </div>
                        </Col>
                    </Row>
                </Container>

            </React.Fragment>
        )
    }
}
export default Search;
