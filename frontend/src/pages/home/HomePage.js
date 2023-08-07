import React, { useContext, useEffect } from 'react';
import { Context } from '../../index';
import { fetchBrandsPopular, fetchProductsPopular, fetchCategoriesPopular } from '../../http/homeApi';
import { fetchBrands } from '../../http/brandApi';
import { fetchCategories } from '../../http/categoryApi';
import { observer } from 'mobx-react-lite';
import { Carousel, Col, ListGroup, Row } from 'react-bootstrap';
import CategoryPopularComponent from '../../components/componentsCategory/CategoryPopularComponent';
import ProductComponent from '../../components/componentsProduct/ProductComponent';
import './css/HomePage.css'
import BrandPopularComponent from '../../components/componentsBrand/BrandPopularComponent';

const HomePage = observer(() => {
    const { product, category, brand } = useContext(Context);

    useEffect(async () => {
        const dataPopularCategories = await fetchCategoriesPopular();
            category.setPopularCategories(dataPopularCategories.popularCategories);

        const dataCategories = await fetchCategories(0);
            category.setCategories(dataCategories.categories);

        const dataPopularBrands = await fetchBrandsPopular();
            brand.setPopularBrands(dataPopularBrands.popularBrands);
            
        const dataBrands = await fetchBrands(0);
            brand.setBrands(dataBrands.brands);
        
        const dataProducts = await fetchProductsPopular();
            product.setPopularProducts(dataProducts.popularProducts);
    }, [brand, category, product])

    return (
        <Row className='homeFonPage'>
            <Col 
                md={2}
                className='colListGroupHome'
            >
                <ListGroup 
                    className='listBrandHome'
                >
                    {brand.popularBrands.map(brandItem => 
                        <BrandPopularComponent key={brandItem.id} brandItem={brandItem}/>
                    )}
                </ListGroup>
            </Col>
            <Col 
                md={9}
                className='colCarouselHome'
            >
                <Carousel
                    className='carouselHome'
                    variant='dark'
                >
                    {category.popularCategories.map(categoryItem => (
                        <Carousel.Item

                            key={categoryItem.id}
                        >
                            <CategoryPopularComponent key={categoryItem.id} categoryItem={categoryItem}/>
                        </Carousel.Item>
                    ))}
                </Carousel>
                <Row>
                    {product.popularProducts.map(prod => (
                        <ProductComponent key={prod.id} prod={prod}/>
                    ))}
                </Row>
            </Col>
        </Row>
    );
});

export default HomePage;