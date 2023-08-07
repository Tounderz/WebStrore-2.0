import React, { useContext, useState } from "react";
import { Col, ListGroup, Row, Table } from "react-bootstrap";
import { sortUsers } from "../../http/sortApi";
import { fetchUsers } from "../../http/userApi";
import { Context } from "../../index";
import PaginationComponent from "../../components/componentsPagination/PaginationComponent";
import { observer } from "mobx-react-lite";
import SearchFormTable from "../../components/componentsSearchFormTable/SearchFormTable";
import { fetchSearchUsers } from "../../http/searchApi";
import UserTableComponent from "../../components/componentsUser/UserTableComponent";
import { PAGE_FIRST, PROPERTY_TITLE_USERS, PROPERTY_TITLE_USERS_SEARCH, USER } from "../../utils/const";
import './css/AdminPage.css'
import SortForm from "../../components/componentsSort/SortForm";
import CreateUserComponent from "../../components/componentsUser/CreateUserComponent";

const UserTablePage = observer(() => {
    const { user, sort, pagination, search, messages } = useContext(Context);
    const [sortVisible, setSortVisible] = useState(false);
    const [createVisible, setCreateVisible] = useState(false);
    
    const paginationClick = async () => {
        if (sort.typeSort !== '' || sort.fieldName !== '') {
            const data = await sortUsers(sort.fieldName, sort.typeSort, pagination.currentPage);
                user.setUsersList(data.usersList);
        } else if (search.searchBy !== '' || search.selectedSearchParameter !== '') {
            const data = await fetchSearchUsers(search.selectedSearchParameter, pagination.currentPage, search.searchBy);
                user.setUsersList(data.usersList);
        } else {
            const data = await fetchUsers(pagination.currentPage);
                user.setUsersList(data.usersList);
        }
    };

    const sortClick = () => {
        sort.setFieldNames(PROPERTY_TITLE_USERS);
            setSortVisible(true);
    }

    const allUsers = async () => {
        cleanSearchAndSort();
        const data = await fetchUsers(PAGE_FIRST);
            user.setUsersList(data.usersList);
            pagination.setCountPages(data.countPages);
            pagination.setCurrentPage(PAGE_FIRST);
    }

    const createUser = () => {
        setCreateVisible(true);
        cleanSearchAndSort();
    }

    const cleanSearchAndSort = () => {
        sort.setFieldName('');
        sort.setTypeSort('');
        sort.setFieldNames([]);
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
                        parameter={USER}
                        array={PROPERTY_TITLE_USERS_SEARCH}
                    />
                </Col>
            </Row>
            <Col md={10}>
                <Table
                    className='table'
                    size='sm'
                >
                    <thead>
                        <tr key="id">
                            <th scope='col'>Id</th>
                            <th scope='col'>Name</th>
                            <th scope='col'>LastName</th>
                            <th scope='col'>Gender</th>
                            <th scope='col'>Date of Birth</th>
                            <th scope='col'>Email</th>
                            <th scope='col'>Phone</th>
                            <th scope='col'>Login</th>
                            <th scope='col'>Role</th>
                            <th scope='col'>Confirm Email</th>
                            <th scope='col'>isDeleted</th>
                            <th scope='col'>Edit</th>
                            <th scope='col'>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.usersList.map((item) => (
                            <UserTableComponent key={item.id} item={item}/>
                            ))}
                    </tbody>
                </Table>
                <Row onClick={() => paginationClick()}>
                    <PaginationComponent/>
                </Row>
            </Col>
            <Col md={2}>
                <ListGroup className='listgroup_button'> 
                    <ListGroup.Item className='listgroup_item_button' action onClick={() => sortClick()}>
                        Sort Users
                    </ListGroup.Item>
                    <ListGroup.Item className='listgroup_item_button' action onClick={() => allUsers()}>
                        All Users
                    </ListGroup.Item>
                    <ListGroup.Item className='listgroup_item_button'action onClick={() => createUser()}>
                        New User
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <CreateUserComponent show={createVisible} onHide={() => setCreateVisible(false)}/>
            <SortForm show={sortVisible} onHide={() => setSortVisible(false)} parameter={USER}/>
        </Row>
    );
});

export default UserTablePage;
