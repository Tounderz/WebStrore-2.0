import React, { useContext, useState } from 'react';
import { Form, Modal, Button, FloatingLabel } from 'react-bootstrap';
import { Context } from '../../index';
import { createCategory, fetchTableCategories, formDataCategory } from '../../http/categoryApi';
import { Multiselect } from 'multiselect-react-dropdown';
import { useInput } from '../../utils/validate';
import './css/CreateCategory.css'
import { observer } from 'mobx-react-lite';
import { PAGE_FIRST } from '../../utils/const';

const CreateCategory = observer(({show, onHide}) => {
    const { brand, category, pagination } = useContext(Context);
    const name = useInput('', {minLength: {value: 3, name: 'Name'}});
    const shortDescription = useInput('', {minLength: {value: 8, name: 'Short Description'}});
    const info = useInput('', {minLength: {value: 8, name: 'Info'}});
    const brandsId = useInput([], {multiSelect: {name: 'Brands'}});
    const img = useInput(null, {isImg: { name: 'Img' }} );
    const countView = useInput(0, {isPrice: {value: 0, name: 'Count View'}});
    const [messageError, setMessageError] = useState('');
    
    const click = async () => {
        try {
            const formData = formDataCategory(0, name.value, shortDescription.value, info.value, img.value, brandsId.value, countView.value);
            await createCategory(formData);
            const data = await fetchTableCategories(PAGE_FIRST);
                category.setCategories(data.categories);
                pagination.setCountPages(data.countPages);
                pagination.setCurrentPage(PAGE_FIRST);
            close();
        } catch (e) {
            setMessageError(e?.response?.data?.message);
        }
    }

    const close = () => {
        name.onChange('');
        info.onChange('');
        shortDescription.onChange('');
        brandsId.onSelect([]);
        img.saveImg(null);
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
                    Create Category
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='error_message'>
                    {messageError}
                </div>
                <Form>
                    {(name.isDirty && name.minLengthError) && 
                        <div className='error_message'>
                            {name.messageError}
                        </div>}
                    <FloatingLabel label='Category name'>
                        <Form.Control
                            value={name.value}
                            onChange={e => name.onChange(e)}
                            onBlur={e => name.onBlur(e)}
                            placeholder='Category name'
                        />
                    </FloatingLabel>

                    {(shortDescription.isDirty && shortDescription.minLengthError) && 
                        <div className='error_message'>
                            {shortDescription.messageError}
                        </div>}
                    <FloatingLabel label='Short description'>
                        <Form.Control
                            className='form-control-create-category'
                            value={shortDescription.value}
                            onChange={e => shortDescription.onChange(e)}
                            onBlur={e => shortDescription.onBlur(e)}
                            placeholder='Short description'
                        />
                    </FloatingLabel>

                    {(info.isDirty && info.minLengthError) && 
                        <div className='error_message'>
                            {info.messageError}
                        </div>}
                    <FloatingLabel label='Info'>
                        <Form.Control
                            className='form-control-create-category'
                            value={info.value}
                            as='textarea'
                            onChange={e => info.onChange(e)}
                            onBlur={e => info.onBlur(e)}
                            placeholder='Info'
                        />
                    </FloatingLabel>

                    {(img.isDirty && img.imgError) && 
                        <div className='error_message'>
                            {img.messageError}
                        </div>}
                    <Form.Control
                        className='form-control-create-category'
                        type='file'
                        onChange={e => img.saveImg(e)}
                        onBlur={e => img.onBlur(e)}
                    />

                    {(brandsId.isDirty && brandsId.multiSelectError) && 
                        <div className='error_message'>
                            {brandsId.messageError}
                        </div>}
                    <Multiselect 
                        className='form-control-create-category'
                        placeholder='Brands:'
                        displayValue='name'
                        value='id'
                        options={brand.brands}
                        onSelect={e => brandsId.onSelect(e)}
                        onRemove={e => brandsId.onRemove(e)}
                        onBlur={e => brandsId.onBlur(e)}
                        showCheckbox
                    />

                    {(countView.isDirty && countView.priceError) && 
                        <div className='error_message'>
                            {countView.messageError}
                        </div>}
                    <FloatingLabel label='Count view'>
                        <Form.Control
                            className='form-update-brand-info'
                            type='number'
                            value={countView.value}
                            onChange={e => countView.onChange(e)}
                            onBlur={e => countView.onBlur(e)}
                            placeholder='Count view'
                        />
                    </FloatingLabel>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    className='button_create_category'
                    variant='link'
                    disabled={!name.inputValid || brandsId.value.length < 1}
                    onClick={click}
                >
                    Create
                </Button>
                <Button 
                    className='button_create_category_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateCategory;