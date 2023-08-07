import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Context } from '../../index';
import { CATEGORY_ROUTE, ERROR_ROUTE } from '../../utils/constRoutes';
import { fetchProductsCategory } from '../../http/categoryApi';
import { fetchTypes } from '../../http/typeApi';
import { fetchBrands } from '../../http/brandApi';
import './css/NavBar.css'
import { PAGE_FIRST, UNREGISTERED } from '../../utils/const';

const CategoryDropdown = observer(({categoryItem}) => {
    const { product, category, brand, type, auth, messages, pagination } = useContext(Context);
    const navigate = useNavigate();

    const getCategory = async () => {
        try {      
            const dataType = await fetchTypes(categoryItem.id, 0);
                type.setTypes(dataType.types);
            const role = !auth?.auth?.role ? UNREGISTERED : auth.auth.role;
            const dataProducts = await fetchProductsCategory(categoryItem.id, role, PAGE_FIRST);
                product.setProducts(dataProducts.products);
                pagination.setCurrentPage(PAGE_FIRST);
                pagination.setCountPages(dataProducts.countPages);
                category.setSelectedCategory(categoryItem);

            const dataBrands = await fetchBrands(categoryItem.id);
                brand.setBrandsByCategory(dataBrands.brands);

            navigate(CATEGORY_ROUTE);
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
                navigate(ERROR_ROUTE);
        }
    }

    return (
        <NavDropdown.Item onClick={() => getCategory()}>
            {categoryItem.name}
        </NavDropdown.Item>
    );
});

export default CategoryDropdown;