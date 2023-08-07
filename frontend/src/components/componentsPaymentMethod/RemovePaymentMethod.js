import React, { useContext } from 'react';
import { Form, Modal, Button, FloatingLabel } from 'react-bootstrap';
import { Context } from '../../index';
import { removePaymentMethods } from '../../http/paymentMethodsApi';
import { useInput } from '../../utils/validate';
import './css/RemovePaymentMethod.css'
import { observer } from 'mobx-react-lite';

const RemovePaymentMethod = observer(({show, onHide}) => {
    const {paymentMethod} = useContext(Context);
    const methodId = useInput(0, {isNumberId: {name: 'Payment Method'}});

    const click = async () => {
        const data = await removePaymentMethods(methodId.value);
            paymentMethod.setPaymentMethods(data.paymentMethods);
        close();
    }

    const close  =() => {
        document.getElementById('removeSelectMethod').value = '0';
        methodId.onChange('');
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
                    Remove a Payment Method
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {(methodId.isDirty && methodId.isNumberError) && 
                    <div className='error_message'>
                        {methodId.messageError}
                    </div>}
                <FloatingLabel label='Selected Payment Method'>
                    <Form.Select 
                        id='removeSelectMethod'
                        className='form-method-remove'
                        onChange={e => methodId.onChange(e)}
                        onBlur={e => methodId.onBlur(e)}
                    >
                        <option 
                            key='0'
                            value='0'
                        >
                            Select a Payment Method
                        </option>
                        {paymentMethod.paymentMethods.map(item => (
                            <option
                                value={item.id}
                                key={item.id}
                            >
                                {item.name}
                            </option>
                        ))}
                    </Form.Select>
                </FloatingLabel>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button-method-remove'
                    variant='outline-primary'
                    disabled={!methodId.inputValid}
                    onClick={click}
                >
                    Remove
                </Button>
                <Button 
                    className='button-method-remove'
                    variant='outline-danger'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default RemovePaymentMethod;