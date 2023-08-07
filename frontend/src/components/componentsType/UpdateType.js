import React, { useContext, useState } from 'react';
import { Form, Modal, Button, FloatingLabel } from 'react-bootstrap';
import { fetchTableTypes, updateType } from '../../http/typeApi';
import { useInput } from '../../utils/validate';
import { Context } from '../../index';
import './css/UpdateType.css'
import { observer } from 'mobx-react-lite';
import { SELECT_CATEGORY } from '../../utils/const';
import { fetchSearchType } from '../../http/searchApi';
import { sortTypes } from '../../http/sortApi';

const UpdateType = observer(({show, onHide}) => {
    const { type, category, sort, search, pagination } = useContext(Context);
    const name = useInput('', {minLength: {value: 3, name: 'Name'}})
    const categoryId = useInput(0, {isNumberId: {name: 'Category'}});
    const [messageError, setMessageError] = useState('')

    const click = async () => {
        try {
            await updateType(type.selectedType.id, name.value, categoryId.value);
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
            close();
        } catch (e) {
            setMessageError(e?.response?.data?.message);
        }
    }

    const close = () => {
        name.onChange('');
        document.getElementById(SELECT_CATEGORY).value = '0';
        categoryId.onChange('');
        setMessageError('');
        onHide();
    }

    return (
        <Modal
            show={show}
            onHide={close}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title 
                    id='contained-modal-title-vcenter'
                >
                    Edit a Type: {type.selectedType.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='error_message'>{messageError}</div>
                <Form>
                    {(name.isDirty && name.minLengthError) && 
                        <div className='error_message'>
                            {name.messageError}
                        </div>}
                    <FloatingLabel label='Name'>
                        <Form.Control
                            className='form-update-type'
                            value={name.value.length <= 0 ? 
                                type?.selectedType?.name : 
                                name.value}
                            onChange={e => name.onChange(e)}
                            onBlur={e => name.onBlur(e)}
                            placeholder='Name'
                        />
                    </FloatingLabel>
                
                     {(categoryId.isDirty && categoryId.isNumberError) && 
                        <div className='error_message'>
                            {categoryId.messageError}
                        </div>}
                    <FloatingLabel label='Selected Category'>
                        <Form.Select
                            id={SELECT_CATEGORY}
                            className='form-update-type'
                            onChange={e => categoryId.onChange(e)}
                            onBlur={e => categoryId.onBlur(e)}
                        >
                            <option 
                                key='0'
                                value='0'
                            >
                                {type.selectedType.id > 0 ? 
                                    category?.categories.find(categoryItem => 
                                        categoryItem.id === type?.types?.find(item => item.id === type.selectedType.id)?.categoryId)?.name : 
                                    'Select a category' 
                                }
                            </option>
                            {category.categories.map(catetegoryItem => (
                                <option
                                    value={catetegoryItem.id}
                                    key={catetegoryItem.id}
                                >
                                    {catetegoryItem.name}
                                </option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button_update_type'
                    variant='link'
                    disabled={
                        !name.inputValid && 
                        !categoryId.inputValid
                    }
                    onClick={click}
                >
                    Update
                </Button>
                <Button
                    className='button_update_type_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default UpdateType;