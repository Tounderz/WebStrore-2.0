import React, { useContext } from 'react';
import { Col, Row, Image, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { fetchBrands } from '../../http/brandApi';
import { fetchProductsCategory } from '../../http/categoryApi';
import { fetchTypes } from '../../http/typeApi';
import { Context } from '../../index';
import { CATEGORY_ROUTE } from '../../utils/constRoutes';
import './css/CategoryInfoPage.css'
import { observer } from 'mobx-react-lite';
import { PICTURE } from '../../utils/constFunctions';
import { UNREGISTERED } from '../../utils/const';

const CategoryInfoPage = observer(() => {
    const { product, category, type, pagination, brand, auth } = useContext(Context);
    const navigate = useNavigate();

    const click = async () => {
        const dataType = await fetchTypes(category.selectedCategory.id, 0);
            type.setTypes(dataType.types);
        const role = !auth?.auth?.role ? UNREGISTERED : auth.auth.role;
        const dataProducts = await fetchProductsCategory(category.selectedCategory.id, role, pagination.currentPage);
            product.setProducts(dataProducts.products);
            brand.setSelectedBrand(dataProducts.brandsId);
            pagination.setCountPages(dataProducts.countPages);            

        const dataBrands = await fetchBrands(category.selectedCategory.id);
            brand.setBrandsByCategory(dataBrands.brands);

        navigate(CATEGORY_ROUTE);
    }

    return (
        <Row className='rowInfo'>
            <Col 
                md={6}
                className='colInfoPage'
            >
                <h3
                    className='textInfo'
                >
                    {category.selectedCategory.name}
                </h3>
                <Image
                    className='imgInfoPage'
                    key={category.selectedCategory.id}
                    src={PICTURE(category.selectedCategory.img)}
                />
            </Col>
            <Col 
                md={6} 
                className='colInfoPage'
            >
                <h3 className='textInfo'>Info</h3>
                {category.selectedCategory.info}
            </Col>
            <Nav.Link
                className='navLinkInfo'
                onClick={click}
            >
                Back to {category.selectedCategory.name}
            </Nav.Link>
        </Row>
    );
});

export default CategoryInfoPage;