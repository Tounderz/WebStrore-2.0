import React, { useContext, useState } from 'react';
import { Form, Modal, Button, FloatingLabel } from 'react-bootstrap';
import { Context } from '../../index';
import { createType, fetchTableTypes } from '../../http/typeApi';
import { useInput } from '../../utils/validate';
import './css/CreateType.css'
import { PAGE_FIRST, SELECT_CATEGORY } from '../../utils/const';

const CreateType = ({show, onHide}) => {
    const { category, pagination } = useContext(Context);
    const name = useInput('', {minLength: {value: 3, name: 'Name'}});
    const categoryId = useInput(0, {isNumberId: {name: 'Category'}});
    const [messageError, setMessageError] = useState('')

    const click = async () => {
        try {
            createType(name.value, categoryId.value);
            const data = await fetchTableTypes(PAGE_FIRST);
                pagination.setCountPages(data.countPages);
                pagination.setCurrentPage(PAGE_FIRST);
            close();
        } catch (e) {
            setMessageError(e.response.data.message);
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
                    Create Type
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
                            className='form-control-create-type'
                            value={name.value}
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
                            className='form-control-create-type' 
                            onChange={e => categoryId.onChange(e)}
                            onBlur={e => categoryId.onBlur(e)}
                        >
                            <option 
                                key='0'
                                value='0'
                            >
                                Select a category
                            </option>
                            {category.categories.map(item => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.name}
                                </option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button_create_type'
                    variant='link'
                    disabled={!name.inputValid || !categoryId.inputValid}
                    onClick={click}
                >
                    Create
                </Button>
                <Button
                    className='button_create_type_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateType;