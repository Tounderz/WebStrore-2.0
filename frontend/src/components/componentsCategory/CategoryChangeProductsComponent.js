import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { PAGE_FIRST, SELECT_CATEGORY } from '../../utils/const';
import { Context } from '../../index';
import { useInput } from '../../utils/validate';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import { categoryChangeProducts, fetchProducts, fetchProductsByCategory } from '../../http/productApi';
import './css/CategoryChangeProductsComponent.css';

const CategoryChangeProductsComponent = observer(({show, onHide}) => {
    const { category, product, pagination } = useContext(Context);
    const currentCategory = useInput(0, {isNumberId: {name: 'Current Category'}});
    const newCategory = useInput(0, {isNumberId: {name: 'New Category'}});
    const [messageError, setMessageError] = useState('');

    const close = () => {
        document.getElementById(SELECT_CATEGORY).value = '0';
        currentCategory.onChange(0);
        newCategory.onChange(0);
        product.setChangeProducts([]);
        onHide();
    };

    const click = async () => {
        try {
            const productsId = product.changeProducts.map(item => item.id).join(',');
            await categoryChangeProducts(newCategory.value, productsId);
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
        currentCategory.onChange(e);
        try {
            const data = await fetchProductsByCategory(e?.target?.value);
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
                    Category change for all relevant products
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='error_message'>
                    {messageError}
                </div>
                <Form>
                    {(currentCategory.isDirty && currentCategory.isNumberError) && 
                        <div className='error_message'>
                            {currentCategory.messageError}
                        </div>}
                    <FloatingLabel label='Current Category'>
                        <Form.Select
                            id={SELECT_CATEGORY}
                            className='form_change_category' 
                            onChange={e => getProducts(e)}
                            onBlur={e => currentCategory.onBlur(e)}
                        >
                            <option 
                                key='0'
                                value='0'
                            >
                                Select a category
                            </option>
                            {category?.categories?.map(item => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.name}
                                </option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>

                    {(newCategory.isDirty && newCategory.isNumberError) && 
                        <div className='error_message'>
                            {newCategory.messageError}
                        </div>}
                    <FloatingLabel label='New Category'>
                        <Form.Select
                            id={SELECT_CATEGORY}
                            className='form_change_category' 
                            onChange={e => newCategory.onChange(e)}
                            onBlur={e => newCategory.onBlur(e)}
                        >
                            <option 
                                key='0'
                                value='0'
                            >
                                Select a category
                            </option>
                            {category?.categories?.map(item => (
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
                        className='form_change_category'
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
                    className='button_change_category'
                    variant='link'
                    disabled={!currentCategory.inputValid ||
                        !newCategory.inputValid ||
                        product.changeProducts.length < 1
                    }
                    onClick={click}
                >
                    Edit
                </Button>
                <Button
                    className='button_change_category_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CategoryChangeProductsComponent;