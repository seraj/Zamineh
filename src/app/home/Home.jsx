import React from "react";
import { withRouter } from "react-router-dom";

import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import axios from "axios";
import Loadable from "react-loadable";

import ModelManager from "../components/Models";
import Urls from "../components/Urls";

import HomeMetaTags from "./HomeMetaTags";
import Carousel from "./components/Carousel";
import TopShow from "./components/TopShow";
import ArtistToFollow from "./components/ArtistToFollow";

// import Arts from './components/Arts';
import ArtsLoading from "./components/ArtsLoading";
import RecomArtist from "./components/RecomArtist";
import Categories from "./components/Categories";
import ItemMedium from "./components/ItemMedium";
import BottomShow from "./components/BottomShow";

import Section from "../components/Section/Section";

const Arts = Loadable({
  loader: () => import("./components/Arts"),
  loading() {
    return <ArtsLoading />;
  }
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: {
        artist_popular_follow: {
          type: "all",
          title: this.props.isLogined
            ? "عنوان وقتی لاگین هستی"
            : "لاگین نیستی!",
          query: ""
        }
      },
      homeconfig: [],
      loadign: true,
      error: false
    };
  }
  componentDidMount() {
    axios.get(`${Urls().api()}/home/`).then(response => {
      this.setState({
        homeconfig: response.data
      });
    });
  }

  render() {
    const { isLogined } = this.props;
    const { homeconfig } = this.state;

    return (
      <>
        <HomeMetaTags />
        <Carousel slides={homeconfig.carousels} />
        <Section ExtraClass="section homeContent">
          <Container>
            {homeconfig.top_shows != "" && (
              <Section id="top_shows">
                <TopShow features={homeconfig.top_shows} />
              </Section>
            )}

            {!isLogined && homeconfig.mediums && (
              <Section Name="mediums">
                <div className="title right">
                  <h2>{ModelManager().convertModelName("medium")}</h2>
                </div>
                <div className="items">
                  <Row>
                    <ItemMedium items={homeconfig.mediums} />
                  </Row>
                </div>
              </Section>
            )}
            {isLogined && [
              <Arts
                justLogin
                handleLogin={isLogined}
                visible={homeconfig.has_recent_views}
                sectionName="recent"
                mode="arts"
                query="type=recent"
                title="اخیرا بازدید کرده اید"
              />,

              <Arts
                justLogin
                handleLogin={isLogined}
                visible={homeconfig.has_similar_view_works}
                sectionName="similar_view"
                mode="arts"
                query="type=similar_view"
                title="مشابه مطالبی که اخیرا نگاه کرده اید"
              />,

              <Arts
                justLogin
                handleLogin={isLogined}
                visible={homeconfig.has_saves}
                viewsLink={`${Urls().profile()}saves`}
                sectionName="save"
                mode="arts"
                query="type=save"
                title="اخیرا ذخیره شده ها"
              />,

              <Arts
                justLogin
                handleLogin={isLogined}
                visible={homeconfig.has_similar_saves}
                sectionName="similar_save"
                mode="arts"
                query="type=similar_save"
                title="مشابه ذخیره شده‌های اخیر"
              />
            ]}
          </Container>

          <ArtistToFollow
            viewsLink
            sectionName="artist_to_follow"
            mode="artist/follows"
            query="count=20"
            title="هنرمندان"
            handleLogin={isLogined}
          />

          <Container>
            <Arts
              viewsLink={Urls().artists()}
              visible
              sectionName="popularArtist"
              mode="artists"
              type="all"
              title={
                isLogined
                  ? "آثار هنرمندانی که دنبال میکنید"
                  : "هنرمندان محبوب زمینه"
              }
            />
            {isLogined && (
              <Arts
                justLogin
                handleLogin={isLogined}
                visible={homeconfig.has_recom_works}
                mode="arts"
                query="type=recommend"
                title="کارهایی که ما پیشنهاد میکنیم ببینید #مثلا"
              />
            )}

            {homeconfig.recom_artists != "" && (
              <RecomArtist
                artist={homeconfig.recom_artists}
                sectionName="artist_recommended"
              />
            )}

            {homeconfig.recom_base_artists != "" && (
              <RecomArtist
                artist={homeconfig.recom_base_artists}
                hasannotation
                sectionName="base_artist_recommended"
              />
            )}

            {homeconfig.cats && (
              <Categories cats={homeconfig.cats} sectionName="categories" />
            )}

            {homeconfig.bottom_shows != "" && (
              <Section id="bottom_shows">
                <BottomShow features={homeconfig.bottom_shows} />
              </Section>
            )}
          </Container>
        </Section>
      </>
    );
  }
}

export default withRouter(Home);
