import React, { Component } from "react";
import axios from "axios";
import SecurityManager from "../../security/SecurityManager";
import Login from "../../login/Login";

import Urls from "../../components/Urls";

import styles from "./uiComponents.scss";
class FollowInline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFollowed: this.props.isFollowed,
      loading: false,
      login: false
    };
  }

  handleClick = () => {
    axios
      .post(
        `${Urls().api()}/follow/toggle/`,
        {
          type: this.props.type,
          id: this.props.id
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      )
      .then(response => {
        this.setState({
          isFollowed: response.data.state
        });
      });
  };

  openModal = value => {
    this.setState({
      login: value
    });
  };
  render() {
    const { isFollowed, loading } = this.state;
    const isLogined = SecurityManager().isLogined();
    return (
      <>
        <span
          onClick={
            isLogined ? () => this.handleClick() : () => this.openModal(true)
          }
          className={`${styles.FollowInline} ${
            isFollowed ? "following" : null
          }`}
        />
        <Login
          hasModal
          modalisOpen={this.state.login}
          openModal={this.openModal}
        />
      </>
    );
  }
}
export default FollowInline;
