import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from 'react-bootstrap';
import { Context } from '../../index';
import { fetchProduct } from '../../http/productApi';
import { fetchCategories } from '../../http/categoryApi';
import { fetchBrands } from '../../http/brandApi';
import { fetchTypes } from '../../http/typeApi';
import UpdateProduct from './UpdateProduct';
import ConfirmRemoval from '../componentsConfirmRemoval/ConfirmRemoval';
import { PAGE_FIRST } from '../../utils/const';
import '../../pages/admin/css/AdminPage.css';

const ProductTableComponent = observer(({prod}) => {
    const { product, sort, remove, pagination, search, category, brand, type } = useContext(Context);
    const [editVisible, setEditVisible] = useState(false);
    const [removeVisible, setRemoveVisible] = useState(false);
    
    const productUpdate = async (id) => {
        const data = await fetchProduct(id);
            product.setSelectedProduct(data.product);
        const dataCategories = await fetchCategories(0);
            category.setCategories(dataCategories.categories);
        const dataBrands = await fetchBrands(0);
            brand.setBrands(dataBrands.brands);
        const dataTypes = await fetchTypes(0, 0);
            type.setTypes(dataTypes.types);
            setEditVisible(true);
        paginationParameter(data.countPages);
        cleanSearchAndSort();
    }

    const productRemove = async (prod) => {
        setRemoveVisible(true);
            remove.setRemoveObjeck(prod);
            remove.setRemoveParameterName('product');
    }

    const paginationParameter = (countPages) => {
        pagination.setCountPages(countPages);
        pagination.setCurrentPage(PAGE_FIRST);
    }

    const cleanSearchAndSort = () => {
        sort.setFieldNames([]);
        sort.setFieldName('');
        sort.setTypeSort('');
        search.setSearchBy('');
        search.setSelectedSearchParameter('');
    }

    return (
        <tr key={prod.id}>
            <th scope='col'>{prod.id}</th>
            <th scope='col'>{prod.name}</th>
            <th scope='col'>{prod.categoryName}</th>
            <th scope='col'>{prod.brandName}</th>
            <th scope='col'>{prod.typeName}</th>
            <th scope='col'>{prod.shortDescription}</th>
            <th scope='col'>{prod.price}$</th>
            <th scope='col'>{prod.available}</th>
            <th scope='col'>{prod.countView}</th>
            <th className='col'>
                <Button
                    className='button_update'
                    variant='link'
                    onClick={() => productUpdate(prod.id)}
                >
                    Edit
                </Button>
            </th>
            <th className='col'>
                <Button
                    className='button_remove'
                    variant='link'
                    onClick={() => productRemove(prod)}
                >
                    Remove
                </Button>
            </th>
            <UpdateProduct show={editVisible} onHide={() => setEditVisible(false)}/>
            <ConfirmRemoval show={removeVisible} onHide={() => setRemoveVisible(false)}/>
        </tr>
    );
});

export default ProductTableComponent;