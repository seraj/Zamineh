import React, { Component } from 'react';
import axios from 'axios';
import Flickity from 'react-flickity-component';
import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';

import Login from '../../login/Login';
import { SingleArtist } from '../../components/Artists/SingleArtist';
import Error from '../../components/Error';
import Urls from '../../components/Urls';
import Section from '../../components/Section/Section';


const flickityOptions = {
    initialIndex: 0,
    pageDots: false,
    contain: true,
    rightToLeft: true,
    cellAlign: 'right',
    groupCells: true,
    wrapAround: true

    //   groupCells: true
};


class ArtistToFolllow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artist: [],
            error: false,
            currentTab: this.props.handleLogin ? 'trending' : 'trending',
            login: false
        };
    }

    componentDidMount() {

        let mode = (this.props.mode);
        let url = `${Urls().api()}/for-you/${mode}/?${this.props.query}`;
        axios
            .get(url)
            .then(response => {
                this.setState({
                    artist: response.data
                });


            })
            .catch(error => {
                this.setState({
                    error: true
                });
            });
    }
    onTabClick = (value) => {
        this.setState({ currentTab: value })
    }
    onFollowClick = (id, Type, index) => {
        var Artist = this.state.artist[Type];
        // console.log('clicked On', Artist[index])

        axios.post(`${Urls().api()}/follow/toggle/`, {
            id: id,
            type: 'artists'
        }).then((response) => {
            Artist[index].is_flw = response.data.state;
            // console.log(Artist[index].is_flw)
            this.setState({
                Artist
            })
            if (response.data.state) {
                // console.log('ready for Shift')
                // Artist.splice(index, 1);
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
    renderItems = (Type) => {
        // console.log(Type, this.state.artist[Type])
        var Artist = this.state.artist[Type];

        if (!this.state.error) {
            return (
                Artist &&
                <Row>
                    <Flickity
                        className={'carousel items'}
                        elementType={'div'}
                        options={flickityOptions}
                        disableImagesLoaded={false}
                        reloadOnUpdate
                    >
                        {Artist.map((item, index) => (
                            <Col lg={3} md={4} sm={6} xs={12}>
                                <SingleArtist
                                    key={item.id}
                                    item={item}
                                    artistIndex={index}
                                    onFollowClick={this.onFollowClick}
                                    openModal={this.openModal}
                                    handleLogin={this.props.handleLogin}
                                />
                            </Col>
                        ))}
                    </Flickity>
                </Row>
            );
        } else {
            return <Error />;
        }
    }

    render() {
        const {
            id,
            mode,
            type,
            sectionName,
            title,
            handleLogin
        } = this.props;

        return (
            <>
                <Section ExtraClass={sectionName}>
                    <Container>
                        <div className='section_header'>
                            <h1>{title}</h1>
                            <div className='tabs'>
                                {handleLogin && this.state.artist.for_you != '' &&
                                    <div
                                        className='tab'
                                        onClick={() => this.onTabClick('foryou')} className={`tab${this.state.currentTab === 'foryou' ? ' active' : ''}`}
                                    >برای شما</div>}
                                {this.state.artist.trend_set != '' &&
                                    <div
                                        className='tab'
                                        onClick={() => this.onTabClick('trending')} className={`tab${this.state.currentTab === 'trending' ? ' active' : ''}`}
                                    >ترند</div>
                                }
                                {this.state.artist.pop_set != '' &&
                                    <div
                                        className='tab'
                                        onClick={() => this.onTabClick('popular')} className={`tab${this.state.currentTab === 'popular' ? ' active' : ''}`}
                                    >محبوب</div>
                                }
                            </div>

                        </div>
                        {this.state.currentTab === 'foryou' && this.state.artist.for_you &&
                            <>
                                {this.renderItems('for_you')}
                            </>
                        }
                        {this.state.currentTab === 'trending' && this.state.artist.trend_set &&
                            <>
                                {this.renderItems('trend_set')}
                            </>
                        }
                        {this.state.currentTab === 'popular' && this.state.artist.pop_set &&
                            <>
                                {this.renderItems('pop_set')}
                            </>
                        }
                    </Container>

                </Section>
                <Login
                    hasModal
                    modalisOpen={this.state.login}
                    openModal={this.openModal}
                />
            </>
        );
    }
}

export default ArtistToFolllow;
