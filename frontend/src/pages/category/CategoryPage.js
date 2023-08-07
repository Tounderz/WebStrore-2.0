import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Context } from '../../index';
import ProductComponent from '../../components/componentsProduct/ProductComponent';
import TypeComponent from '../../components/componentsType/TypeComponent';
import { fetchProductsCategory, fetchProductsCategoryByBrand } from '../../http/categoryApi';
import { BRANDS_BY_CATEGORY_ROUTE, CATEGORY_INFO_ROUTE, ERROR_ROUTE } from '../../utils/constRoutes';
import Multiselect from 'multiselect-react-dropdown';
import { useNavigate } from 'react-router';
import { useInput } from '../../utils/validate';
import './css/CategoryPage.css'
import { SvgSelector } from '../../components/Svg/SvgSelector';
import PaginationComponent from '../../components/componentsPagination/PaginationComponent';
import { PAGE_FIRST, UNREGISTERED } from '../../utils/const';

const CategoryPage = observer(() => {
    const { product, category, brand, type, auth, messages, pagination } = useContext(Context);
    const navigate = useNavigate();
    const brandsId = useInput([]);

    const paginationClick = async () => {
        const role = !auth?.auth?.role ? UNREGISTERED : auth.auth.role;
        const data = await fetchProductsCategory(category.selectedCategory.id, role, pagination.currentPage);
            product.setProducts(data.products);
            category.setCategoriesByBrand(data.categoriesByBrand);
            pagination.setCountPages(data.countPages);
    }

    const viewBrand = async () => {
        try {
            brand.setBrandsByType(brandsId.value);
            const dataProducts = await fetchProductsCategoryByBrand(category.selectedCategory.id, brandsId.value, PAGE_FIRST);
                product.setProducts(dataProducts.products);
                pagination.setCountPages(dataProducts.countPages);
                pagination.setCurrentPage(PAGE_FIRST);
                type.setTypes(dataProducts.types);
            navigate(BRANDS_BY_CATEGORY_ROUTE);
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
            navigate(ERROR_ROUTE)
        }
    }

    const infoCategory = () => {
        navigate(CATEGORY_INFO_ROUTE);
    }

    return (
        <Row className='categoryFonPage'>
            <Col 
                className='colMultiCategory'
                md={2}
            >
                <Card
                    className='cardMultiCategory'
                >
                    <Multiselect
                        className='multiselectCategory'
                        placeholder='Brands:'
                        displayValue='name'
                        value='id'
                        options={brand.brandsByCategory}
                        onSelect={e => brandsId.onSelect(e)}
                        onRemove={e => brandsId.onRemove(e)}
                        onBlur={e => brandsId.onBlur(e)}
                        showCheckbox
                    />
                    <Button
                        className='buttonMultiCategory'
                        variant='outline-primary'
                        disabled={brandsId.value.length === 0}
                        onClick={viewBrand}
                    >
                        View Brand
                    </Button>
                </Card>
                <Row
                    className='rowListGroupCategory'
                >
                    <ListGroup className='listGroupCategory'>
                        <ListGroup.Item 
                            disabled
                            key='id'
                            style={{ 
                                borderColor: 'white',
                                borderRadius: '5px',
                                background:'none',
                                color: 'white',
                            }}
                        >
                            Types:
                        </ListGroup.Item >
                        {type?.types?.map(typeItem => 
                            <TypeComponent key={typeItem.id} typeItem={typeItem} brandsId={[]}/>
                        )}
                    </ListGroup >
                </Row>
            </Col>
            <Col md={8}>
                <Row>
                    {product?.products?.map(item => (
                        <ProductComponent key={item.id} prod={item}/>
                    ))}
                </Row>
            </Col>
            <Col md={2}>
                <Button
                    className='buttonInfoCategory'
                    variant='link'
                    onClick={infoCategory}
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

export default CategoryPage;