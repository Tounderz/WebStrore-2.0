import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { fetchTableCategories } from '../../http/categoryApi';
import { fetchTableBrands } from '../../http/brandApi';
import { fetchTableTypes } from '../../http/typeApi';
import { fetchProducts } from '../../http/productApi';
import { BRAND, CATEGORY, GENDER, 
    PAGE_FIRST, PRODUCT,  ROLE,  
    TYPE, USER } from '../../utils/const';
import { fetchUsers } from '../../http/userApi';
import { fetchRoles } from '../../http/roleApi';
import { fetchGenders } from '../../http/genderApi';
import { Context } from '../../index';
import UserTablePage from './UserTablePage';
import './css/AdminPage.css';
import ProductTablePage from './ProductTablePage';
import CategoryTablePage from './CategoryTablePage';
import BrandTablePage from './BrandTablePage';
import TypeTablePage from './TypeTablePage';
import RoleTablePage from './RoleTablePage';
import GenderTablePage from './GenderTablePage';

const AdminPage = observer(() => {
    const { product, user, messages, 
        category, brand, type, 
        search, role, gender, 
        pagination, sort } = useContext(Context);
    const [ tableName, setTableName ] = useState();

    const getCategories = async () => {
        try {
            const data = await fetchTableCategories(PAGE_FIRST);
                category.setTableCategories(data.categories);
                paginationParameters(data.countPages);
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
        } finally {
            cleanSearchAndSort();
            setTableName(CATEGORY);
        }
    }

    const getBrands = async () => {
        try {
            const data = await fetchTableBrands(PAGE_FIRST);
                brand.setTableBrands(data.brands);
            paginationParameters(data.countPages);
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
        } finally {
            cleanSearchAndSort();
            setTableName(BRAND);
        }
    };

    const getTypes = async () => {
        try {
            const data = await fetchTableTypes(PAGE_FIRST);
                type.setTableTypes(data.types);
                paginationParameters(data.countPages);
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
        } finally {
            cleanSearchAndSort();
            setTableName(TYPE);
        }
    };

    const getProducts = async () => {
        try {
            const data = await fetchProducts(PAGE_FIRST);
                product.setProducts(data.products);
            paginationParameters(data.countPages);
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
        } finally {
            setTableName(PRODUCT);
            cleanSearchAndSort();
        }
    };

    const getUsers = async () => {
        try {
            const data = await fetchUsers(PAGE_FIRST);
                user.setUsersList(data.usersList);
                paginationParameters(data.countPages);
            const dataRole = await fetchRoles(0);
                role.setRoles(dataRole.roles);
            const dataGender = await fetchGenders(0);
                gender.setGenders(dataGender.genders);
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
        } finally {
            setTableName(USER);
            cleanSearchAndSort();
        }
    }

    const getGenders = async () => {
        try {
            const data = await fetchGenders(PAGE_FIRST);
                gender.setGenders(data.genders);
            paginationParameters(data.countPages);
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
        } finally {
            setTableName(GENDER);
            cleanSearchAndSort();
        }
    }

    const getRoles = async () => {
        try {
            const data = await fetchRoles(PAGE_FIRST);
                role.setRoles(data.roles);
            paginationParameters(data.countPages);
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
        } finally {
            setTableName(ROLE);
            cleanSearchAndSort();
        }
    }

    const paginationParameters = (countPages) => {
        pagination.setCountPages(countPages);
        pagination.setCurrentPage(PAGE_FIRST);
        messages.setMessageError('');
    };

    const cleanSearchAndSort = () => {
        sort.setFieldNames([]);
        sort.setFieldName('');
        sort.setTypeSort('');
        search.setSearchBy('');
        search.setSelectedSearchParameter('');
    }

    let table;
    if (tableName === CATEGORY) {
        table = <CategoryTablePage/>
    } else if(tableName === BRAND) {
        table = <BrandTablePage/>
    } else if(tableName === TYPE) {
        table = <TypeTablePage/>
    } else if(tableName === PRODUCT) {
        table = <ProductTablePage/>
    } else if (tableName === USER) {
        table = <UserTablePage/>
    } else if (tableName === GENDER ) {
        table = <GenderTablePage/>
    } else if (tableName === ROLE) {
        table = <RoleTablePage/>
    }

    return (
        <Row className='fon_admin_page'>
            <Col md={2} className='col_listgroup_table'>
                <ListGroup className="listgroup_table"> 
                    <ListGroup.Item
                        className={`listgroup_item ${tableName === CATEGORY ? 'active' : ''}`}
                        onClick={() => getCategories()}
                    >
                        Categories
                    </ListGroup.Item>
                    <ListGroup.Item
                        className={`listgroup_item ${tableName === BRAND ? 'active' : ''}`}
                        onClick={() => getBrands()}
                    >
                        Brands
                    </ListGroup.Item>
                    <ListGroup.Item
                        className={`listgroup_item ${tableName === TYPE ? 'active' : ''}`}
                        onClick={() => getTypes()}
                    >
                        Types
                    </ListGroup.Item>
                    <ListGroup.Item
                        className={`listgroup_item ${tableName === PRODUCT ? 'active' : ''}`}
                        onClick={() => getProducts()}
                    >
                        Products
                    </ListGroup.Item>
                    <ListGroup.Item
                        className={`listgroup_item ${tableName === USER ? 'active' : ''}`}
                        onClick={() => getUsers()}
                    >
                        Users
                    </ListGroup.Item>
                    <ListGroup.Item
                        className={`listgroup_item ${tableName === GENDER ? 'active' : ''}`}
                        onClick={() => getGenders()}
                    >
                        Genders
                    </ListGroup.Item>
                    <ListGroup.Item
                        className={`listgroup_item ${tableName === ROLE ? 'active' : ''}`}
                        onClick={() => getRoles()}
                    >
                        Roles
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col className='col_table_admin' md={10}>
                {table}
            </Col>
        </Row>
    );
});

export default AdminPage;