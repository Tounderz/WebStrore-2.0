import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Col, ListGroup, Row, Table } from 'react-bootstrap';
import { Context } from '../../index';
import TypeTableComponent from '../../components/componentsType/TypeTableComponent';
import CreateType from '../../components/componentsType/CreateType';
import SortForm from '../../components/componentsSort/SortForm';
import SearchFormTable from '../../components/componentsSearchFormTable/SearchFormTable';
import PaginationComponent from '../../components/componentsPagination/PaginationComponent';
import './css/AdminPage.css';
import { PAGE_FIRST, PROPERTY_TITLE_TYPE, TYPE } from '../../utils/const';
import { fetchTableTypes } from '../../http/typeApi';
import { sortTypes } from '../../http/sortApi';
import { fetchSearchType } from '../../http/searchApi';

const TypeTablePage = observer(() => {
    const { type, sort, messages, pagination, search } = useContext(Context);
    const [sortVisible, setSortVisible] = useState(false);
    const [createVisible, setCreateVisible] = useState(false);

    const paginationClick = async () => {
        if (sort.typeSort !== '' || sort.fieldName !== '') {
            const data = await sortTypes(sort.fieldName, sort.typeSort, pagination.currentPage);
                type.setTableTypes(data.types);
        } else if (search.searchBy !== '' || search.selectedSearchParameter !== '') {
            const data = await fetchSearchType(search.selectedSearchParameter, pagination.currentPage, search.searchBy);
                type.setTableTypes(data.types);
        } else {
            const data = await fetchTableTypes(pagination.currentPage);
                type.setTableTypes(data.types);
        }
    };

    const sortClick = () => {
        sort.setFieldNames(PROPERTY_TITLE_TYPE);
        setSortVisible(true);
    }

    const allTypes = async () => {
        cleanSearchAndSort();
        const data = await fetchTableTypes(PAGE_FIRST);
            type.setTableTypes(data.types);
            pagination.setCountPages(data.countPages);
            pagination.setCurrentPage(PAGE_FIRST);
    }

    const createType = async () => {
        setCreateVisible(true);
        cleanSearchAndSort();
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
                        parameter={TYPE}
                        array={PROPERTY_TITLE_TYPE}
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
                            <th scope='col'>Category</th>
                            <th scope='col'>Name</th>
                            <th scope='col'>Edit</th>
                            <th scope='col'>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {type?.tableTypes?.map((item) => (
                            <TypeTableComponent key={item.id} item={item}/>
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
                            Sort Type
                        </ListGroup.Item>
                        <ListGroup.Item className='listgroup_item_button' action onClick={() => allTypes()}>
                            All Types
                        </ListGroup.Item>
                        <ListGroup.Item className='listgroup_item_button'action onClick={() => createType()}>
                            New Type
                        </ListGroup.Item>
                    </ListGroup>
            </Col>
            <CreateType show={createVisible} onHide={() => setCreateVisible(false)}/>
            <SortForm show={sortVisible} onHide={() => setSortVisible(false)} parameter={TYPE}/>
        </Row>
    );
});

export default TypeTablePage;