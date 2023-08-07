import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Form, Modal, Button, FloatingLabel } from 'react-bootstrap';
import { Context } from '../../index';
import { useInput } from '../../utils/validate';
import { updatePassword } from '../../http/userApi';
import './css/UpdatePassword.css'

const UpdatePassword = observer(({show, onHide}) => {
    const { user } = useContext(Context);
    const currentPassword = useInput('', {minLength: {value: 6, name: 'Password'}});
    const newPassword = useInput('', {minLength: {value: 6, name: 'New Password'}, isConfirmPassword: {value: currentPassword.value}});
    const confirmPassword = useInput('', {minLength: {value: 6, name: 'Confirm Password'}, isConfirmPassword: {value: newPassword.value}});
    const [messageError, setMessageError] = useState('');

    const update = async () => {
        try {
            const data = await updatePassword(currentPassword.value, newPassword.value, user.idUser);
                user.setSelectedUser(data.user);
                close();
        } catch (e) {
            setMessageError(e.response.data.message);
        }
    }

    const close = () => {
        currentPassword.onChange('');
        newPassword.onChange('');
        confirmPassword.onChange('');
        setMessageError('')
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
                    Update Password
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='error_message'>
                    {messageError}
                </div>
                <Form>
                    {(currentPassword.isDirty && currentPassword.minLengthError) && 
                        <div className='error_message'>
                            {currentPassword.messageError}
                        </div>}
                    <FloatingLabel label='Current Password'>
                        <Form.Control
                            className='form-update-password'
                            type='password'
                            placeholder='Current Password'
                            value={currentPassword.value}
                            onChange={e => currentPassword.onChange(e)}
                            onBlur={e => currentPassword.onBlur(e)}
                        />
                    </FloatingLabel>
 
                    {((newPassword.isDirty && newPassword.minLengthError) || 
                        (newPassword.isDirty && newPassword.confirmPasswordError)) && 
                        <div className='error_message'>
                            {newPassword.messageError}
                        </div>}
                    <FloatingLabel label='New Password'>
                        <Form.Control
                            className='form-update-password'
                            type='password'
                            placeholder='New password'
                            value={newPassword.value}
                            onChange={e => newPassword.onChange(e)}
                            onBlur={e => newPassword.onBlur(e)}
                        />
                    </FloatingLabel>

                    {((confirmPassword.isDirty && confirmPassword.minLengthError) || 
                        (confirmPassword.isDirty && confirmPassword.confirmPasswordError)) && 
                        <div className='error_message'>
                            {confirmPassword.messageError}
                        </div>}
                    <FloatingLabel label='Confirm Password'>
                        <Form.Control
                            className='form-update-password'
                            type='password'
                            placeholder='Confirm Password'
                            value={confirmPassword.value}
                            onChange={e => confirmPassword.onChange(e)}
                            onBlur={e => confirmPassword.onBlur(e)}
                        />
                    </FloatingLabel>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button_update_password'
                    variant='link'
                    disabled={
                        !currentPassword.inputValid || 
                        !newPassword.inputValid || 
                        !confirmPassword.inputValid
                    }
                    onClick={update}
                >
                    Update
                </Button>
                <Button 
                    className='button_update_password_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default UpdatePassword;