import React, { Component } from "react";
import axios from "axios";
import Flickity from "react-flickity-component";
import { Spinner } from '../../components/Spinner/Spinner';
import SecurityManager from '../../security/SecurityManager'
import Login from "../../login/Login";

import Follow from "./Follow";
import SingleArts from "./SingleArts";
import Error from "../../components/Error";
import Urls from "../../components/Urls";
import Section from "../../components/Section/Section";

import { flickityOptions } from "../../components/FlickityOptions";

// const SingleArts = React.lazy(() => import('./SingleArts'));
const isLogined = SecurityManager().isLogined();

class Arts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      justLogin: this.props.justLogin ? true : false,
      arts: [],
      cats: [],
      followPopover: false,
      error: false,
      login: false,
    };
  }

  componentDidMount() {

    let url = "";
    let mode = (this.props.mode);

    if (this.props.type == "all") {
      url = `${Urls().api()}/for-you/${mode}/?type=${
        this.props.type
        }`;
    } else {
      url = `${Urls().api()}/for-you/${mode}/?${this.props.query}`;
    }

    axios
      .get(url)
      .then(response => {
        this.setState({
          arts: response.data
        });


      })
      .catch(error => {
        this.setState({
          error: true
        });
      });
  }

  openModal = value => {
    this.setState({
      login: value
    });
  };

  onSaveItemClick = (index) => {
    var Arts = (this.props.mode == 'artists') ? this.state.arts.art_set : this.state.arts;

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
      .catch(function (error) {
        Arts[index].save_loading = false;

      });
  }
  renderItems() {
    var Arts = (this.props.mode == 'artists') ? this.state.arts.art_set : this.state.arts;

    if (!this.state.error) {
      return (
        Arts &&
        Arts.map((item, index) => (
          <SingleArts
            key={item.id}
            item={item}
            ArtIndex={index}
            onSaveItemClick={this.onSaveItemClick}
            openModal={this.openModal}
            isLogined={isLogined}
          />
        ))
      );
    } else {
      return <Error />;
    }
  }





  render() {
    const showwhenuserLoggedin = this.props.handleLogin ? this.state.justLogin : true;
    const {
      id,
      mode,
      type,
      sectionName,
      hasannotation,
      annotation,
      based_slug,
      based_name,
      title,
      follow,
      isFollow,
      viewsLink,
      handleLogin,
      visible
    } = this.props;
    return (

      <React.Fragment>
        {visible && showwhenuserLoggedin &&
          <Section ExtraClass={sectionName}>


            <div className="section_header">
              {hasannotation &&
                <div className="annotation">
                  {annotation} {based_name && <a href={Urls().artist() + based_slug}>{based_name}</a>}
                </div>
              }
              <h1>{title}</h1>
              {follow &&
                <Follow
                  isFollow={isFollow}
                  mode={mode}
                  id={id}
                  count={2}
                  hassPopover
                />

              }
              {viewsLink &&
                <a href={viewsLink} className="view-all">
                  نمایش همه
            </a>
              }
            </div>
            <Flickity
              className={"carousel items"}
              elementType={"div"}
              options={flickityOptions}
              disableImagesLoaded={false}
              reloadOnUpdate
            >
              {type == "all" && (
                <div className="artist_list">
                  <div className="content">
                    {this.state.arts.artist_set &&
                      this.state.arts.artist_set.map(item => (
                        <a key={item.id} href={item.slug}>{item.name}</a>
                      ))}
                  </div>
                </div>
              )}
              {this.renderItems()}
            </Flickity>
          </Section>
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

export default Arts;
