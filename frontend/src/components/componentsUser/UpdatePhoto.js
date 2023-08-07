import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Form, Modal } from 'react-bootstrap';
import { Context } from '../../index';
import { useInput } from '../../utils/validate';
import { fetchUser, updateUserImg } from '../../http/userApi';
import './css/UpdatePhoto.css'

const UpdatePhoto = observer(({show, onHide}) => {
    const { user, auth } = useContext(Context);
    const img = useInput(null, {isImg: { name: 'Img' }} );
    const [messageError, setMessageError] = useState('');

    const update = async () => {
        try {
            const formData = new FormData();
                formData.append('Id', auth?.auth?.id);
                formData.append('Img', img.value);
            await updateUserImg(formData);
            const data = await fetchUser(auth?.auth?.login);
                user.setUser(data.user);
                close();
        } catch (e) {
            setMessageError(e?.response?.data?.message);
        }
    }

    const close = () => {
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
                    Edit Photo
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='error_message'>{messageError}</div>
                <Form>
                    {(img.isDirty && img.imgError) && 
                        <div className='error_message'>
                            {img.messageError}
                        </div>}
                    <Form.Control
                        className='form-update-photo'
                        type='file'
                        onChange={e => img.saveImg(e)}
                        onBlur={e => img.onBlur(e)}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button_update_photo'
                    variant='link'
                    disabled={!img.inputValid}
                    onClick={update}
                >
                    Update
                </Button>
                <Button
                    className='button_update_photo_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default UpdatePhoto;