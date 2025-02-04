import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col'; import axios from 'axios';
import queryString from 'query-string';
import SecurityManager from '../../security/SecurityManager'

import Urls from '../Urls'
import { CustomInput, Form, FormGroup, Label } from 'reactstrap';
import { Filters, InputSlider, FilterBox } from '../Filters/Filters';

import NumbersConvertor from '../NumbersConvertor';
import ModelManager from '../Models';

import CollectMetaTags from './CollectMetaTags'
import Pagination from '../Pagination/Pagination';
import { Loading } from '../Spinner/Spinner';
import { ThreeColumnArt } from '../ArtArtist/Arts';



import styles from './Collect.scss'

const isLogined = SecurityManager().isLogined();


class Collect extends React.Component {
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
                'year': null

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
        this.getPageConfig();
        this.getOffers();
    }

    getPageConfig = () => {
        axios.get(`${Urls().api()}/collect/configs/`)
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


    collectFormRef = (form) => {
        this.form = form;
        // console.log(form)
    }




    renderItems() {
        var Arts = this.state.Results;
        if (!this.state.error) {

            return (
                <ThreeColumnArt Arts={Arts} />
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
            <>

                <CollectMetaTags />
                <Container>
                    <Row>
                        <Col xs={12}>
                            <div className='section_header_single'>
                                <h1>{ModelManager().convertModelName('collect')} هنرمندان</h1>
                                <Link to={Urls().collections()} className='view-all'>{ModelManager().convertModelName('collections')}</Link>
                            </div>

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
                                            <>
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
                                            </>
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
                                            <>
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
                                            </>
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

            </>
        )
    }
}
export default Collect;
