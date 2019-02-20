import React, { Component } from 'react';
import axios from 'axios';
import { IconSave } from '../../components/Icons';
import SecurityManager from '../../security/SecurityManager'
import Login from '../../login/Login';

import { Img } from '../../components/General';
import Urls from '../../components/Urls';
import { IconPlus } from '../../components/Icons';

class SaveButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSaved: this.props.isSaved,
            loading: false,
            login: false
        };
    }

    handleClick = () => {


        axios.post(`${Urls().api()}/art/save/toggle/`, 
        {
            id: this.props.id
                
        },
        {
        headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
        }).then((response) => {
            this.setState({
                isSaved: response.data.state
            })

        })
    }

    openModal = value => {
        this.setState({
            login: value
        });
    };
    render() {
        const { isSaved, loading } = this.state;
        const isLogined = SecurityManager().isLogined();
        return (
            <React.Fragment>
                <div
                    className={'save_art ' + (isSaved ? 'saved' : '') + (loading ? ' loading' : '')}
                    onClick={
                        isLogined ?
                            () => this.handleClick()
                            :
                            () => this.openModal(true)
                    }>
                    {loading && <div className='loadingSpinner'></div>}
                    <IconSave height='80%' width='90%' fill='transparent' stroke='#fff' />
                </div>
                <Login
                    hasModal
                    modalisOpen={this.state.login}
                    openModal={this.openModal}
                />
            </React.Fragment>
        );
    }
}
export default SaveButton;