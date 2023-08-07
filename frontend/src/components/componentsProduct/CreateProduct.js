import React, { useContext, useState } from 'react';
import { Form, Modal, Button, FloatingLabel } from 'react-bootstrap';
import { createProduct, fetchProducts, formDataProduct } from '../../http/productApi';
import { useInput } from '../../utils/validate';
import { Context } from '../../index';
import { PAGE_FIRST, SELECT_AVAILABLE, SELECT_BRAND, SELECT_CATEGORY, SELECT_IS_FAVOURITE, SELECT_TYPE, TRUE_AND_FALSE } from '../../utils/const';
import './css/CreateProduct.css'

const CreateProduct = ({show, onHide}) => {
    const { category, product, type, brand, pagination } = useContext(Context);
    const name = useInput('', {minLength: {value: 3, name: 'Name'}});
    const categoryId = useInput(0, {isNumberId: {name: 'Category'}});
    const brandId = useInput(0, {isNumberId: {name: 'Brand'}});
    const typeId = useInput(0, {isNumberId: {name: 'Type'}});
    const shortDescription = useInput('', {minLength: {value: 8, name: 'Short Description'}});
    const isFavourite = useInput('', {minLength: {value: 4, name: 'IsFavourite'}});
    const available = useInput('', {minLength: {value: 4, name: 'Available'}});
    const price = useInput(0, {isPrice: {value: 1, name: 'Price'}});
    const countView = useInput(0, {isPrice: {value: 0, name: 'Count View'}});
    const img = useInput(null, {isImg: { name: 'Img' }} );
    const [messageError, setMessageError] = useState('');

    const click = async () => {
        try {
            const formData = formDataProduct(
                0, name.value, categoryId.value,
                typeId.value, brandId.value, shortDescription.value,
                isFavourite.value, available.value, price.value, img.value, countView.value
            );

            await createProduct(formData);
            const data = await fetchProducts(PAGE_FIRST);
                product.setProducts(data.products);
                pagination.setCurrentPage(PAGE_FIRST);
                pagination.setCountPages(data.countPages);
            close();
        } catch (e) {
            setMessageError(e?.response?.data?.message);
        }
    }

    const close = () => {
        name.onChange('');
        document.getElementById(SELECT_CATEGORY).value = '0';
        categoryId.onChange('');
        document.getElementById(SELECT_BRAND).value = '0';
        brandId.onChange('');
        document.getElementById(SELECT_TYPE).value = '0';
        typeId.onChange('');
        shortDescription.onChange('');
        img.saveImg(null);
        document.getElementById(SELECT_AVAILABLE).value = '0';
        available.onChange('');
        document.getElementById(SELECT_IS_FAVOURITE).value = '0';
        isFavourite.onChange('');
        price.onChange(0);
        countView.onChange(0);
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
                    Create Product
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='error_message'>{messageError}</div>
                <Form>
                    {(categoryId.isDirty && categoryId.isNumberError) && 
                        <div className='error_message'>
                            {categoryId.messageError}
                        </div>}
                    <FloatingLabel label='Selected Category'>
                        <Form.Select 
                            id={SELECT_CATEGORY}
                            className='form-control-create-product'
                            onChange={e => categoryId.onChange(e)}
                            onBlur={e => categoryId.onBlur(e)}
                        >
                            <option
                                value='0'
                                key='0'
                            >
                                Select a category
                            </option>
                                {category.categories.map(category => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                        </Form.Select>
                    </FloatingLabel>

                    {(typeId.isDirty && typeId.isNumberError) && 
                        <div className='error_message'>
                            {typeId.messageError}
                        </div>}
                    <FloatingLabel label='Selected Type'>
                        <Form.Select
                            id={SELECT_TYPE}
                            className='form-control-create-product'
                            onChange={e => typeId.onChange(e)}
                            onBlur={e => typeId.onBlur(e)}
                        >
                            <option 
                                key='0' 
                                value='0'
                            >
                                Select a type
                            </option>
                            {type.types.filter(type => type.categoryId === Number(categoryId.value)).map(type => (
                                <option
                                    key={type.id}
                                    value={type.id}
                                >
                                    {type.name}
                                </option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>

                    {(brandId.isDirty && brandId.isNumberError) && 
                        <div className='error_message'>
                            {brandId.messageError}
                        </div>}
                    <FloatingLabel label='Selected Brand'>
                        <Form.Select
                            id={SELECT_BRAND}
                            className='form-control-create-product'
                            onChange={e => brandId.onChange(e)}
                            onBlur={e => brandId.onBlur(e)}
                        >
                            <option 
                                key='0'
                                value='0'
                            >
                                Select a brand
                            </option>
                                {brand.brands.map(brand => (
                                    <option
                                        key={brand.id}
                                        value={brand.id}
                                    >
                                        {brand.name}
                                    </option>
                                ))}
                        </Form.Select>
                    </FloatingLabel>

                    {(name.isDirty && name.minLengthError) && 
                        <div className='error_message'>
                            {name.messageError}
                        </div>}
                    <FloatingLabel label='Product name'>
                        <Form.Control
                            className='form-control-create-product'
                            value={name.value}
                            onChange={e => name.onChange(e)}
                            onBlur={e => name.onBlur(e)}
                            placeholder='Product name'
                        />
                    </FloatingLabel>

                    {(shortDescription.isDirty && shortDescription.minLengthError) && 
                        <div className='error_message'>
                            {shortDescription.messageError}
                        </div>}
                    <FloatingLabel label='Short Description'>
                        <Form.Control
                            className='form-control-create-product'
                            value={shortDescription.value}
                            onChange={e => shortDescription.onChange(e)}
                            onBlur={e => shortDescription.onBlur(e)}
                            placeholder='Short Description'
                        />
                    </FloatingLabel>

                    {(isFavourite.isDirty && isFavourite.isNumberError) && 
                        <div className='error_message'>
                            {isFavourite.messageError}
                        </div>}
                    <FloatingLabel label='Selected IsFavourite'>
                        <Form.Select 
                            id={SELECT_IS_FAVOURITE}
                            className='form-control-create-product'
                            onChange={e =>isFavourite.onChange(e)}
                            onBlur={e => isFavourite.onBlur(e)}
                        >
                            <option 
                                key='0'
                                value='0'
                            >
                                Select IsFavourite
                            </option>
                            {TRUE_AND_FALSE.map(item => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>

                    {(available.isDirty && available.isNumberError) && 
                        <div className='error_message'>
                            {available.messageError}
                        </div>}
                    <FloatingLabel label='Selected Available'>
                        <Form.Select 
                            id={SELECT_AVAILABLE}
                            className='form-control-create-product'
                            onChange={e =>available.onChange(e)}
                            onBlur={e => available.onBlur(e)}
                        >
                            <option 
                                key='0'
                                value='0'
                            >
                                Select Available
                            </option>
                            {TRUE_AND_FALSE.map(item => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>

                    {(price.isDirty && price.priceError) && 
                        <div className='error_message'>
                            {price.messageError}
                        </div>}
                    <FloatingLabel label='Price'>
                        <Form.Control
                            className='form-control-create-product'
                            value={price.value}
                            onChange={e => price.onChange(e)}
                            onBlur={e => price.onBlur(e)}
                            placeholder='Price'
                            type='number'
                        />
                    </FloatingLabel>

                    {(countView.isDirty && countView.priceError) && 
                        <div className='error_message'>
                            {countView.messageError}
                        </div>}
                    <FloatingLabel label='Count View'>
                        <Form.Control
                            className='form-control-create-product'
                            value={countView.value}
                            onChange={e => countView.onChange(e)}
                            onBlur={e => countView.onBlur(e)}
                            placeholder='Count View'
                            type='number'
                        />
                    </FloatingLabel>

                    {(img.isDirty && img.imgError) && 
                        <div className='error_message'>
                            {img.messageError}
                        </div>}
                    <Form.Control
                        className='form-control-create-product'
                        type='file'
                        onChange={e => img.saveImg(e)}
                        onBlur={e => img.onBlur(e)}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button_create_product'
                    variant='link'
                    disabled={
                        !name.inputValid || 
                        !categoryId.inputValid || 
                        !typeId.inputValid || 
                        !brandId.inputValid || 
                        !price.inputValid
                    }
                    onClick={click}
                >
                    Create
                </Button>
                <Button
                    className='button_create_product_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateProduct;