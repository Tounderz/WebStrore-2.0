import React, { useContext } from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { Context } from '../../index';
import ProductItem from '../../components/componentsProduct/ProductComponent';
import { fetchProductsCategoryByBrand } from '../../http/categoryApi';
import TypeComponent from '../../components/componentsType/TypeComponent';
import './css/BrandPage.css'
import PaginationComponent from '../../components/componentsPagination/PaginationComponent';
import { observer } from 'mobx-react-lite';

const BrandsByCategoryPage = observer(() => {
    const { product, category, brand, type, pagination } = useContext(Context);

    const paginationClick = async () => {
        const data = await fetchProductsCategoryByBrand(category.selectedCategory.id, brand.brandsByCategory, pagination.currentPage);
            product.setProducts(data.products);
            pagination.setCountPages(data.countPages);
    }

    return (
        <Row className='brandFonPage'>
            <Col md={2} className='colBrandsByCategory'>
                <ListGroup className='listGroupBrand'>
                    <ListGroup.Item 
                        key='id'
                        disabled
                        style={{ 
                            borderColor: 'white',
                            borderRadius: '5px',
                            background:'none',
                            color: 'white',
                        }}
                    >
                        Types:
                    </ListGroup.Item>
                    {type.types.map(typeItem => 
                        <TypeComponent key={typeItem.id} typeItem={typeItem} brandsId={brand.brandsByType}/>
                    )}
                </ListGroup >
            </Col>
            <Col md={9}>
                <Row>
                    {product.products.map(item => (
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

export default BrandsByCategoryPage;