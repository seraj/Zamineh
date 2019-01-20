import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Container from "reactstrap/lib/Container";
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import queryString from 'query-string';

import ModelManager from '../../Models';
import Pagination from '../../Pagination/Pagination';

import Login from "../../../login/Login";
import GalleryForm from "./GalleryForm"
import { FeatureSet, ShowSet, GenreSet, ResultsGrid } from "./SingleGallery";
import Error from "../../Error";
import Urls from "../../Urls";
import Section from "../../Section/Section";
import { Loading } from "../../Spinner/Spinner";



class Galleries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            show_set: [],
            featured_galleries: [],
            genre_set: [],
            gallery_set: [],
            searchResults: [],
            Forms: {
                city_id: {
                    currentValue: 'تهران',
                    values: [],
                    dropdown: false,
                },
                genre_id: {
                    currentValue: '',
                    values: [],
                    dropdown: false,
                },
                galleries: {
                    currentValue: '',
                    values: [],
                    dropdown: false,
                }
            },
            FilterInfo: {
                city_id: 1,
                genre_id: 1,
                page: 0
            },
            error: false,
            pageCount: 0,
            login: false
        };
    }

    componentDidMount() {

        this.getGalleries(queryString.parse(location.search));
        // this.getCities();

        this.getGenre(this.state.FilterInfo)
    }
    getGalleries = (params) => {
        this.setState({ loading: true });
        // console.log('params', params)
        axios
            .get(`${Urls().api()}/galleries/`, { params: params })
            .then((response) => {
                this.setState({
                    loading: false,
                    pageCount: response.data.page_count,
                    show_set: response.data.show_set,
                    featured_galleries: response.data.featured_galleries,
                    genre_set: response.data.genre_set,
                    gallery_set: response.data.gallery_set,
                    pageCount: response.data.page_count
                }, () => {
                    this.forceUpdate();
                });

            })
            .catch(error => {
                this.setState({ loading: false });
            });
    }
    getCities = () => {
        axios.get(`${Urls().api()}/galleries/cities/`)
            .then((response) => {

                this.setState({
                    Forms: {
                        ...this.state.Forms,
                        cities: {
                            values: response.data,
                        }
                    }
                })
            })
    }
    getGenre = (params) => {
        axios.get(`${Urls().api()}/galleries/genres/`, { params: params })
            .then((response) => {
                this.setState({
                    Forms: {
                        ...this.state.Forms,
                        genre_id: {
                            values: response.data,
                        }
                    }
                })
            })
    }
    handlePageClick = (data) => {
        let selected = data.selected + 1;

        this.setState({
            selectedPage: selected,
            loading: true,
            FilterInfo: {
                ...this.state.FilterInfo,
                page: selected
            }
        }, () => {
            this.getGalleries(this.state.FilterInfo);
        });
    };
    SubmitForm = values => {
        console.log(values)
    }
    onInputFocus = (e) => {
        console.log(e)
        console.log(e.target.name, e.target.value)
        var name = e.target.name;
        var value = e.target.value;
        let setValue = { ...this.state.Forms };
        setValue[name].dropdown = true;
        this.setState({
            setValue
        })
    }
    handleFormChange = (e) => {
        var name = e.target.name;
        var value = e.target.value;
        let setValue = { ...this.state.Forms };
        setValue[name].currentValue = value;
        this.setState({
            setValue
        })

    }

    onGallerySearch = (e) => {

        var name = e.target.name;
        var value = e.target.value;
        let setValue = { ...this.state.Forms };
        setValue[name].dropdown = true;
        axios
            .get(`${Urls().api()}/galleries/autocomplete/?phrase=${value}`)
            .then(response => {
                setValue[name].values = response.data.items;

                this.setState({
                    setValue
                })
            })
            .catch((response) => {
                console.log(response);
            });
    }
    onFormListClick = (e, name, FaValue) => {
        const value = e.target.value;
        console.log(name, value);
        let setValue = { ...this.state.Forms };
        setValue[name].currentValue = FaValue;
        setValue[name].dropdown = false;
        // console.log(setValue, FaValue)
        this.setState({
            setValue,
            FilterInfo: {
                ...this.state.FilterInfo,
                [name]: value
            }
        }, () => {
            this.getGalleries(this.state.FilterInfo);
        });

    }
    onFollowClick = (id, index, parentIndex, Type) => {

        var Galleries;
        switch (Type) {
            case "show_set":
                Galleries = this.state.show_set;
                break;
            case "genre_set":
                Galleries = this.state.genre_set[parentIndex].gallery_set;
                break;
            case "feature_set":
                Galleries = this.state.featured_galleries[parentIndex].gallery_set;
                break;
            case "gallery_set":
                Galleries = this.state.gallery_set;
                break;
            default:
                Galleries = "/";
        }
        console.log(id, parentIndex, index)
        // console.log('clicked On', Galleries)

        axios.post(`${Urls().api()}/follow/toggle/`, {
            id: id,
            type: 'galleries'
        }).then((response) => {
            Galleries[index].is_flw = response.data.state;
            // console.log(Galleries[index].is_flw)
            this.setState({
                Galleries
            })
            if (response.data.state) {
                // console.log('ready for Shift')
                // Galleries.splice(index, 1);
            }

        })
            .catch(function (error) {

            });
    }
    openModal = value => {
        this.setState({
            login: value
        });
    };


    render() {
        const parsed = queryString.parse(location.search);
        return (
            <React.Fragment>
                <Section ExtraClass={'content singlePage'}>
                    <Container>
                        <Row>
                            <Col xs={12}>
                                <div className="section_header_single">
                                    <h1>همه‌ی {ModelManager().convertModelName('galleries')}</h1>
                                    <Link to={Urls().galleriesAZ()} className="view-all">الف-ی</Link>

                                </div>
                            </Col>
                            <Col xs={12}>
                                <GalleryForm
                                    FormValues={this.state.Forms}
                                    SubmitForm={this.SubmitForm}
                                    handleFormChange={this.handleFormChange}
                                    onInputFocus={this.onInputFocus}
                                    onFormListClick={this.onFormListClick}
                                    onGallerySearch={this.onGallerySearch}
                                />
                            </Col>
                        </Row>
                        {this.state.show_set &&
                            <ShowSet
                                item={this.state.show_set}
                                onFollowClick={this.onFollowClick}
                                openModal={this.openModal}
                                handleLogin={this.props.isLogined}
                            />
                        }
                        {this.state.loading &&
                            <Loading />
                        }
                        {this.state.featured_galleries &&
                            <FeatureSet
                                item={this.state.featured_galleries}
                                onFollowClick={this.onFollowClick}
                                openModal={this.openModal}
                                handleLogin={this.props.isLogined}
                            />
                        }
                        {this.state.genre_set &&
                            <GenreSet
                                item={this.state.genre_set}
                                onFollowClick={this.onFollowClick}
                                openModal={this.openModal}
                                handleLogin={this.props.isLogined}
                            />
                        }
                        {this.state.gallery_set &&
                            <ResultsGrid
                                item={this.state.gallery_set}
                                onFollowClick={this.onFollowClick}
                                openModal={this.openModal}
                                handleLogin={this.props.isLogined}
                            />
                        }
                        {this.state.pageCount > 1 &&
                            <Pagination
                                pageCount={this.state.pageCount}
                                onPageChange={this.handlePageClick}
                            />
                        }
                    </Container>

                </Section>
                <Login
                    hasModal
                    modalisOpen={this.state.login}
                    openModal={this.openModal}
                />
            </React.Fragment >
        );
    }
}

export default Galleries;
