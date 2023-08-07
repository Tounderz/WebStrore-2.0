import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Row, Col, Table, ListGroup } from 'react-bootstrap';
import { useContext } from 'react';
import { Context } from '../../index';
import { fetchBrands, fetchTableBrands } from '../../http/brandApi';
import { sortBrands } from '../../http/sortApi';
import { fetchSearchBrand } from '../../http/searchApi';
import { BRAND, PAGE_FIRST, PROPERTY_TITLE_BRAND } from '../../utils/const';
import BrandTableComponent from '../../components/componentsBrand/BrandTableComponent';
import CreateBrand from '../../components/componentsBrand/CreateBrand';
import SortForm from '../../components/componentsSort/SortForm';
import SearchFormTable from '../../components/componentsSearchFormTable/SearchFormTable';
import PaginationComponent from '../../components/componentsPagination/PaginationComponent';
import './css/AdminPage.css';
import BrandChangeCategoriesComponent from '../../components/componentsBrand/BrandChangeCategoriesComponent';

const BrandTablePage = observer(() => {
    const { brand, sort, messages, pagination, search } = useContext(Context);
    const [sortVisible, setSortVisible] = useState(false);
    const [createVisible, setCreateVisible] = useState(false);
    const [brandChangeCategories, setBrandChangeCategories] = useState(false);

    const paginationClick = async () => {
        if (sort.typeSort !== '' || sort.fieldName !== '') {
            const data = await sortBrands(sort.fieldName, sort.typeSort, pagination.currentPage);
                brand.setTableBrands(data.brands);
        } else if (search.searchBy !== '' || search.selectedSearchParameter !== '') {
            const data = await fetchSearchBrand(search.selectedSearchParameter, pagination.currentPage, search.searchBy);
                brand.setTableBrands(data.brands);
        } else {
            const data = await fetchTableBrands(pagination.currentPage);
                brand.setTableBrands(data.brands);
        }
    };

    const sortClick = () => {
        sort.setFieldNames(PROPERTY_TITLE_BRAND);
            setSortVisible(true);
    }

    const allBrands = async () => {
        cleanSearchAndSort();
        const data = await fetchTableBrands(PAGE_FIRST);
            brand.setTableBrands(data.brands);
            pagination.setCountPages(data.countPages);
            pagination.setCurrentPage(PAGE_FIRST);
    }

    const createBrand = async () => {
        setCreateVisible(true);
        cleanSearchAndSort();
    }

    const clickBrandChangeCategories = async () => {
        try {
            const data = await fetchBrands(0);
                brand.setBrands(data.brands);
                setBrandChangeCategories(true);
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
        }
    }

    const cleanSearchAndSort = () => {
        sort.setFieldName('');
        sort.setTypeSort('');
        search.setSearchBy('');
        search.setSelectedSearchParameter('');
    }

    return (
        <Row className='table'>
            <Row>
                {messages.messageError !== '' ? 
                    <div 
                        className='error_message'
                    >
                        {messages.messageError}
                    </div>
                    :
                    ''
                }
                <Col md={6}>
                    <SearchFormTable 
                        key='id'
                        parameter={BRAND}
                        array={PROPERTY_TITLE_BRAND}
                    />
                </Col>
            </Row>
            <Col md={10}>
                <Table
                    className='table'
                    size='sm'
                >
                    <thead>
                        <tr key='id'>
                            <th scope='col'>Id</th>
                            <th scope='col'>Name</th>
                            <th scope='col'>Count View</th>
                            <th scope='col'>Edit</th>
                            <th scope='col'>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brand?.tableBrands?.map((item) => (
                            <BrandTableComponent key={item.id} item={item}/>
                        ))}
                    </tbody>
                </Table>
                <Row onClick={paginationClick}>
                    <PaginationComponent/>
                </Row>
            </Col>
            <Col md={2}>
                <ListGroup className='listgroup_button'> 
                        <ListGroup.Item 
                            className='listgroup_item_button' 
                            onClick={() => sortClick()}
                        >
                            Sort Brand
                        </ListGroup.Item>
                        <ListGroup.Item
                            className='listgroup_item_button'
                            onClick={() => allBrands()}
                        >
                            All Brands
                        </ListGroup.Item>
                        <ListGroup.Item 
                            className='listgroup_item_button'
                            onClick={() => createBrand()}
                        >
                            New Brand
                        </ListGroup.Item>
                        <ListGroup.Item
                            className='listgroup_item_button'
                            onClick={() => clickBrandChangeCategories()}
                        >
                            Brand change for all relevant categories
                        </ListGroup.Item>
                    </ListGroup>
            </Col>
            <CreateBrand show={createVisible} onHide={() => setCreateVisible(false)}/>
            <SortForm show={sortVisible} onHide={() => setSortVisible(false)} parameter={BRAND} />
            <BrandChangeCategoriesComponent show={brandChangeCategories} onHide={() => setBrandChangeCategories(false)}/>
        </Row>
    );
});

export default BrandTablePage;