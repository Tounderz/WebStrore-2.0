import { observer } from 'mobx-react-lite';
import React, { useState, useContext } from 'react';
import { FloatingLabel, Form, Modal } from 'react-bootstrap';
import { Context } from '../../index';
import { useInput } from '../../utils/validate';
import { SELECT_BRAND } from '../../utils/const';

const BrandChangeCategoriesComponent = observer(({show, onHide}) => {
    const { brand, category } = useContext(Context);
    const brandId = useInput(0, {isNumberId: {name: 'Brand'}});
    const name = useInput('', {minLength: {value: 3, name: 'Name'}});
    const categoriesId = useInput([], {multiselect: {name: 'Categories'}});
    const info = useInput('', {minLength: {value: 8, name: "Info"}});
    const img = useInput(null, {isImg: { name: 'Img' }} );
    const countView = useInput(0, {isPrice: {value: 0, name: 'Count View'}});
    const [messageError, setMessageError] = useState('');

    const close = () => {
        document.getElementById(SELECT_BRAND).value = '0';
        brandId.onChange(0);
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
                    Brand change for all relevant categories
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
                            className='form-control-create-brand' 
                            onChange={e => brandId.onChange(e)}
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
                    {(name.isDirty && name.minLengthError) && 
                        <div className='error_message'>
                            {name.messageError}
                        </div>}
                    <FloatingLabel label='Brand name'>
                        <Form.Control
                            className='form-control-create-brand'
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
                            className='form-control-create-brand'
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
                        className='form-control-create-brand'
                        type='file'
                        onChange={e => img.saveImg(e)}
                        onBlur={e => img.onBlur(e)}
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
            
        </Modal>
    );
});

export default BrandChangeCategoriesComponent;