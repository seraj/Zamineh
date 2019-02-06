import React from 'react';
import { Link } from 'react-router-dom';
import Urls from '../../Urls';

import { FormGroup } from '@smooth-ui/core-sc';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import styles from './Galleries.scss'


const GalleryForm = (props) => {
    const {
        SubmitForm,
        FormValues,
        onInputFocus,
        handleFormChange,
        onFormListClick,
        onGallerySearch
    } = props;
    return (

        <form onSubmit={SubmitForm}>
            <Row>
                <Col lg={4} md={4} sm={6} xs={12}>
                    <FormGroup
                        className={styles.formInputs}
                    >
                        <input
                            onFocus={onInputFocus}
                            autoComplete='off'
                            value={FormValues.city_id.currentValue}
                            onChange={(e) => handleFormChange(e)}
                            disabled
                            name='city_id'
                            placeholder='شهر برگذاری'
                        />
                        <i className='fas fa-caret-down' />
                        {FormValues.city_id && FormValues.city_id.dropdown &&
                            <ul className={styles.FormValues}>
                                {FormValues.city_id.values.map(item => (
                                    <li key={item.id} value={item.id} onClick={(e) => onFormListClick(e, 'city_id', item.name)}>{item.name}</li>
                                ))}
                            </ul>
                        }
                    </FormGroup>
                </Col>
                <Col lg={4} md={4} sm={6} xs={12}>
                    <FormGroup
                        className={styles.formInputs}
                    >
                        <input
                            onFocus={onInputFocus}
                            value={FormValues.genre_id.currentValue}
                            name='genre_id'
                            autoComplete='off'
                            placeholder='دسته بندی'
                        />
                        <i className='fas fa-caret-down' />
                        {FormValues.genre_id && FormValues.genre_id.dropdown &&
                            <ul className={styles.FormValues}>
                                {FormValues.genre_id.values.map(item => (
                                    <Link to={{ pathname: Urls().galleries(), search: `?genre_id=${item.id}` }}>
                                        <li key={item.id} value={item.id} onClick={(e) => onFormListClick(e, 'genre_id', item.name)}>{item.name}</li>
                                    </Link>
                                ))}
                            </ul>
                        }
                    </FormGroup>
                </Col>
                <Col lg={4} md={4} sm={6} xs={12}>
                    <FormGroup
                        className={styles.formInputs}
                    >
                        <input
                            onChange={onGallerySearch}
                            name='galleries'
                            autoComplete='off'
                            placeholder='همه‌ی نمایشگاه‌ها'
                        />
                        <i className='fas fa-search' />
                        {FormValues.galleries && FormValues.galleries.dropdown &&
                            <ul className={styles.FormValues}>
                                {FormValues.galleries.values.map(item => (
                                    <Link to={`${Urls().gallery()}${item.slug}`}>
                                        <li key={item.id}>{item.name}</li>
                                    </Link>
                                ))}
                            </ul>
                        }
                    </FormGroup>
                </Col>
            </Row>

        </form>

    )
};
export default GalleryForm;

