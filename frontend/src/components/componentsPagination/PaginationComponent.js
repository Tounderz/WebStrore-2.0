import { observer } from 'mobx-react-lite';
import React from 'react';
import { useContext } from 'react';
import { Pagination } from 'react-bootstrap';
import { Context } from '../../index';
import './css/PaginationComponent.css'

const PaginationComponent = observer(() => {
    const { pagination } = useContext(Context);
    const pages = [];

    const paginationClick = (item) => {
        pagination.setCurrentPage(item);
    }

    if (pagination.countPages > 1) {
        for (let index = 0; index < pagination.countPages; index++) {
            pages.push(index + 1);
        }
    }

    return (
        <Pagination className='pagination' size='sm'>
            {pages.map(item =>
                <Pagination.Item
                    key={item}
                    active={item === pagination.currentPage}
                    onClick={() => paginationClick(item)}
                >
                    {item}
                </Pagination.Item>
            )}
        </Pagination>
    );
});

export default PaginationComponent;