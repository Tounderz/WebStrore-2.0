import { observer } from 'mobx-react-lite';
import Multiselect from 'multiselect-react-dropdown';
import React, { useContext } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import ProductComponent from '../../components/componentsProduct/ProductComponent';
import { fetchProductsBrand, fetchProductsBrandByCategory } from '../../http/brandApi';
import { useInput } from '../../utils/validate';
import { Context } from '../../index';
import { BRAND_INFO_ROUTE, CATEGORIES_BY_BRAND_ROUTE, ERROR_ROUTE } from '../../utils/constRoutes';
import './css/BrandPage.css'
import { SvgSelector } from '../../components/Svg/SvgSelector';
import PaginationComponent from '../../components/componentsPagination/PaginationComponent';
import { PAGE_FIRST, UNREGISTERED } from '../../utils/const';

const BrandPage = observer(() => {
    const { product, brand, category, type, auth, messages, pagination } = useContext(Context);
    const navigate = useNavigate();
    const categoriesId = useInput([]);
    
    const paginationClick = async () => {
        const role = !auth?.auth?.role ? UNREGISTERED : auth.auth.role;
        const data = await fetchProductsBrand(brand.selectedBrand.id, role, pagination.currentPage);
            product.setProducts(data.products);
            pagination.setCountPages(data.countPages);
    }

    const viewCategory = async () => {
        try {
            category.setCategoriesByBrand(categoriesId.value);
            const data = await fetchProductsBrandByCategory(brand.selectedBrand.id, categoriesId.value, PAGE_FIRST);
                product.setProducts(data.products);
                pagination.setCountPages(data.countPages);
                type.setTypes(data.types);
                pagination.setCurrentPage(PAGE_FIRST);
       
            navigate(CATEGORIES_BY_BRAND_ROUTE);
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
            navigate(ERROR_ROUTE)
        }
    }

    const infoBrand = () => {
        navigate(BRAND_INFO_ROUTE);
    }

    return (
        <Row className='brandFonPage'>         
            <Col 
                md={2}
                className='colMultiBrand'
            >
                <Card
                    className='cardBrand'
                >
                    <Multiselect
                        className='multiBrand'
                        placeholder='Categories:'
                        displayValue='name'
                        value='id'
                        options={category.categoriesByBrand}
                        onSelect={e => categoriesId.onSelect(e)}
                        onRemove={e => categoriesId.onRemove(e)}
                        onBlur={e => categoriesId.onBlur(e)}
                        showCheckbox
                    />
                    <Button
                        className='buttonBrand'
                        variant='outline-primary'
                        disabled={categoriesId.value.length === 0}
                        onClick={viewCategory}
                    >
                        View Category
                    </Button>
                </Card>
            </Col>
            <Col 
                md={8}
            >
                <Row>
                    {product.products.map(item => (
                        <ProductComponent key={item.id} prod={item}/>
                    ))}
                </Row>
            </Col>
            <Col md={2}>
                <Button
                    className='buttonInfoBrand'
                    variant='link'
                    onClick={infoBrand}
                >
                    <SvgSelector id='info'/>
                </Button>
            </Col>
            <Row onClick={() => paginationClick()}>
                <PaginationComponent/>
            </Row> 
        </Row>
    );
});

export default BrandPage;