import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import './css/AdminPage.css';
import { Context } from '../../index';
import { Col, ListGroup, Row, Table } from 'react-bootstrap';
import SearchFormTable from '../../components/componentsSearchFormTable/SearchFormTable';
import { PAGE_FIRST, PROPERTY_TITLE_ROLE, ROLE } from '../../utils/const';
import RoleTableComponent from '../../components/componentsRoles/RoleTableComponent';
import PaginationComponent from '../../components/componentsPagination/PaginationComponent';
import { fetchRoles } from '../../http/roleApi';
import CreateRole from '../../components/componentsRoles/CreateRole';
import SortForm from '../../components/componentsSort/SortForm';

const RoleTablePage = observer(() => {
    const { role, sort, messages, pagination, search } = useContext(Context);
    const [sortVisible, setSortVisible] = useState(false);
    const [createVisible, setCreateVisible] = useState(false);

    const paginationClick = async () => {
        if (sort.typeSort !== '' || sort.fieldName !== '') {
            // const data = await sortBrands(sort.fieldName, sort.typeSort, pagination.currentPage);
            //     role.setRoles(data.roles);
        } else if (search.searchBy !== '' || search.selectedSearchParameter !== '') {
            // const data = await fetchSearchBrand(search.selectedSearchParameter, pagination.currentPage, search.searchBy);
            //     role.setRoles(data.roles);
        } else {
            const data = await fetchRoles(pagination.currentPage);
                role.setRoles(data.roles);
        }
    };

    const sortClick = () => {
        sort.setFieldNames(PROPERTY_TITLE_ROLE);
            setSortVisible(true);
    }

    const allRoles = async () => {
        cleanSearchAndSort();
        const data = await fetchRoles(PAGE_FIRST);
            role.setRoles(data.roles);
            pagination.setCountPages(data.countPages);
            pagination.setCurrentPage(PAGE_FIRST);
    }

    const createRole = async () => {
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
                        parameter={ROLE}
                        array={PROPERTY_TITLE_ROLE}
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
                            <th scope='col'>Edit</th>
                            <th scope='col'>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {role?.roles?.map((item) => (
                            <RoleTableComponent key={item.id} item={item}/>
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
                            Sort Role
                        </ListGroup.Item>
                        <ListGroup.Item
                            className='listgroup_item_button'
                            onClick={() => allRoles()}
                        >
                            All Roles
                        </ListGroup.Item>
                        <ListGroup.Item 
                            className='listgroup_item_button'
                            onClick={() => createRole()}
                        >
                            New Role
                        </ListGroup.Item>
                    </ListGroup>
            </Col>
            <CreateRole show={createVisible} onHide={() => setCreateVisible(false)}/>
            <SortForm show={sortVisible} onHide={() => setSortVisible(false)} parameter={ROLE} />
        </Row>
    );
});

export default RoleTablePage;