import { observer } from 'mobx-react-lite';
import React, { useState, useContext } from 'react';
import { Col, ListGroup, Row, Table } from 'react-bootstrap';
import SearchFormTable from '../../components/componentsSearchFormTable/SearchFormTable';
import PaginationComponent from '../../components/componentsPagination/PaginationComponent';
import CreateCategory from '../../components/componentsCategory/CreateCategory';
import SortForm from '../../components/componentsSort/SortForm';
import { Context } from '../../index';
import { fetchTableCategories } from '../../http/categoryApi';
import './css/AdminPage.css';
import CategoryTableComponent from '../../components/componentsCategory/CategoryTableComponent';
import { sortCategories } from '../../http/sortApi';
import { fetchSearchCategory } from '../../http/searchApi';
import { CATEGORY, PAGE_FIRST, PROPERTY_TITLE_CATEGORY } from '../../utils/const';

const CategoryTablePage = observer(() => {
    const { category, sort, messages, pagination, search } = useContext(Context);
    const [sortVisible, setSortVisible] = useState(false);
    const [createVisible, setCreateVisible] = useState(false);

    const paginationClick = async () => {
        if (sort.typeSort !== '' || sort.fieldName !== '') {
            const data = await sortCategories(sort.fieldName, sort.typeSort, pagination.currentPage);
                category.setTableCategories(data.brands);
        } else if (search.searchBy !== '' || search.selectedSearchParameter !== '') {
            const data = await fetchSearchCategory(search.selectedSearchParameter, pagination.currentPage, search.searchBy);
                category.setTableCategories(data.brands);
        } else {
            const data = await fetchTableCategories(pagination.currentPage);
                category.setTableCategories(data.brands);
        }
    };

    const sortClick = () => {
        sort.setFieldNames(PROPERTY_TITLE_CATEGORY);
            setSortVisible(true);
    }

    const allCategory = async () => {
        cleanSearchAndSort();
        const data = await fetchTableCategories(PAGE_FIRST);
            category.setProducts(data.categories);
            pagination.setCountPages(data.countPages);
            pagination.setCurrentPage(PAGE_FIRST);
    }

    const createCategory = async () => {
        setCreateVisible(true);
        cleanSearchAndSort();
    }

    const cleanSearchAndSort = () => {
        sort.setFieldNames([]);
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
                        parameter={CATEGORY}
                        array={PROPERTY_TITLE_CATEGORY}
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
                            <th scope='col'>Short Description</th>
                            <th scope='col'>Count View</th>
                            <th scope='col'>Edit</th>
                            <th scope='col'>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {category?.tableCategories?.map((item) => (
                            <CategoryTableComponent key={item.id} item={item}/>
                        ))}
                    </tbody>
                </Table>
                <Row onClick={paginationClick}>
                    <PaginationComponent/>
                </Row>
            </Col>
            <Col md={2}>
                <ListGroup className='listgroup_button'> 
                        <ListGroup.Item className='listgroup_item_button' action onClick={() => sortClick()}>
                            Sort Category
                        </ListGroup.Item>
                        <ListGroup.Item className='listgroup_item_button' action onClick={() => allCategory()}>
                            All Categories
                        </ListGroup.Item>
                        <ListGroup.Item className='listgroup_item_button'action onClick={() => createCategory()}>
                            New Category
                        </ListGroup.Item>
                    </ListGroup>
            </Col>
            <CreateCategory show={createVisible} onHide={() => setCreateVisible(false)}/>
            <SortForm show={sortVisible} onHide={() => setSortVisible(false)} parameter={CATEGORY}/>
        </Row>
    );
});

export default CategoryTablePage;