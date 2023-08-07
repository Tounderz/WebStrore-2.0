import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router';
import { createNewPassword } from '../../http/retrievePasswordApi';
import { useInput } from '../../utils/validate';
import { LOGIN_ROUTE } from '../../utils/constRoutes';
import './css/RetrieveYourPasswordPage.css'
import './css/Auth.css'
import { Context } from '../../index';

const RetrieveYourPasswordPage = observer(() => {
    const { messages } = useContext(Context);
    const newPassword = useInput('', {minLength: {value: 6, name: 'New Password'}});
    const confirmPassword = useInput('', {minLength: {value: 6, name: 'Confirm Password'}, isConfirmPassword: {value: newPassword.value}});
    const search = useLocation().search;
    const token = new URLSearchParams(search).get('token');
    const navigate = useNavigate();

    const saveNewPassword = async () => {
        try {
            const data = await createNewPassword(token, newPassword.value);
                messages.setMessage(data.message);
                messages.setMessageError('');
                navigate(LOGIN_ROUTE);
        } catch (e) {
            messages.setMessageError(e.response.data.message);
            messages.setMessage('');
        } finally {
            newPassword.onChange('');
            confirmPassword.onChange('');
        }
    }
    
    return (
        <Row className='retrieveFonPage'>
            <Container className='container-retrieve'>
                <Form className='form-retrieve'>
                    <div className='error_message'>{messages.messageError}</div>
                    {((newPassword.isDirty && newPassword.minLengthError) || 
                        (newPassword.isDirty && newPassword.confirmPasswordError)) && 
                        <div className='error_message'>
                            {newPassword.messageError}
                        </div>} 
                    <Form.Control
                        className='form-control-retrieve'
                        type="password"
                        placeholder="New password"
                        value={newPassword.value}
                        onChange={e => newPassword.onChange(e)}
                        onBlur={e => newPassword.onBlur(e)}
                    />

                    {((confirmPassword.isDirty && confirmPassword.minLengthError) || (confirmPassword.isDirty && confirmPassword.confirmPasswordError)) && 
                        <div className='error_message'>{confirmPassword.messageError}</div>
                    }
                    <Form.Control
                        className='form-control-retrieve'
                        type='password'
                        placeholder='ConfirmPassword'
                        value={confirmPassword.value}
                        onChange={e => confirmPassword.onChange(e)}
                        onBlur={e => confirmPassword.onBlur(e)}
                    />

                    <Button
                        className='button-retrieve'
                        variant='outline-success'
                        disabled={
                            !newPassword.inputValid || 
                            !confirmPassword.inputValid
                        }
                        onClick={saveNewPassword}
                    >
                        Save
                    </Button>
                </Form>
            </Container>
        </Row>
    );
});

export default RetrieveYourPasswordPage;