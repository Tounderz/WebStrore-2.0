import Multiselect from 'multiselect-react-dropdown';
import React, { useContext, useState } from 'react';
import { Form, Modal, Button, FloatingLabel } from 'react-bootstrap';
import { updateBrand, formDataBrand, fetchTableBrands } from '../../http/brandApi';
import { useInput } from '../../utils/validate';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import './css/UpdateBrand.css'
import { PAGE_FIRST } from '../../utils/const';

const UpdateBrand = observer(({show, onHide}) => {
    const { brand, category, pagination } = useContext(Context);
    const name = useInput('', {minLength: {value: 2, name: 'Name'}});
    const img = useInput(null, {isImg: { name: 'Img' }} );
    const categoriesId = useInput([], {multiSelect: {name: 'Categories'}});
    const info = useInput('', {minLength: {value: 3, name: 'Info'}});
    const countView = useInput(0, {isPrice: {value: 0, name: 'Count View'}});
    const [messageError, setMessageError] = useState('');

    const click = async () => {
        try {
            const difference = categoriesId.value
                .filter(num => !category.categoriesByBrand.map(i => {return i.id}).includes(num))
                .concat(category.categoriesByBrand.map(i => {return i.id}).filter(num => !categoriesId.value.includes(num)));
                if (difference) {
                    const formData = formDataBrand(
                        brand?.selectedBrand?.id, name.value, 
                        info.value, categoriesId.value, 
                        img.value, countView.value
                    );
                    await updateBrand(formData);
                    const data = await fetchTableBrands(PAGE_FIRST);
                        brand.setTableBrands(data.brands);
                        pagination.setCountPages(data.countPages);
                        pagination.setCurrentPage(PAGE_FIRST);
                    close();
                } else {
                    setMessageError('Error')
                }
        } catch (e) {
            setMessageError(e?.response?.data?.message);
        }
    }

    const close = () => {
        name.onChange('');
        info.onChange('');
        categoriesId.onSelect([]);
        img.saveImg(null);
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
                    Edit Brand: {brand?.selectedBrand?.name}
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
                            className='form-update-brand'
                            value={name.value.length <= 0 ? 
                                brand?.selectedBrand?.name : 
                                name.value}
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
                            className='form-update-brand-info'
                            value={info.value.length <= 0 ? 
                                brand?.selectedBrand?.info : 
                                info.value}
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
                        className='form-update-brand'
                        type='file'
                        onChange={e => img.saveImg(e)}
                        onBlur={e => img.onBlur(e)}
                    />

                    {(categoriesId.isDirty && categoriesId.multiSelectError) && 
                        <div className='error_message'>
                            {categoriesId.messageError}
                        </div>}
                    <Multiselect 
                        className='form-update-brand'
                        placeholder='Categories: '
                        displayValue='name'
                        selectedValues={category.categoriesByBrand}
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
                            value={countView.value <= 0 ? 
                                brand?.selectedBrand?.countView : 
                                countView.value}
                            onChange={e => countView.onChange(e)}
                            onBlur={e => countView.onBlur(e)}
                            placeholder='Count view'
                        />
                    </FloatingLabel>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button_update_brand'
                    variant='link'
                    disabled={
                        !name.inputValid && 
                        !info.inputValid && 
                        categoriesId.value.length < 1 && 
                        !img.inputValid
                    }
                    onClick={click}
                >
                    Update
                </Button>
                <Button
                    className='button_update_brand_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default UpdateBrand;