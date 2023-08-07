import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import { Context } from '../../index';
import { useInput } from '../../utils/validate';
import { createRole, fetchRole } from '../../http/roleApi';
import { PAGE_FIRST } from '../../utils/const';
import './css/CreateRole.css';

const CreateRole = observer(({show, onHide}) => {
    const { role, pagination } = useContext(Context);
    const name = useInput('', {minLength: {value: 3, name: 'Name'}});
    const [messageError, setMessageError] = useState('');

    const click = async () => {
        try {
            await createRole(name.value);
            const data = await fetchRole();
                role.setRoles(data.roles);
                pagination.setCountPages(data.countPages);
                pagination.setCurrentPage(PAGE_FIRST);
                close();
        } catch (e) {
            setMessageError(e?.response?.data?.message || 'An error occurred');
        }
    }

    const close = () => {
        name.onChange();
        setMessageError();
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
                    Create Role
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
                            className='form_control_create_role'
                            value={name.value}
                            onChange={e => name.onChange(e)}
                            onBlur={e => name.onBlur(e)}
                            placeholder='Role name'
                        />
                    </FloatingLabel>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button_create_role'
                    variant='link'
                    disabled={!name.inputValid}
                    onClick={click}
                >
                    Create
                </Button>
                <Button 
                    className='button_create_role_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateRole;