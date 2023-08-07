import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Context } from '../../index';
import ProductItem from '../../components/componentsProduct/ProductComponent';
import { fetchProductsType } from '../../http/typeApi';
import './css/TypePage.css'
import PaginationComponent from '../../components/componentsPagination/PaginationComponent';

const TypePage = observer(() => {
    const {product, pagination, type, brand } = useContext(Context);

    const paginationClick = async () => {
        const data = await fetchProductsType(type.selectedType.id, brand.brandsByType, pagination.currentPage);
            product.setProducts(data.products);
    }

    return (
        <Row className='typeFonPage'>
            <Col md={9}>
                <Row>
                    {product?.products?.map(item => (
                        <ProductItem key={item.id} prod={item}/>
                    ))}
                </Row>
            </Col>
            <Row onClick={() => paginationClick()}>
                <PaginationComponent/>
            </Row>
        </Row>
    );
});

export default TypePage;