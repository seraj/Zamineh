import React, { Component } from 'react';
import axios from 'axios';
import Popover from 'reactstrap/lib/Popover';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import SecurityManager from '../../security/SecurityManager'
import Login from '../../login/Login';

import { Img } from '../../components/General';
import Urls from '../../components/Urls';
import { IconPlus } from '../../components/Icons';

class Follow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFollow: this.props.isFollow,
            followPopover: false,
            popoverContent: [],
            login: false
        };
    }
    togglePopover = () => {
        this.setState({
            followPopover: !this.state.followPopover
        });
    }
    onFollowClick = (id, type, count, hassPopover) => {


        axios.post(`${Urls().api()}/follow/toggle/`, {
            id: id,
            type: type,
            count: count

        }).then((response) => {
            this.setState({
                isFollow: response.data.state
            })
            if (response.data.state) {
                if (type == 'artists' && hassPopover) {
                    this.setState({
                        followPopover: true,
                        popoverContent: response.data.new_follow_set
                    });
                }
            } else {
                this.setState({
                    followPopover: false,
                });
            }

        })
            .catch(function (error) {

            });
    }
    popoverFollowClick = (id, type, count, index) => {
        var Artist = this.state.popoverContent;
        const ids = Artist.map(item => item.id);

        axios.post(`${Urls().api()}/follow/toggle/`, {
            id: id,
            type: type,
            count,
            ids

        }).then((response) => {
            if (response.data.state) {

                Artist.splice(index, 1);
                if (response.data.new_follow_set != '') {
                    Artist.splice(index, 0, response.data.new_follow_set[0])
                }

                this.setState({
                    Artist
                })
                // console.log(Artist)
            }
            else {
                // console.log('its false')
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
        const { mode, id, count, hassPopover } = this.props;
        const { isFollow, followPopover, popoverContent } = this.state;
        const isLogined = SecurityManager().isLogined();
        return (
            <React.Fragment>
                <div
                    className={`follow-button ${isFollow ? 'following' : ''}`}
                    id={`${mode}_${id}`}
                    onClick={isLogined ?
                        () => this.onFollowClick(id, mode, count, hassPopover)
                        :
                        () => this.openModal(true)}
                >
                    <div className='plus-button'>
                        <div className='follow-button-icon'>
                            <IconPlus height='20px' width='20px' fill='transparent' stroke='#333' />
                        </div>
                        <div className='follow-button-text'></div>
                    </div>
                </div>
                {isLogined &&
                    <Popover className={`follow-popover ${followPopover ? 'show' : ''}`} placement='bottom' isOpen={followPopover} target={`${mode}_${id}`} toggle={this.togglePopover}>
                        <PopoverBody>
                            <div className='header'>
                                <span className='header-text'>هنرمندان دیگر برای دنبال کردن</span>
                                <span class='popover-close'>×</span>
                            </div>
                            <div className='popover-artists'>
                                <ul>
                                    {popoverContent &&
                                        popoverContent.map((item, index) => (
                                            <li key={item.id}>
                                                <div>
                                                    <Img
                                                        img={item.img.img}
                                                        width={item.img.ratio * 30}
                                                        alt={item.name}
                                                        width='30'
                                                        height='30'
                                                        style={{ background: '#e0e0e0', marginLeft: 10, width: 30, height: 30, float: 'right' }}
                                                    />
                                                    <a href={`${Urls().artist()}${item.slug}`} className='artist-name'>{item.name}</a>
                                                    <a className={`follow-button ${item.is_flw ? 'following' : ''}`} onClick={() => this.popoverFollowClick(item.id, 'artists', 1, index)}></a>
                                                </div>
                                            </li>
                                        ))}

                                </ul>
                            </div>
                        </PopoverBody>
                    </Popover>
                }
                <Login
                    hasModal
                    modalisOpen={this.state.login}
                    openModal={this.openModal}
                />
            </React.Fragment>
        );
    }
}
export default Follow;