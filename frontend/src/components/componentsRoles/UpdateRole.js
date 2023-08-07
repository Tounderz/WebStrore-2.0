import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import { fetchRoles, updateRole } from '../../http/roleApi';
import { Context } from '../../index';
import { useInput } from '../../utils/validate';
import './css/UpdateRole.css';
import { PAGE_FIRST } from '../../utils/const';

const UpdateRole = observer(({show, onHide}) => {
    const { role, pagination } = useContext(Context);
    const name = useInput('', {minLength: {value: 2, name: 'Name'}});
    const [messageError, setMessageError] = useState('');

    const click = async () => {
        try {
            updateRole(role.selectedRole.id, name.value);
            const data = await fetchRoles(PAGE_FIRST)
                role.setRoles(data.roles);
                pagination.setCountPages(data.countPages);
                pagination.setCurrentPage(PAGE_FIRST);
            close();
        } catch (e) {
            setMessageError(e?.response?.data?.message);
        }
    }

    const close = () => {
        name.onChange('');
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
                    Edit Role: {role?.selectedRole?.roleName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='error_message'>
                    {messageError}
                </div>
                <Form>
                    {(name.isDirty && name.minLengthError) && 
                    <div className='error_message'>
                        {name.messageError}
                    </div>}
                    <FloatingLabel label='Role name'>
                        <Form.Control
                            className='form_update_role'
                            value={name.value.length <= 0 ? 
                                role?.selectedRole?.roleName : 
                                name.value}
                            onChange={e => name.onChange(e)}
                            onBlur={e => name.onBlur(e)}
                            placeholder='Role name'
                        />
                    </FloatingLabel>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button_update_role'
                    variant='link'
                    disabled={
                        !name.inputValid
                    }
                    onClick={click}
                >
                    Update
                </Button>
                <Button
                    className='button_update_role_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default UpdateRole;