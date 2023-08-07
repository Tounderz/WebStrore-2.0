import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Context } from '../../index';
import { fetchGenders, updateGender } from '../../http/genderApi';
import { PAGE_FIRST } from '../../utils/const';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import './css/UpdateGender.css';
import { useInput } from '../../utils/validate';

const UpdateGender = observer(({show, onHide}) => {
    const { gender, pagination } = useContext(Context);
    const name = useInput('', {minLength: {value: 2, name: 'Name'}});
    const [messageError, setMessageError] = useState('');

    const click = async () => {
        try {
            updateGender(gender.selectedGender.id, name.value);
            const data = await fetchGenders(PAGE_FIRST)
                gender.setGenders(data.genders);
                pagination.setCountPages(data.countPages);
                pagination.setCurrentPage(PAGE_FIRST);
            close();
        } catch (e) {
            setMessageError(e?.response?.data?.message);
        }
    }

    const close = () => {
        name.onChange('');
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
                    Edit gender: {gender?.selectedGender?.genderName}
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
                    <FloatingLabel label='Gender name'>
                        <Form.Control
                            className='form_update_gender'
                            value={name.value.length <= 0 ? 
                                gender?.selectedGender?.genderName : 
                                name.value}
                            onChange={e => name.onChange(e)}
                            onBlur={e => name.onBlur(e)}
                            placeholder='Gender name'
                        />
                    </FloatingLabel>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button_update_gender'
                    variant='link'
                    disabled={
                        !name.inputValid
                    }
                    onClick={click}
                >
                    Update
                </Button>
                <Button
                    className='button_update_gender_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default UpdateGender;