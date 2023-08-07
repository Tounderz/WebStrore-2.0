import React, { useContext, useState } from 'react';
import { Form, Modal, Button, FloatingLabel } from 'react-bootstrap';
import { Context } from '../../index';
import { fetchInfoProduct, updateInfoProduct } from '../../http/productInfoApi';
import { useInput } from '../../utils/validate';
import './css/UpdateInfoProduct.css'

const UpdateInfoProduct = ({info, show, onHide}) => {
    const { product } = useContext(Context);
    const title = useInput('', {minLength: {value: 1, name: 'Title'}});
    const descriprion = useInput('', {minLength: {value: 3, name: 'Descriprion'}});
    const [messageError, setMessageError] = useState('');

    const click = async () => {
        try {
            await updateInfoProduct(info.id, title.value, descriprion.value);
            const data = await fetchInfoProduct(product.selectedProduct.id);    
            product.setInfoProduct(data.info)
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
                <Modal.Title 
                    id='contained-modal-title-vcenter'
                >
                    Edit Product Info
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='error_message'>
                    {messageError}
                </div>
                <Form>
                    {(title.isDirty && title.minLengthError) && 
                        <div className='error_message'>
                            {title.messageError}
                        </div>}
                    <FloatingLabel label='Title'>
                        <Form.Control
                            className='form-update-info'
                            value={title.value.length > 0 ? title.value : info.title}
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
                            className='form-update-info'
                            value={descriprion.value.length > 0 ? descriprion.value : info.description}
                            onChange={e => descriprion.onChange(e)}
                            onBlur={e => descriprion.onBlur(e)}
                            placeholder='Description'
                        />
                    </FloatingLabel>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button-update-info'
                    variant='outline-primary'
                    disabled={
                        !title.inputValid && 
                        !descriprion.inputValid
                    }
                    onClick={click}
                >
                    Update
                </Button>
                <Button 
                    className='button-update-info'
                    variant='outline-danger'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateInfoProduct;