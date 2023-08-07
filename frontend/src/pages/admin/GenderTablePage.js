import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Col, ListGroup, Row, Table } from 'react-bootstrap';
import SearchFormTable from '../../components/componentsSearchFormTable/SearchFormTable';
import { GENDER, PAGE_FIRST, PROPERTY_TITLE_GENDER } from '../../utils/const';
import GenderTableComponent from '../../components/componentsGender/GenderTableComponent';
import PaginationComponent from '../../components/componentsPagination/PaginationComponent';
import CreateGender from '../../components/componentsGender/CreateGender';
import SortForm from '../../components/componentsSort/SortForm';
import './css/AdminPage.css';
import { fetchGenders } from '../../http/genderApi';
import { Context } from '../../index';
import { fetchSearchGenders } from '../../http/searchApi';
import { sortGenders } from '../../http/sortApi';

const GenderTablePage = observer(() => {
    const { gender, sort, messages, pagination, search } = useContext(Context);
    const [sortVisible, setSortVisible] = useState(false);
    const [createVisible, setCreateVisible] = useState(false);

    const paginationClick = async () => {
        if (sort.typeSort !== '' || sort.fieldName !== '') {
            const data = await sortGenders(sort.fieldName, sort.typeSort, pagination.currentPage);
                gender.setGenders(data.genders);
        } else if (search.searchBy !== '' || search.selectedSearchParameter !== '') {
            const data = await fetchSearchGenders(search.selectedSearchParameter, pagination.currentPage, search.searchBy);
                gender.setGenders(data.genders);
        } else {
            const data = await fetchGenders(pagination.currentPage);
                gender.setGenders(data.genders);
        }
    };

    const sortClick = () => {
        sort.setFieldNames(PROPERTY_TITLE_GENDER);
            setSortVisible(true);
    }

    const allGenders = async () => {
        cleanSearchAndSort();
        const data = await fetchGenders(PAGE_FIRST);
            gender.setGenders(data.genders);
            pagination.setCountPages(data.countPages);
            pagination.setCurrentPage(PAGE_FIRST);
    }

    const createGender = async () => {
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
                        parameter={GENDER}
                        array={PROPERTY_TITLE_GENDER}
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
                        {gender?.genders?.map((item) => (
                            <GenderTableComponent key={item.id} item={item}/>
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
                            Sort Gender
                        </ListGroup.Item>
                        <ListGroup.Item
                            className='listgroup_item_button'
                            onClick={() => allGenders()}
                        >
                            All Genders
                        </ListGroup.Item>
                        <ListGroup.Item 
                            className='listgroup_item_button'
                            onClick={() => createGender()}
                        >
                            New Gender
                        </ListGroup.Item>
                    </ListGroup>
            </Col>
            <CreateGender show={createVisible} onHide={() => setCreateVisible(false)}/>
            <SortForm show={sortVisible} onHide={() => setSortVisible(false)} parameter={GENDER} />
        </Row>
    );
});

export default GenderTablePage;