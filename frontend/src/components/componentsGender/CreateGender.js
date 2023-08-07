import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Context } from '../../index';
import { useInput } from '../../utils/validate';
import { createGender, fetchGenders } from '../../http/genderApi';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import './css/CreateGender.css';
import { PAGE_FIRST } from '../../utils/const';

const CreateGender = observer(({show, onHide}) => {
    const { gender, pagination } = useContext(Context);
    const name = useInput('', {minLength: {value: 3, name: 'Name'}});
    const [messageError, setMessageError] = useState('');

    const click = async () => {
        try {
            await createGender(name.value);
            const data = await fetchGenders(PAGE_FIRST);
                gender.setGenders(data.genders);
                pagination.setCountPages(data.countPages);
                pagination.setCurrentPage(PAGE_FIRST);
                close();
        } catch (e) {
            setMessageError(e?.response?.data?.message || 'An error occurred');
        }
    }

    const close = () => {
        name.onChange();
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
                    Create Gender
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
                            className='form_control_create_gender'
                            value={name.value}
                            onChange={e => name.onChange(e)}
                            onBlur={e => name.onBlur(e)}
                            placeholder='Gender name'
                        />
                    </FloatingLabel>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button_create_gender'
                    variant='link'
                    disabled={!name.inputValid}
                    onClick={click}
                >
                    Create
                </Button>
                <Button 
                    className='button_create_gender_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateGender;