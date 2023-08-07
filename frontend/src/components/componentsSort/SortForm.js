import React, { useContext } from 'react';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import { Context } from '../../index';
import { sortBrands, sortCategories, sortGenders, 
    sortProducts, sortRoles, sortTypes, sortUsers } from '../../http/sortApi';
import { useInput } from '../../utils/validate';
import { observer } from 'mobx-react-lite';
import { BRAND, CATEGORY, GENDER, PAGE_FIRST, 
    PRODUCT, ROLE, SELECT_FIELD_NAME, SELECT_TYPE_SORT, 
    TYPE, TYPES_SORT, USER } from '../../utils/const';
import './css/SortForm.css';

const SortForm = observer(({show, onHide, parameter}) => {
    const { product, messages, user, 
        sort, pagination, search, 
        brand, category, type, 
        role, gender } = useContext(Context);
    const fieldName = useInput('', {minLength: {value: 2, name: 'Field Name'}});
    const typeSort = useInput('', {minLength: {value: 2, name: 'Type Sort'}});

    const sortClick = async () => {
        cleanSearch();
        switch(parameter) {
            case PRODUCT:
                try {
                    const data = await sortProducts(fieldName.value, typeSort.value, PAGE_FIRST);
                        product.setProducts(data.products);
                    paginationParameter(data.countPages);
                    sortParameter();
                } catch (e) {
                    product.setProducts([]);
                    paginationParameter(1);
                    cleanSortParameter();
                    messages.setMessageError(e?.response?.data?.message);
                }
                break;
            case USER:
                try {
                    const data = await sortUsers(fieldName.value, typeSort.value, PAGE_FIRST);
                        user.setUsersList(data.usersList);
                    paginationParameter(data.countPages);
                    sortParameter();
                } catch (e) {
                    user.setUsersList([]);
                    paginationParameter(1);
                    cleanSortParameter();
                    messages.setMessageError(e?.response?.data?.message);
                }
                break;
            case BRAND:
                try {
                    const data = await sortBrands(fieldName.value, typeSort.value, PAGE_FIRST);
                        brand.setTableBrands(data.brands);
                    paginationParameter(data.countPages);
                    sortParameter();
                } catch (e) {
                    brand.setTableBrands([]);
                    paginationParameter(1);
                    cleanSortParameter();
                    messages.setMessageError(e?.response?.data?.message);
                }
                break;
            case CATEGORY:
                try {
                    const data = await sortCategories(fieldName.value, typeSort.value, PAGE_FIRST);
                        category.setTableCategories(data.categories);
                    paginationParameter(data.countPages);
                    sortParameter();
                } catch (e) {
                    brand.setTableCategories([]);
                    paginationParameter(1);
                    cleanSortParameter();
                    messages.setMessageError(e?.response?.data?.message);
                }
                break;
            case TYPE:
                try {
                    const data = await sortTypes(fieldName.value, typeSort.value, PAGE_FIRST);
                        type.setTableTypes(data.types);
                    paginationParameter(data.countPages);
                    sortParameter();
                } catch (e) {
                    brand.setTableCategories([]);
                    paginationParameter(1);
                    cleanSortParameter();
                    messages.setMessageError(e?.response?.data?.message);
                }
                break;
            case ROLE:
                try {
                    const data = await sortRoles(fieldName.value, typeSort.value, PAGE_FIRST);
                        role.setRoles(data.roles);
                        paginationParameter(data.countPages);
                        sortParameter();
                } catch (e) {
                    messages.setMessageError(e?.response?.data?.message);
                    role.setRoles([]);
                    paginationParameter(1);
                    cleanSortParameter();
                }
            case GENDER:
                try {
                    const data = await sortGenders(fieldName.value, typeSort.value, PAGE_FIRST);
                        gender.setGenders(data.genders);
                        paginationParameter(data.countPages);
                        sortParameter();
                } catch (e) {
                    messages.setMessageError(e?.response?.data?.message);
                    gender.setGenders([]);
                    paginationParameter(1);
                    cleanSortParameter();
                }
            default:
                break;
        }

        onHide();
    }

    const cleanSearch = () => {
        search.setSearchBy('');
        search.setSelectedSearchParameter('');
    }

    const cleanSortParameter = () => {
        document.getElementById(SELECT_FIELD_NAME).value = '0';
        fieldName.onChange('');
        document.getElementById(SELECT_TYPE_SORT).value = '0';
        typeSort.onChange('');
        onHide();
    }

    const paginationParameter = (countPages) => {
        pagination.setCountPages(countPages);
        pagination.setCurrentPage(PAGE_FIRST);
    }

    const sortParameter = () => {
        sort.setFieldName(fieldName.value);
        sort.setTypeSort(typeSort.value);
    }

    return (
        <Modal
            show={show}
            onHide={cleanSortParameter}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Sort {parameter}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {(fieldName.isDirty && fieldName.minLengthError) && 
                    <div className='error_message'>
                        {fieldName.messageError}
                    </div>}
                <FloatingLabel label='Selected field name'>
                    <Form.Select
                        id={SELECT_FIELD_NAME}
                        onChange={e => fieldName.onChange(e)}
                        onBlur={e => fieldName.onBlur(e)}
                        className='m-2'
                    >
                        <option
                            key='0'
                            value='0'
                        >
                            Select a field name
                        </option>
                        {sort.fieldNames.map(item =>
                            <option
                                key={item}
                                value={item}
                            >
                                {item}
                            </option>
                        )}
                    </Form.Select>
                </FloatingLabel>

                {(typeSort.isDirty && typeSort.minLengthError) && 
                    <div className='error_message'>
                        {typeSort.messageError}
                    </div>}
                <FloatingLabel label='Selected type sort'>
                    <Form.Select
                        id={SELECT_TYPE_SORT}
                        onChange={e => typeSort.onChange(e)}
                        onBlur={e => typeSort.onBlur(e)}
                        className='m-2'
                    >
                        <option
                            key='0'
                            value='0'
                        >
                            Select a type sort
                        </option>
                        {TYPES_SORT.map(item =>
                            <option
                                key={item}
                                value={item}
                            >
                                {item}
                            </option>
                        )}
                    </Form.Select>
                </FloatingLabel>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant='link'
                    className='button_sort'
                    disabled={!typeSort.inputValid || !fieldName.inputValid}
                    onClick={sortClick}
                >
                    Sort
                </Button>
                <Button
                    variant='link'
                    className='button_sort_close'
                    onClick={cleanSortParameter}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default SortForm;