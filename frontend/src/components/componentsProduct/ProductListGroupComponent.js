import { observer } from 'mobx-react-lite';
import React from 'react';
import { useContext, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Context } from '../../index';
import CreateProduct from './CreateProduct';
import SortForm from '../componentsSort/SortForm';
import BrandChangeProductsComponent from '../componentsBrand/BrandChangeProductsComponent';
import CategoryChangeProductsComponent from '../componentsCategory/CategoryChangeProductsComponent';
import TypeChangeProductsComponent from '../componentsType/TypeChangeProductsComponent';
import { PAGE_FIRST, PROPERTY_TITLE_PRODUCTS } from '../../utils/const';
import { fetchProducts } from '../../http/productApi';
import { fetchBrands } from '../../http/brandApi';
import { fetchCategories } from '../../http/categoryApi';
import { fetchTypes } from '../../http/typeApi';
import '../../pages/admin/css/AdminPage.css';
import RemoveProductsByBrandComponent from '../componentsBrand/RemoveProductsByBrandComponent';

const ProductListGroupComponent = observer(() => {
    const { product, sort, 
        messages, pagination, 
        search, brand, 
        category, type } = useContext(Context);
    const [sortVisible, setSortVisible] = useState(false);
    const [createVisible, setCreateVisible] = useState(false);
    const [brandChangeProducts, setBrandChangeProducts] = useState(false);
    const [categoryChangeProducts, setCategoryChangeProducts] = useState(false);
    const [typeChangeProducts, setTypeChangeProducts] = useState(false);
    const [removeProductsByBrand, setRemoveProductsByBrand] = useState(false);

    const cleanSearchAndSort = () => {
        sort.setFieldName('');
        sort.setTypeSort('');
        search.setSearchBy('');
        search.setSelectedSearchParameter('');
    }

    const sortClick = () => {
        sort.setFieldNames(PROPERTY_TITLE_PRODUCTS);
            setSortVisible(true);
    }

    const allProducts = async () => {
        cleanSearchAndSort();
        pagination.setCurrentPage(PAGE_FIRST);
        const data = await fetchProducts(pagination.currentPage);
            product.setProducts(data.products);
            pagination.setCountPages(data.countPages);
    }

    const createProduct = async () => {
        setCreateVisible(true);
        cleanSearchAndSort();
    }

    const clickBrandChangeProducts = async () => {
        try {
            const data = await fetchBrands(0);
                brand.setBrands(data.brands);
                setBrandChangeProducts(true);
        } catch (e) {

            messages.setMessageError(e?.response?.data?.message);
        }
    }

    const clickCategoryChangeProducts = async () => {
        try {
            const data = await fetchCategories(0);
                category.setCategories(data.categories);
                setCategoryChangeProducts(true);
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
        }
    }

    const clickTypeChangeProducts = async () => {
        try {
            const data = await fetchTypes(0, 0);
                type.setTypes(data.types);
                setTypeChangeProducts(true);
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
        }
    }

    const clickRemoveProductsByBrand = async () => {
        try {
            const data = await fetchBrands(0);
                brand.setBrands(data.brands);
                setRemoveProductsByBrand(true);
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
        }
    }

    return (
        <ListGroup className='listgroup_button'> 
            <ListGroup.Item 
                className='listgroup_item_button'
                onClick={sortClick}
            >
                Sort Products
            </ListGroup.Item>
            <ListGroup.Item 
                className='listgroup_item_button' 
                onClick={allProducts}
            >
                All Products
            </ListGroup.Item>
            <ListGroup.Item 
                className='listgroup_item_button'
                onClick={createProduct}
            >
                New Product
            </ListGroup.Item>
            <ListGroup.Item 
                className='listgroup_item_button'
                onClick={clickBrandChangeProducts}
            >
                Brand change for all relevant products
            </ListGroup.Item>
            <ListGroup.Item 
                className='listgroup_item_button'
                onClick={clickCategoryChangeProducts}
            >
                Category change for all relevant products
            </ListGroup.Item>
            <ListGroup.Item 
                className='listgroup_item_button'
                onClick={clickTypeChangeProducts}
            >
                Type change for all relevant products
            </ListGroup.Item>
            <ListGroup.Item 
                className='listgroup_item_button'
                onClick={clickRemoveProductsByBrand}
            >
                Remove products by brand
            </ListGroup.Item>
            <ListGroup.Item 
                className='listgroup_item_button'
                onClick={clickTypeChangeProducts}
            >
                Remove products by category
            </ListGroup.Item>
            <ListGroup.Item 
                className='listgroup_item_button'
                onClick={clickTypeChangeProducts}
            >
                Remove products by type
            </ListGroup.Item>

            <CreateProduct show={createVisible} onHide={() => setCreateVisible(false)}/>
            <SortForm show={sortVisible} onHide={() => setSortVisible(false)} parameter='product'/>
            <BrandChangeProductsComponent show={brandChangeProducts} onHide={() => setBrandChangeProducts(false)}/>
            <RemoveProductsByBrandComponent show={removeProductsByBrand} onHide={() => setRemoveProductsByBrand(false)}/>
            <CategoryChangeProductsComponent show={categoryChangeProducts} onHide={() => setCategoryChangeProducts(false)}/>
            <TypeChangeProductsComponent show={typeChangeProducts} onHide={() => setTypeChangeProducts(false)}/>
           
        </ListGroup>
    );
});

export default ProductListGroupComponent;