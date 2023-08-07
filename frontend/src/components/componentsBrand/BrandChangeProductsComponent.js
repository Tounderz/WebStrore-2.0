import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import { Context } from '../..';
import { useInput } from '../../utils/validate';
import Multiselect from 'multiselect-react-dropdown';
import { brandChangeProducts, fetchProducts, fetchProductsByBrand } from '../../http/productApi';
import { PAGE_FIRST, SELECT_BRAND } from '../../utils/const';
import './css/BrandChangeProductsComponent.css';

const BrandChangeProductsComponent = observer(({show, onHide}) => {
    const { brand, product, pagination } = useContext(Context);
    const currentBrand = useInput(0, {isNumberId: {name: 'Current Brand'}});
    const newBrand = useInput(0, {isNumberId: {name: 'New Brand'}});
    const [messageError, setMessageError] = useState('');

    const close = () => {
        document.getElementById(SELECT_BRAND).value = '0';
        currentBrand.onChange(0);
        newBrand.onChange(0);
        product.setChangeProducts([]);
        onHide();
    };

    const click = async () => {
        try {
            const productsId = product.changeProducts.map(item => item.id).join(',');
            await brandChangeProducts(newBrand.value, productsId);
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
        currentBrand.onChange(e);
        try {
            const data = await fetchProductsByBrand(e?.target?.value);
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
                    Brand change for all relevant products
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='error_message'>
                    {messageError}
                </div>
                <Form>
                    {(currentBrand.isDirty && currentBrand.isNumberError) && 
                        <div className='error_message'>
                            {currentBrand.messageError}
                        </div>}
                    <FloatingLabel label='Current Brand'>
                        <Form.Select
                            id={SELECT_BRAND}
                            className='form_change_brand' 
                            onChange={e => getProducts(e)}
                            onBlur={e => currentBrand.onBlur(e)}
                        >
                            <option 
                                key='0'
                                value='0'
                            >
                                Select a brand
                            </option>
                            {brand?.brands?.map(item => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.name}
                                </option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>

                    {(newBrand.isDirty && newBrand.isNumberError) && 
                        <div className='error_message'>
                            {newBrand.messageError}
                        </div>}
                    <FloatingLabel label='New Brand'>
                        <Form.Select
                            id={SELECT_BRAND}
                            className='form_change_brand' 
                            onChange={e => newBrand.onChange(e)}
                            onBlur={e => newBrand.onBlur(e)}
                        >
                            <option 
                                key='0'
                                value='0'
                            >
                                Select a brand
                            </option>
                            {brand?.brands?.map(item => (
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
                        className='form_change_brand'
                        placeholder='Products'
                        displayValue='name'
                        selectedValues={product.changeProducts}
                        value='id'
                        options={product.changeProducts}
                        showCheckbox
                        disable
                    />

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button_change_brand'
                    variant='link'
                    disabled={!currentBrand.inputValid ||
                        !newBrand.inputValid ||
                        product.changeProducts.length < 1
                    }
                    onClick={click}
                >
                    Edit
                </Button>
                <Button
                    className='button_change_brand_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default BrandChangeProductsComponent;