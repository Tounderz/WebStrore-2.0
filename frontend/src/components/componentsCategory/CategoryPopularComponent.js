import React, { useContext } from 'react';
import { Context } from '../../index';
import { useNavigate } from 'react-router';
import { Carousel, Col, Image } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { CATEGORY_ROUTE, ERROR_ROUTE } from '../../utils/constRoutes';
import { fetchProductsCategory } from '../../http/categoryApi';
import { fetchTypes } from '../../http/typeApi';
import { fetchBrands } from '../../http/brandApi';
import '../../pages/home/css/HomePage.css';
import { PAGE_FIRST, UNREGISTERED } from '../../utils/const';
import { PICTURE } from '../../utils/constFunctions';

const CategoryPopularComponent = observer(({categoryItem}) => {
    const { product, category, brand, type, auth, pagination, messages } = useContext(Context);
    const navigate = useNavigate();
    
    const getCategory = async () => {
        try {
            const role = !auth?.auth?.role ? UNREGISTERED : auth.auth.role;
            const dataProducts = await fetchProductsCategory(categoryItem.id, role, PAGE_FIRST);
                product.setProducts(dataProducts.products);
                pagination.setCountPages(dataProducts.countPages);
                pagination.setCurrentPage(PAGE_FIRST);
                category.setSelectedCategory(categoryItem);
            const dataType = await fetchTypes(categoryItem.id, 0);
                type.setTypes(dataType.types);
            const dataBrands = await fetchBrands(categoryItem.id);
                brand.setBrandsByCategory(dataBrands.brands);
            navigate(CATEGORY_ROUTE);
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
                navigate(ERROR_ROUTE);
        }
    }

    return (
        <Col
            onClick={() => getCategory()}
        >
            <Image
                className='imgCarouselHome'
                key={categoryItem.id}
                src={PICTURE(categoryItem.img)}
                alt={categoryItem.name}
                
            />
            <Carousel.Caption>
                <h1 className='category-nameHome' >{categoryItem.name}</h1>
                <h3 className='category-shortDescriptionHome'>{categoryItem.shortDescription}</h3>
            </Carousel.Caption>
        </Col > 
    );
});

export default CategoryPopularComponent;