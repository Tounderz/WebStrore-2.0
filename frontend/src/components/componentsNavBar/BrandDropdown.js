import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { fetchProductsBrand } from '../../http/brandApi';
import { fetchCategories } from '../../http/categoryApi';
import { Context } from '../../index';
import { BRAND_ROUTE, ERROR_ROUTE } from '../../utils/constRoutes';
import './css/NavBar.css'
import { PAGE_FIRST, UNREGISTERED } from '../../utils/const';

const BrandDropdown = observer(({brandItem}) => {
    const { product, category, brand, auth, messages, pagination } = useContext(Context);
    const navigate = useNavigate();

    const getBrand = async () => {
        try {
            brand.setSelectedBrand(brandItem);
            const role = !auth?.auth?.role ? UNREGISTERED : auth.auth.role;
            const dataProducts = await fetchProductsBrand(brand.selectedBrand.id, role, PAGE_FIRST);
                product.setProducts(dataProducts.products);
                pagination.setCurrentPage(PAGE_FIRST);
                pagination.setCountPages(dataProducts.countPages);
            const dataCatgories = await fetchCategories(brand.selectedBrand.id);
                category.setCategoriesByBrand(dataCatgories.categories);
                navigate(BRAND_ROUTE);
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
                navigate(ERROR_ROUTE);
        }
    }

    return (
        <NavDropdown.Item className='navDropdown-item' onClick={() => getBrand()}>
            {brandItem.name}
        </NavDropdown.Item>
    );
});

export default BrandDropdown;