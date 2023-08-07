import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Context } from '../../index';
import { useInput } from '../../utils/validate';
import { PAGE_FIRST, SELECT_BRAND } from '../../utils/const';
import { fetchProducts, fetchProductsByBrand, removeProducts } from '../../http/productApi';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import './css/RemoveProductsByBrandComponent.css';

const RemoveProductsByBrandComponent = observer(({show, onHide}) => {
    const { brand, product, pagination } = useContext(Context);
    const brandId = useInput(0, {isNumberId: {name: 'Brand'}});
    const productsId = useInput([], {multiselect: {name: 'Products'}});
    const [messageError, setMessageError] = useState('');

    const close = () => {
        document.getElementById(SELECT_BRAND).value = '0';
        brandId.onChange(0);
        product.setChangeProducts([]);
        
        onHide();
    };

    const click = async () => {
        try {
            const productsIdArray = productsId.value.join(',');
            await removeProducts(productsIdArray);
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
        brandId.onChange(e);
        productsId.onSelect([]);
        console.log(productsId.value);
        try {
            const data = await fetchProductsByBrand(e?.target?.value);
                product.setChangeProducts(data.products);
                
        } catch (e) {
            productsId.onChange([]);
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
                    {(brandId.isDirty && brandId.isNumberError) && 
                        <div className='error_message'>
                            {brandId.messageError}
                        </div>}
                    <FloatingLabel label='Selected Brand'>
                        <Form.Select
                            id={SELECT_BRAND}
                            className='form_remove_products_brand' 
                            onChange={e => getProducts(e)}
                            onBlur={e => brandId.onBlur(e)}
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

                    {(productsId.isDirty && productsId.multiSelectError) && 
                        <div className='error_message'>
                            {productsId.messageError}
                        </div>}
                    <Multiselect 
                        className='form_remove_products_brand'
                        displayValue='name'
                        placeholder='Products'
                        value='id'
                        options={product?.changeProducts}
                        onSelect={e => productsId.onSelect(e)}
                        onRemove={e => productsId.onRemove(e)}
                        onBlur={e => productsId.onBlur(e)}
                        showCheckbox
                    />

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button_remove_products_brand'
                    variant='link'
                    disabled={
                        !brandId.inputValid ||
                        productsId.value.length < 1
                    }
                    onClick={click}
                >
                    Edit
                </Button>
                <Button
                    className='button_remove_products_brand_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default RemoveProductsByBrandComponent;