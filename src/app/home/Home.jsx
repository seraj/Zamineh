import React from 'react';
import { withRouter } from 'react-router-dom';

import Container from 'reactstrap/lib/Container';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import axios from 'axios';
import Loadable from 'react-loadable';

import ModelManager from '../components/Models';
import Urls from '../components/Urls';

import HomeMetaTags from './HomeMetaTags';
import Carousel from './components/Carousel';
import TopShow from './components/TopShow';
import ArtistToFollow from './components/ArtistToFollow';

// import Arts from './components/Arts';
import ArtsLoading from './components/ArtsLoading';
import RecomArtist from './components/RecomArtist';
import Categories from './components/Categories';
import ItemMedium from './components/ItemMedium';
import BottomShow from './components/BottomShow';

import Section from '../components/Section/Section';


const Arts = Loadable({
  loader: () => import('./components/Arts'),
  loading() {
    return <ArtsLoading />
  }
});





class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: {
        artist_popular_follow: {
          type: 'all',
          title: this.props.isLogined ? 'عنوان وقتی لاگین هستی' : 'لاگین نیستی!',
          query: ''
        }
      },
      homeconfig: [],
      loadign: true,
      error: false

    };
  }
  componentDidMount() {


    axios
      .get(`${Urls().api()}/home/`)
      .then(response => {
        this.setState({
          homeconfig: response.data

        });
      })
      .catch((response) => {
        console.log(response);
      });
  }

  render() {
    const { isLogined } = this.props;

    return (
      <React.Fragment>
        <HomeMetaTags />
        <Carousel slides={this.state.homeconfig.carousels} />
        <Section ExtraClass='section homeContent'>
          <Container>
            {this.state.homeconfig.top_shows != '' &&
              <Section id='top_shows'>
                <TopShow features={this.state.homeconfig.top_shows} />
              </Section>
            }


            {!isLogined &&
              <Section Name='mediums'>
                <div className='title right'>
                  <h2>{ModelManager().convertModelName('medium')}</h2>
                </div>
                <div className='items'>
                  <Row>
                    <ItemMedium items={this.state.homeconfig.mediums} />
                  </Row>
                </div>
              </Section>
            }
            {isLogined && [
              <Arts
                justLogin
                handleLogin={isLogined}
                visible={this.state.homeconfig.has_recent_views}
                sectionName='recent'
                mode='arts'
                query='type=recent'
                title='اخیرا بازدید کرده اید'
              />,


              <Arts
                justLogin
                handleLogin={isLogined}
                visible={this.state.homeconfig.has_similar_view_works}
                sectionName='similar_view'
                mode='arts'
                query='type=similar_view'
                title='مشابه مطالبی که اخیرا نگاه کرده اید'
              />,


              <Arts
                justLogin
                handleLogin={isLogined}
                visible={this.state.homeconfig.has_saves}
                viewsLink
                sectionName='save'
                mode='arts'
                query='type=save'
                title='اخیرا ذخیره شده ها'
              />,


              <Arts
                justLogin
                handleLogin={isLogined}
                visible={this.state.homeconfig.has_similar_saves}
                sectionName='similar_save'
                mode='arts'
                query='type=similar_save'
                title='مشابه ذخیره شده‌های اخیر'
              />
            ]}
          </Container>

          <ArtistToFollow
            viewsLink
            sectionName='artist_to_follow'
            mode='artist/follows'
            query='count=20'
            title='هنرمندان'
            handleLogin={isLogined}
          />

          <Container>

            <Arts
              viewsLink
              visible
              sectionName='popularArtist'
              mode='artists'
              type='all'
              title={isLogined ? 'آثار هنرمندانی که دنبال میکنید' : 'هنرمندان محبوب زمینه'}
            />
            {isLogined &&
              <Arts
                justLogin
                handleLogin={isLogined}
                visible={this.state.homeconfig.has_recom_works}
                mode='arts'
                query='type=recommend'
                title='کارهایی که ما پیشنهاد میکنیم ببینید #مثلا'
              />
            }


            {this.state.homeconfig.recom_artists != '' &&
              <RecomArtist artist={this.state.homeconfig.recom_artists} sectionName='artist_recommended' />
            }

            {this.state.homeconfig.recom_base_artists != '' &&
              <RecomArtist artist={this.state.homeconfig.recom_base_artists} hasannotation sectionName='base_artist_recommended' />
            }

            {this.state.homeconfig.cats &&
              <Categories cats={this.state.homeconfig.cats} sectionName='categories' />
            }



            {this.state.homeconfig.bottom_shows != '' &&
              <Section id='bottom_shows'>
                <BottomShow features={this.state.homeconfig.bottom_shows} />
              </Section>
            }
          </Container>
        </Section>
      </React.Fragment>
    );
  }
}

export default withRouter(Home);
