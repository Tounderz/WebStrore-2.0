import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { ListGroup, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { fetchProductsBrand } from '../../http/brandApi';
import { fetchCategories } from '../../http/categoryApi';
import { Context } from '../../index';
import { BRAND_ROUTE, ERROR_ROUTE } from '../../utils/constRoutes';
import { PAGE_FIRST, UNREGISTERED } from '../../utils/const';
import { PICTURE } from '../../utils/constFunctions';
import '../../pages/home/css/HomePage.css';

const BrandPopularComponent = observer(({brandItem}) => {
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
            messages.setMessageError(e.response.data.message);
                navigate(ERROR_ROUTE);
        }
    }

    return (
        <ListGroup.Item 
            className='listBrandItemHome'
            onClick={() => getBrand()}
        >
                <Image
                    src={PICTURE(brandItem.img)}
                    className="listBarndImgHome"
                />
                <h4 className='listBrandNameHome'>
                    {brandItem.name}
                </h4>
        </ListGroup.Item>
    );
});

export default BrandPopularComponent;