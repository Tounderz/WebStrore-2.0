import { observer } from 'mobx-react-lite';
import Multiselect from 'multiselect-react-dropdown';
import React, { useContext, useState } from 'react';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import { Context } from '../../index';
import { PAGE_FIRST, SELECT_TYPE } from '../../utils/const';
import { fetchProducts, fetchProductsByType, typeChangeProducts } from '../../http/productApi';
import { useInput } from '../../utils/validate';
import './css/TypeChangeProductsComponent.css';

const TypeChangeProductsComponent = observer(({show, onHide}) => {
    const { type, product, pagination } = useContext(Context);
    const currentType = useInput(0, {isNumberId: {name: 'Current Type'}});
    const newType = useInput(0, {isNumberId: {name: 'New Type'}});
    const [messageError, setMessageError] = useState('');

    const close = () => {
        document.getElementById(SELECT_TYPE).value = '0';
        currentType.onChange(0);
        newType.onChange(0);
        product.setChangeProducts([]);
        onHide();
    };

    const click = async () => {
        try {
            const productsId = product.changeProducts.map(item => item.id).join(',');
            await typeChangeProducts(newType.value, productsId);
            const data = await fetchProducts(PAGE_FIRST);
                product.setProducts(data.products);
                pagination.setCountPages(data.countPages);
                pagination.setCurrentPage(PAGE_FIRST);
            close();
        } catch (e) {
            setMessageError(e?.response?.data?.message);
        }
    };

    const getProducts = async (e) => {
        currentType.onChange(e);
        try {
            const data = await fetchProductsByType(e?.target?.value);
                product.setChangeProducts(data.products);
        } catch (e) {
            product.setChangeProducts([]);
            setMessageError(e?.response?.data?.message);
        }
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
                    Type change for all relevant products
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='error_message'>
                    {messageError}
                </div>
                <Form>
                    {(currentType.isDirty && currentType.isNumberError) && 
                        <div className='error_message'>
                            {currentType.messageError}
                        </div>}
                    <FloatingLabel label='Current Type'>
                        <Form.Select
                            id={SELECT_TYPE}
                            className='form_change_type' 
                            onChange={e => getProducts(e)}
                            onBlur={e => currentType.onBlur(e)}
                        >
                            <option 
                                key='0'
                                value='0'
                            >
                                Select a type
                            </option>
                            {type?.types?.map(item => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.name}
                                </option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>

                    {(newType.isDirty && newType.isNumberError) && 
                        <div className='error_message'>
                            {newType.messageError}
                        </div>}
                    <FloatingLabel label='New Type'>
                        <Form.Select
                            id={SELECT_TYPE}
                            className='form_change_type' 
                            onChange={e => newType.onChange(e)}
                            onBlur={e => newType.onBlur(e)}
                        >
                            <option 
                                key='0'
                                value='0'
                            >
                                Select a type
                            </option>
                            {type?.types?.map(item => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.name}
                                </option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>

                    <Multiselect 
                        className='form_change_type'
                        placeholder='Products'
                        displayValue='name'
                        selectedValues={product.changeProducts}
                        value='id'
                        options={product.changeProducts}
                        disable
                        showCheckbox
                    />

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button_change_type'
                    variant='link'
                    disabled={!currentType.inputValid ||
                        !newType.inputValid ||
                        product.changeProducts.length < 1
                    }
                    onClick={click}
                >
                    Edit
                </Button>
                <Button
                    className='button_change_type_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default TypeChangeProductsComponent;