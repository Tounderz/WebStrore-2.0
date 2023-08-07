import Multiselect from 'multiselect-react-dropdown';
import React, { useContext, useState } from 'react';
import { Form, Modal, Button, FloatingLabel } from 'react-bootstrap';
import { fetchTableCategories, formDataCategory, updateCategory } from '../../http/categoryApi';
import { useInput } from '../../utils/validate';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { fetchSearchCategory } from '../../http/searchApi';
import { sortCategories } from '../../http/sortApi';
import './css/UpdateCategory.css'

const UpdateCategory = observer(({show, onHide}) => {
    const { category, brand, sort, search, pagination } = useContext(Context);
    const name = useInput('', {minLength: {value: 3, name: 'Name'}});
    const shortDescription = useInput('', {minLength: {value: 8, name: 'Short Description'}});
    const info = useInput('', {minLength: {value: 8, name: 'Info'}});
    const brandsId = useInput([], {multiSelect: {name: 'Brands'}});
    const img = useInput(null, {isImg: { name: 'Img' }} );
    const countView = useInput(0, {isPrice: {value: 0, name: 'Count View'}});
    const [messageError, setMessageError] = useState('');

    const click = async () => {
        try {
            const difference = brandsId.value
                .filter(num => !brand.brandsByCategory.map(i => {return i.id}).includes(num))
                .concat(brand.brandsByCategory.map(i => {return i.id}).filter(num => !brandsId.value.includes(num)));
            if (difference) {
                const formData = formDataCategory(category.selectedCategory.id, name.value, shortDescription.value, info.value, img.value, brandsId.value, countView.value);
                await updateCategory(formData);
                if (sort.typeSort !== '' || sort.fieldName !== '') {
                    const data = await sortCategories(sort.fieldName, sort.typeSort, pagination.currentPage);
                        category.setTableCategories(data.brands);
                } else if (search.searchBy !== '' || search.selectedSearchParameter !== '') {
                    const data = await fetchSearchCategory(search.selectedSearchParameter, pagination.currentPage, search.searchBy);
                        category.setTableCategories(data.brands);
                } else {
                    const data = await fetchTableCategories(pagination.currentPage);
                        category.setTableCategories(data.brands);
                }

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
                    Edit Category: {category.selectedCategory.name}
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
                            className='form-update-category'
                            value={name.value.length <= 0 ? 
                                category?.selectedCategory?.name : 
                                name.value}
                            onChange={e => name.onChange(e)}
                            onBlur={e => name.onBlur(e)}
                            placeholder='Category name'
                        />
                    </FloatingLabel>

                    {(shortDescription.isDirty && shortDescription.minLengthError) && 
                        <div className='error_message'>
                            {shortDescription.messageError}
                        </div>}
                    <FloatingLabel label='ShortDescription'>
                        <Form.Control
                            className='form-update-category'
                            value={shortDescription.value.length <= 0 ? 
                                category?.selectedCategory?.shortDescription : 
                                shortDescription.value}
                            onChange={e => shortDescription.onChange(e)}
                            onBlur={e => shortDescription.onBlur(e)}
                            placeholder='ShortDescription'
                        />
                    </FloatingLabel>

                    {(info.isDirty && info.minLengthError) && 
                        <div className='error_message'>
                            {info.messageError}
                        </div>}
                    <FloatingLabel label='Info'>
                        <Form.Control
                            className='form-update-category'
                            value={info.value.length <= 0 ? 
                                category?.selectedCategory?.info : 
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
                        className='form-update-category'
                        type='file'
                        onChange={e => img.saveImg(e)}
                        onBlur={e => img.onBlur(e)}
                    />

                    {(brandsId.isDirty && brandsId.multiSelectError) && 
                        <div className='error_message'>
                            {brandsId.messageError}
                        </div>}
                    <Multiselect 
                        className='form-update-category'
                        placeholder='Brands: '
                        displayValue='name'
                        selectedValues={brand.brandsByCategory}
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
                            value={countView.value <= 0 ? 
                                category?.selectedCategory?.countView : 
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
                    className='button_update_category'
                    variant='link'
                    disabled={
                        !name.inputValid && 
                        !shortDescription.inputValid && 
                        !info.inputValid && 
                        brandsId.value.length < 1 && 
                        !img.inputValid                
                    }
                    onClick={click}
                >
                    Update
                </Button>
                <Button 
                    className='button_update_category_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default UpdateCategory;