import React, { useContext } from 'react';
import { Col, Row, Image, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { fetchProductsBrand } from '../../http/brandApi';
import { fetchCategories } from '../../http/categoryApi';
import { Context } from '../../index';
import { BRAND_ROUTE } from '../../utils/constRoutes';
import './css/BrandInfoPage.css'
import { observer } from 'mobx-react-lite';
import { PICTURE } from '../../utils/constFunctions';
import { UNREGISTERED } from '../../utils/const';

const BrandInfoPage = observer(() => {
    const { product, brand, category, auth, pagination } = useContext(Context);
    const navigate = useNavigate();

    const click = async () => {
        const role = !auth?.auth?.role ? UNREGISTERED : auth.auth.role;
        const dataProducts = await fetchProductsBrand(brand.selectedBrand.id, role, pagination.currentPage);
            product.setProducts(dataProducts.products);
            pagination.setCountPages(dataProducts.countPages);

        const dataCategories = await fetchCategories(brand.selectedBrand.id);
            category.setCategoriesByBrand(dataCategories.categories);

        navigate(BRAND_ROUTE);
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
                    {brand.selectedBrand.name}
                </h3>
                <Image
                    key={brand.selectedBrand.id}
                    src={PICTURE(brand.selectedBrand.img)}
                    className='imgInfoPage'
                />
            </Col>
            <Col 
                md={6} 
                className='colInfoPage'
            >
                <h3 
                    className='textInfo'
                >
                    Info
                </h3>
                {brand.selectedBrand.info}
            </Col>
            <Nav.Link 
                className='navLinkInfo'
                onClick={click}
            >
                Back to {brand.selectedBrand.name}
            </Nav.Link>
        </Row>
    );
});

export default BrandInfoPage;