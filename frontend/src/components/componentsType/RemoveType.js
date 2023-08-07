import React, { useContext } from 'react';
import { Modal, Form, Button, FloatingLabel } from 'react-bootstrap';
import { fetchTableTypes, removeType } from '../../http/typeApi';
import { useInput } from '../../utils/validate';
import { Context } from '../../index';
import './css/RemoveType.css'
import { observer } from 'mobx-react-lite';
import { PAGE_FIRST, SELECT_TYPE } from '../../utils/const';

const RemoveType = observer(({show, onHide}) => {
    const { type, pagination } = useContext(Context);
    const typeId = useInput(0, {isNumberId: {name: 'Type'}});

    const click = async () => {
        await removeType(typeId.value);
        const data = await fetchTableTypes(PAGE_FIRST);
            type.setTypes(data.types);
            pagination.setCountPages(data.countPages);
            pagination.setCurrentPage(PAGE_FIRST);
        close();
    }

    const close  = () => {
        document.getElementById(SELECT_TYPE).value = '0';
        typeId.onChange('');
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
                    Remove a Type
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {(typeId.isDirty && typeId.isNumberError) && 
                    <div className='error_message'>
                        {typeId.messageError}
                    </div>}
                <FloatingLabel label='Selected Type'>
                    <Form.Select
                        id={SELECT_TYPE}
                        className='form-type-remove'
                        onChange={e => typeId.onChange(e)}
                        onBlur={e => typeId.onBlur(e)}
                    >
                        <option 
                            key='0'
                            value='0'
                        >
                            Select a type
                        </option>
                        {type.types.map(type => (
                            <option
                                value={type.id}
                                key={type.id}
                            >
                                {type.name}
                            </option>
                        ))}
                    </Form.Select>
                </FloatingLabel>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button-type-remove'
                    variant='outline-primary'
                    disabled={!typeId.inputValid}
                    onClick={click}
                >
                    Remove
                </Button>
                <Button 
                    className='button-type-remove'
                    variant='outline-danger'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default RemoveType;