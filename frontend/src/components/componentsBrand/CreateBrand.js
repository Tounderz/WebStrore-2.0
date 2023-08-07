import React, { useContext, useState } from 'react';
import { Form, Modal, Button, FloatingLabel } from 'react-bootstrap';
import { Context } from '../../index';
import { createBrand, fetchTableBrands, formDataBrand } from '../../http/brandApi';
import Multiselect from 'multiselect-react-dropdown';
import { useInput } from '../../utils/validate';
import { observer } from 'mobx-react-lite';
import { PAGE_FIRST } from '../../utils/const';
import './css/CreateBrand.css'

const CreateBrand = observer(({show, onHide}) => {
    const { category, brand, pagination } = useContext(Context);
    const name = useInput('', {minLength: {value: 3, name: 'Name'}});
    const categoriesId = useInput([], {multiselect: {name: 'Categories'}});
    const info = useInput('', {minLength: {value: 8, name: "Info"}});
    const img = useInput(null, {isImg: { name: 'Img' }} );
    const countView = useInput(0, {isPrice: {value: 0, name: 'Count View'}});
    const [messageError, setMessageError] = useState('');

    const click = async () => {
        try {
            const formData = formDataBrand(0, name.value, info.value, categoriesId.value, img.value, countView.value);
            await createBrand(formData);
            const data = await fetchTableBrands(PAGE_FIRST);
                brand.setTableBrands(data.brands);
                pagination.setCountPages(data.countPages);
                pagination.setCurrentPage(PAGE_FIRST);
                close();
        } catch (e) {
            setMessageError(e?.response?.data?.message || 'An error occurred');
        }
    }

    const close = () => {
        name.onChange();
        categoriesId.onSelect([]);
        info.onChange();
        img.saveImg(null);
        setMessageError();
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
                    Create Brand
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
                    <FloatingLabel label='Brand name'>
                        <Form.Control
                            className='form_control_create_brand'
                            value={name.value}
                            onChange={e => name.onChange(e)}
                            onBlur={e => name.onBlur(e)}
                            placeholder='Brand name'
                        />
                    </FloatingLabel>

                    {(info.isDirty && info.minLengthError) && 
                        <div className='error_message'>
                            {info.messageError}
                        </div>}
                    <FloatingLabel label='Info'>
                        <Form.Control
                            className='form_control_create_brand'
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
                        className='form_control_create_brand'
                        type='file'
                        onChange={e => img.saveImg(e)}
                        onBlur={e => img.onBlur(e)}
                    />

                    {(categoriesId.isDirty && categoriesId.multiSelectError) && 
                        <div className='error_message'>
                            {categoriesId.messageError}
                        </div>}
                    <Multiselect 
                        className='form_control_create_brand'
                        displayValue='name'
                        placeholder='Categories:'
                        value='id'
                        options={category.categories}
                        onSelect={e => categoriesId.onSelect(e)}
                        onRemove={e => categoriesId.onRemove(e)}
                        onBlur={e => categoriesId.onBlur(e)}
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
                    className='button_create_brand'
                    variant='link'
                    disabled={!name.inputValid || categoriesId.value.length < 1}
                    onClick={click}
                >
                    Create
                </Button>
                <Button 
                    className='button_create_brand_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateBrand;