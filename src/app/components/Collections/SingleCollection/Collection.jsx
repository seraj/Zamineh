import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import queryString from 'query-string';
import SecurityManager from '../../../security/SecurityManager'
import Login from '../../../login/Login';

import Urls from '../../Urls'
import { CustomInput, Form, FormGroup, Label } from 'reactstrap';
import { Filters, InputSlider, FilterBox } from '../../Filters/Filters';

import NumbersConvertor from '../../NumbersConvertor';
import ModelManager from '../../Models';

import { SingleCollectionMetaTag } from '../../Metatags/Metatags'
import Pagination from '../../Pagination/Pagination';
import { Loading } from '../../Spinner/Spinner';
import { ThreeColumnArt } from '../../ArtArtist/Arts';



import styles from './Collection.scss'

const isLogined = SecurityManager().isLogined();


class Collection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Results: [],
            priceRange: {},
            FilterInfo: {
                'medium': null,
                'sort': 'recently_updated',
                'min_price': null,
                'max_price': null,
                'year': null,
                'collection_id': this.props.match.params.slug

            },
            config: [],
            pageCount: 0,
            selectedPage: '',
            FormLoading: true,
            loading: false,
            login: false
        };
    }
    componentDidMount() {
        this.getPageConfig(this.props.match.params.slug);
        this.getOffers(this.state.FilterInfo);
    }

    getPageConfig = (slug) => {
        axios.get(`${Urls().api()}/collection/${this.props.match.params.slug}/`)
            .then(response => {
                this.setState({
                    config: response.data,
                    priceRange: { max: response.data.max_price, min: response.data.min_price },
                    FormLoading: false
                });
            })
    }
    handleSubmit = (event) => {
        event.preventDefault();
        console.log(event.target.value)
    }

    handlePageClick = (data) => {

        let selected = data.selected + 1;
        console.log(selected)

        this.setState({
            selectedPage: selected,
            loading: true,
            FilterInfo: {
                ...this.state.FilterInfo,
                page: selected
            }
        }, () => {
            this.getOffers(this.state.FilterInfo);
        });
    };
    handleFormChange = (e, name) => {
        const value = e.target.value;
        console.log(name, value)

        this.setState({
            loading: true,
            FilterInfo: {
                ...this.state.FilterInfo,
                [name]: value
            }
        }, () => {
            this.getOffers(this.state.FilterInfo);
        });
        // console.log(this.state.FilterInfo)
    }
    handleSliderChange = (value, completed) => {

        if (!completed) {
            this.setState({ priceRange: value })
        } else {


            const values = { min_price: value.min, max_price: value.max };
            console.log(values)

            this.setState({
                Loading: true,
                FilterInfo: {
                    ...this.state.FilterInfo,
                    min_price: value.min,
                    max_price: value.max
                }
            }, () => {
                this.getOffers(this.state.FilterInfo);
            });
            // console.log(this.state.FilterInfo)
        }
    }
    getOffers = (params) => {
        this.setState({ loading: true });
        // console.log('params', params)
        axios
            .get(`${Urls().api()}/collect/`, { params: params })
            .then((response) => {
                this.setState({
                    loading: false,
                    pageCount: response.data.page_count,
                    Results: response.data.results,
                }, () => {
                    this.forceUpdate();
                });

            })
            .catch(error => {
                this.setState({ loading: false });
            });
    }


    openModal = value => {
        this.setState({
            login: value
        });
    };

    onSaveItemClick = (index) => {
        var Arts = this.state.Results;

        Arts[index].save_loading = true;

        axios.post(`${Urls().api()}/art/save/toggle/`, { id: Arts[index].id }).then((response) => {

            if (response.data.state) {
                Arts[index].is_saved = true;
                Arts[index].save_loading = false;

                this.setState({ Arts });

            } else {
                Arts[index].is_saved = false;
                Arts[index].save_loading = false;

                this.setState({ Arts });
            }

        })
            .catch(error => {
                Arts[index].save_loading = false;

            });
    }




    collectFormRef = (form) => {
        this.form = form;
        // console.log(form)
    }




    renderItems() {
        var Arts = this.state.Results;
        if (!this.state.error) {

            return (
                <ThreeColumnArt
                    Arts={Arts}
                    onSaveItemClick={this.onSaveItemClick}
                    openModal={this.openModal}
                    isLogined={isLogined}
                />
            );

        } else {
            return <Error />;
        }
    }


    render() {
        const parsed = queryString.parse(location.search);
        const { isLogined } = this.props;
        const { FormLoading, loading, pageCount, priceRange, config } = this.state;
        return (
            <React.Fragment>

                <SingleCollectionMetaTag title={config.show ? config.name : ''} slug={this.props.match.params.slug} />
                <Container>
                    <Row>
                        <Col xs={12}>
                            {config.collection &&
                                <div className={styles.collectionHeader}>
                                    <div className={styles.cover}
                                        style={{
                                            background: `url(${config.collection.cover}) center center / cover rgb(194, 194, 194)`
                                        }}>
                                        <div className='bg' />
                                        <div className='section_header_single'>
                                            <h1>{config.collection.name}</h1>
                                            <Link to={Urls().collect()} className='view-all'>دیدن تمام آثار</Link>
                                        </div>
                                    </div>
                                    <div className="about">{config.collection.about}</div>
                                </div>
                            }

                        </Col>
                        <Col lg={3} md={2} sm={12} xs={12}>
                            <Filters>
                                <Form ref={this.collectFormRef}>
                                    {FormLoading &&
                                        <Loading text='' />
                                    }
                                    <FilterBox
                                        title={ModelManager().convertModelName('medium')}
                                        name='medium'
                                    >
                                        {config && config.mediums &&
                                            <React.Fragment>
                                                {config.mediums.map((item, index) => (
                                                    <CustomInput
                                                        key={index}
                                                        onChange={e => this.handleFormChange(e, 'medium')}
                                                        value={item.id}
                                                        type='radio'
                                                        id={item.id}
                                                        name='medium'
                                                        label={item.name}
                                                    />
                                                ))}
                                            </React.Fragment>
                                        }
                                    </FilterBox>

                                    <FilterBox
                                        title='قیمت'
                                        name='priceRange'
                                    >
                                        <InputSlider
                                            max={priceRange.max}
                                            min={priceRange.min}
                                            unit='تومان'
                                            handleSliderChange={this.handleSliderChange}
                                            value={priceRange}
                                            maxValue={config.max_price}
                                            minValue={config.min_price}
                                        />

                                    </FilterBox>

                                    <FilterBox
                                        title='بازه زمانی'
                                        name='years'
                                    >
                                        {config && config.years &&
                                            <React.Fragment>
                                                {config.years.map((item, index) => (
                                                    <CustomInput
                                                        key={index}
                                                        onChange={e => this.handleFormChange(e, 'year')}
                                                        value={item.value}
                                                        type='radio'
                                                        name='year'
                                                        id={item.value}
                                                        label={NumbersConvertor().convertToPersian(item.title)}
                                                    />
                                                ))}
                                            </React.Fragment>
                                        }
                                    </FilterBox>
                                </Form>
                            </Filters>
                        </Col>
                        <Col lg={9} md={10} sm={12} xs={12}>
                            <div className={styles.CollectPage}>
                                {config && config.years &&
                                    <Form inline className='simpleSelect alignEnd' style={{ margin: '0px 0 15px' }}>
                                        <Label for='sorts'>مرتب سازی :</Label>

                                        <CustomInput
                                            type='select'
                                            id='sorts'
                                            name='sorts'
                                            onChange={e => this.handleFormChange(e, 'sort')}
                                        >
                                            <option disabled value={''}>انتخاب</option>
                                            {config.sorts.map((item, index) => (
                                                <option key={index} value={item.value}>{item.title}</option>
                                            ))}
                                        </CustomInput>

                                    </Form>

                                }
                                <div className={styles.searchResult}>

                                    {loading &&
                                        <Loading />
                                    }
                                    {this.renderItems()}
                                </div>


                                {pageCount > 1 &&
                                    <Pagination
                                        pageCount={pageCount}
                                        onPageChange={this.handlePageClick}
                                    />
                                }

                            </div>
                        </Col>
                    </Row>
                </Container>
                <Login
                    hasModal
                    modalisOpen={this.state.login}
                    openModal={this.openModal}
                />
            </React.Fragment>
        )
    }
}
export default Collection;
