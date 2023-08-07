import React, { useState } from 'react';
import { Form, Modal, Button, FloatingLabel } from 'react-bootstrap';
import { createPaymentMethods } from '../../http/paymentMethodsApi';
import { useInput } from '../../utils/validate';
import './css/CreatePaymentMethod.css'

const CreatePaymentMethod = ({show, onHide}) => {
    const name = useInput('', {minLength: {value: 3, name: 'Name'}});
    const [messageError, setMessageError] = useState('')

    const click = async () => {
        try {
            createPaymentMethods(name.value);
            close();
        } catch (e) {
            setMessageError(e.response.data.message);
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
                    Create Payment Method
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
                            className='form-control-create-method'
                            value={name.value}
                            onChange={e => name.onChange(e)}
                            onBlur={e => name.onBlur(e)}
                            placeholder='Name'
                        />
                    </FloatingLabel>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button-create-method'
                    variant='outline-primary'
                    disabled={!name.inputValid}
                    onClick={click}
                >
                    Create
                </Button>
                <Button 
                    className='button-create-method'
                    variant='outline-danger'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreatePaymentMethod;