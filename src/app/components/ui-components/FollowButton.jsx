import React, { Component } from 'react';
import axios from 'axios';
import { IconSave } from '../../components/Icons';
import SecurityManager from '../../security/SecurityManager'
import Login from '../../login/Login';

import Urls from '../../components/Urls';

import { IconPlus } from '../../components/Icons';

import styles from './uiComponents.scss'
class FollowButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFollowed: this.props.isFollowed,
            loading: false,
            login: false
        };
    }

    handleClick = () => {


        axios.post(`${Urls().api()}/follow/toggle/`,
            {
                type: this.props.type,
                id: this.props.id

            },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((response) => {
                this.setState({
                    isFollowed: response.data.state
                })

            })
    }

    openModal = value => {
        this.setState({
            login: value
        });
    };
    render() {
        const { isFollowed, loading } = this.state;
        const { min, big, wide } = this.props;
        const isLogined = SecurityManager().isLogined();
        return (
            <>
                <button
                    className={`${styles.followBtn} ${isFollowed ? 'following' : ''} ${big ? 'big' : ''} ${min ? 'min' : ''} ${wide ? 'wide' : ''}`}
                    onClick={
                        isLogined ?
                            () => this.handleClick()
                            :
                            () => this.openModal(true)
                    }
                ></button>
                <Login
                    hasModal
                    modalisOpen={this.state.login}
                    openModal={this.openModal}
                />
            </>
        );
    }
}
export default FollowButton;