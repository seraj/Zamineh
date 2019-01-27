import React from 'react';
import ReactPaginate from 'react-paginate';

import styles from './Pagination.scss'

const Pagination = (props) => (
    <React.Fragment>
        <ReactPaginate
            previousLabel={'قبلی'}
            pageCount={props.pageCount}
            onPageChange={props.onPageChange}
            nextLabel={'بعدی'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            containerClassName={styles.pagination}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
        />
    </React.Fragment >
);

export default Pagination;
