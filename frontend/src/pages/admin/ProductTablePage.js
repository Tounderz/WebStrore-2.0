import React, { useContext } from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { Context } from '../../index';
import { fetchProducts } from '../../http/productApi';
import { observer } from 'mobx-react-lite';
import { sortProducts } from '../../http/sortApi';
import PaginationComponent from '../../components/componentsPagination/PaginationComponent';
import SearchFormTable from '../../components/componentsSearchFormTable/SearchFormTable';
import { fetchSearchProductAdmin } from '../../http/searchApi';
import { PAGE_FIRST, PRODUCT, PROPERTY_TITLE_PRODUCTS } from '../../utils/const';
import ProductTableComponent from '../../components/componentsProduct/ProductTableComponent';
import ProductListGroupComponent from '../../components/componentsProduct/ProductListGroupComponent';
import './css/AdminPage.css';
import './css/AdminPageMedia.css';

const ProductTablePage = observer(() => {
    const { product, sort, messages, pagination, search } = useContext(Context);
   
    const paginationClick = async () => {
        if (sort.typeSort !== '' || sort.fieldName !== '') {
            const data = await sortProducts(sort.fieldName, sort.typeSort, pagination.currentPage);
                product.setProducts(data.products);
                paginationParameter(data.countPages);
        } else if (search.searchBy !== '' || search.selectedSearchParameter !== '') {
            const data = await fetchSearchProductAdmin(search.selectedSearchParameter, pagination.currentPage, search.searchBy);
                product.setProducts(data.products);
                paginationParameter(data.countPages);
        } else {
            const data = await fetchProducts(pagination.currentPage);
                product.setProducts(data.products);
                paginationParameter(data.countPages);
        }
    };

    const paginationParameter = (countPages) => {
        pagination.setCountPages(countPages);
        pagination.setCurrentPage(PAGE_FIRST);
    }

    return (
        <Row className='table'>
            <Row>
                {messages.messageError !== '' ? 
                    <div 
                        className='error_message'
                    >
                        {messages.messageError}
                    </div>
                    :
                    ''
                }
                <Col md={6}>
                    <SearchFormTable 
                        key='id'
                        parameter={PRODUCT}
                        array={PROPERTY_TITLE_PRODUCTS}
                    />
                </Col>
            </Row>
            <Col md={10}>
                <Table
                    className='table'
                    size='sm'
                >
                    <thead>
                        <tr key='id'>
                            <th scope='col'>Id</th>
                            <th scope='col'>Name</th>
                            <th scope='col'>Category</th>
                            <th scope='col'>Brand</th>
                            <th scope='col'>Type</th>
                            <th scope='col'>Short Description</th>
                            <th scope='col'>Price</th>
                            <th scope='col'>Available</th>
                            <th scope='col'>Count View</th>
                            <th scope='col'>Edit</th>
                            <th scope='col'>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product?.products?.map((prod) => (
                            <ProductTableComponent key={prod.id} prod={prod}/>
                        ))}
                    </tbody>
                </Table>
                <Row onClick={paginationClick}>
                    <PaginationComponent/>
                </Row>
            </Col>
            <Col md={2}>
                <ProductListGroupComponent />
            </Col>
        </Row>
    );
});

export default ProductTablePage;