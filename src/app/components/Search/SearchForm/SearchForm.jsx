import React from 'react';
import axios from 'axios';
import Urls from '../../Urls'
import styles from './SearchForm.scss'
const ResultsItem = (props) => {
    return (
        <a
            href={`${Urls().withProps(props.item.model)}${props.item.slug}`}
            className={styles.resultItems}
        >
            <img src={props.item.img} alt={props.item.name} width='32px' height='32px' />
            <span>{props.item.name}</span>
        </a>
    )
}
class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            Results: [],
        };
    }
    componentDidMount() { }


    ResultPopUp = {
        position: 'absolute',
        top: '100%',
        left: 0,
        ZIndex: '100',
        right: 'auto',
    };
    onSubmit = (event) => {
        event.preventDefault();
        window.location.href = `${Urls().search()}?query=${this.state.value}`;
    }
    handleChange = (event) => {

        const value = event.target.value
        this.setState({
            value: value,
            Results: []
        })

        axios
            .get(`${Urls().api()}/search/?phrase=${value}`)
            .then(response => {
                this.setState({
                    Results: response.data.results
                })
            })
            .catch((response) => {
                console.log(response);
            });
    }
    render() {
        const { isLogined } = this.props;
        return (
            <div className={styles.headerSearch}>
                <div className={styles.searchContainer}>

                    <form onSubmit={this.onSubmit}>
                        <input
                            name='query'
                            type='text'
                            autoComplete='off'
                            placeholder='جستجو در زمینه'
                            onChange={this.handleChange}
                        />

                        <a className='icon-search'>
                            <i className='fas fa-search' />
                        </a>

                        <div className={styles.Results} style={{
                            display: this.state.value != '' ? 'block' : 'none',
                            ...this.ResultPopUp
                        }} >
                            <span className='searchFor'>جستجو برای “{this.state.value}”</span>
                            {
                                this.state.Results &&
                                this.state.Results.map(items => (
                                    <ResultsItem key={items.id} item={items} />
                                ))
                            }
                        </div>
                    </form>

                </div>
            </div>
        )
    }
}
export default SearchForm;
