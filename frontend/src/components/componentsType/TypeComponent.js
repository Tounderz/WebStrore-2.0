import React, { useContext } from 'react';
import { Context } from '../../index';
import { ListGroup } from 'react-bootstrap';
import { ERROR_ROUTE, TYPE_ROUTE } from '../../utils/constRoutes';
import { useNavigate } from 'react-router';
import { fetchProductsType } from '../../http/typeApi';
import { observer } from 'mobx-react-lite';
import { PAGE_FIRST } from '../../utils/const';

const TypeComponent = observer(({typeItem, brandsId}) => {
    const { product, type, messages, pagination } = useContext(Context);
    const navigate = useNavigate();

    const getType = async () => {
        try {
            type.setSelectedType(typeItem);
            const data = await fetchProductsType(typeItem.id, brandsId, PAGE_FIRST);
                product.setProducts(data.products);
                pagination.setCurrentPage(PAGE_FIRST);
                pagination.setCountPages(data.countPages);
        
            navigate(TYPE_ROUTE);
        } catch (e) {
            messages.setMessageError(e.response.data.message);
            navigate(ERROR_ROUTE);
        }
    }

    return (
        <ListGroup.Item 
            md={3} 
            className='d-flex justify-content-center btn-primary'
            style={
                {
                    cursor: 'pointer',
                    borderRadius: '5px',
                    background:'none',
                    color: 'white'
                }}
            onClick={getType}
        >
            {typeItem.name}
        </ListGroup.Item>
    );
});

export default TypeComponent;