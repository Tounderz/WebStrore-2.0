import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Col, ListGroup,  Row } from 'react-bootstrap';
import PaginationComponent from '../../components/componentsPagination/PaginationComponent';
import ProductItem from '../../components/componentsProduct/ProductComponent';
import TypeComponent from '../../components/componentsType/TypeComponent';
import { fetchProductsBrandByCategory } from '../../http/brandApi';
import { Context } from '../../index';

const CategoriesByBrandPage = observer(() => {
    const { product, category, brand, type, pagination } = useContext(Context);

    const paginationClick = async () => {
        const data = await fetchProductsBrandByCategory(brand.selectedBrand.id, category.categoriesByBrand, pagination.currentPage);
            product.setProducts(data.products);
            pagination.setCountPages(data.countPages);
            type.setTypes(data.types);
    }

    return (
        <Row className='categoryFonPage'>
            <Col md={2} className='colCategoriesByBrand'>
                <ListGroup className='listGroupCategory'>
                    <ListGroup.Item 
                        style={{ 
                            borderColor: 'white',
                            borderRadius: '5px',
                            background:'none',
                            color: 'white',
                        }}
                        disabled
                        key='id'
                    >
                        Types:
                    </ListGroup.Item>
                    {type?.types?.map(typeItem => 
                        <TypeComponent key={typeItem.id} typeItem={typeItem} brandsId={[brand.selectedBrand.id]}/>
                    )}
                </ListGroup >
            </Col>
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

export default CategoriesByBrandPage;