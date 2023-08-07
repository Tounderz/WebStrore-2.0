import React, { useContext, useState } from 'react';
import { Form, Modal, Button, FloatingLabel } from 'react-bootstrap';
import { Context } from '../../index';
import { createInfoProduct, fetchInfoProduct } from '../../http/productInfoApi';
import { useInput } from '../../utils/validate';
import './css/CreateInfoProduct.css'

const CreateInfoProduct = ({show, onHide, productId}) => {
    const { product } = useContext(Context);
    const title = useInput('', {minLength: {value: 1, name: 'Title'}});
    const descriprion = useInput('', {minLength: {value: 1, name: 'Descriprion'}});
    const [messageError, setMessageError] = useState('')

    const click = async () => {
        try {
            await createInfoProduct(productId, title.value, descriprion.value)
            const data = await fetchInfoProduct(productId);
            product.setInfoProduct(data.info);
                close();
        } catch (e) {
            setMessageError(e.response.data.message);
        }
    }
    
    const close = () => {
        title.onChange('');
        descriprion.onChange('');
        setMessageError('');
        onHide();
    }

    return (
        <Modal
            show={show}
            onHide={close}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Create Product Info
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='error_message'>{messageError}</div>
                <Form>
                    {(title.isDirty && title.minLengthError) && 
                        <div className='error_message'>
                            {title.messageError}
                        </div>}
                    <FloatingLabel label='Title'>
                        <Form.Control
                            className='form-control-create-info-product'
                            value={title.value}
                            onChange={e => title.onChange(e)}
                            onBlur={e => title.onBlur(e)}
                            placeholder='Title'
                        />
                    </FloatingLabel>

                    {(descriprion.isDirty && descriprion.minLengthError) && 
                        <div className='error_message'>
                            {descriprion.messageError}
                        </div>}
                    <FloatingLabel label='Description'>
                        <Form.Control
                            className='form-control-create-info-product'
                            value={descriprion.value}
                            onChange={e => descriprion.onChange(e)}
                            onBlur={e => descriprion.onBlur(e)}
                            placeholder='Description'
                        />
                    </FloatingLabel>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button-create-info-product'
                    variant='outline-primary'
                    disabled={!title.inputValid || !descriprion.inputValid}
                    onClick={click}
                >
                    Create
                </Button>
                <Button
                    className='button-create-info-product'
                    variant='outline-danger'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateInfoProduct;