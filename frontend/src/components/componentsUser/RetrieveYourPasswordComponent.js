import React from 'react';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import { retrievePassword } from '../../http/retrievePasswordApi';
import { useInput } from '../../utils/validate';
import './css/RetrieveYourPasswordComponent.css'

const RetrieveYourPasswordModel = observer(({show, onHide}) => {
    const email = useInput('', {minLength: {value: 4, name: 'Email'}, isEmail: true});
    const [messageError, setMessageError] = useState('');

    const send = async () => {
        try {
            await retrievePassword(email.value);
                close();
        } catch (e) {
            setMessageError(e.response.data.message);
        }
    }

    const close = () => {
        email.onChange('');
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
                    Retrieve your password
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='error_message'>{messageError}</div>
                <Form>
                    {((email.isDirty && email.emailError) || 
                        (email.isDirty && email.isEmpty)) && 
                        <div className='error_message'>
                            {email.messageError}
                        </div>}
                    <FloatingLabel label='Email'>
                        <Form.Control
                            className='form-control-retrieve-password'
                            value={email.value}
                            onChange={e => email.onChange(e)}
                            onBlur={e => email.onBlur(e)}
                            placeholder='Email'
                        />
                    </FloatingLabel>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button_update_retrieve_password'
                    variant='link'
                    disabled={!email.inputValid}
                    onClick={send}
                >
                    Send
                </Button>
                <Button
                    className='button_update_retrieve_password_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default RetrieveYourPasswordModel;