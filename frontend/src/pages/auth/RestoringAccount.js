import { observer } from 'mobx-react-lite';
import React from 'react';
import { useContext } from 'react';
import { Button, Container, Form, ModalFooter, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router';
import { Context } from '../..';
import './css/Auth.css'
import { restore, restoring } from '../../http/restoringAccount';
import { useInput } from '../../utils/validate';
import { LOGIN_ROUTE } from '../../utils/constRoutes';

const RestoringAccount = observer(() => {
    const { messages } = useContext(Context);
    const email = useInput('', {minLength: {value: 4, name: 'Email'}, isEmail: true});
    const navigate = useNavigate();
    const search = useLocation().search;
    const token = new URLSearchParams(search).get('token');

    const click = async () => {
        try {
            const data = await restoring(email.value);
                messages.setMessage(data.message);
        } catch (e) {
            messages.setMessageError(e.response.data.message);
        }
    }

    if (token !== null) {
        try {
            const data = restore(token);
            if (!data.isDeleted) {
                messages.setMessage(data.message);
                navigate(LOGIN_ROUTE);
            }
        } catch (error) {
            messages.setMessageError(error.response.data.message);
        } 
    }

    return (
        <Row className='loginFonPage'>
            <Container className='containerAuth'>
                <Form
                    className='formAuth'
                >
                    <div 
                        className='error_message' 
                        style={{ textName: 'italic' }}
                    >
                        {messages.messageError}
                    </div>
                    <div 
                        className='error_message' 
                        style={{ textName: 'italic' }}
                    >
                        {messages.message}
                    </div>
                    {((email.isDirty && email.minLengthError) || 
                        (email.isDirty && email.emailError)) && 
                        <div className='error_message'>
                            {email.messageError}
                        </div>}
                    <Form.Control
                        className='formControlAuth'
                        placeholder='Email'
                        value={email.value}
                        onChange={e => email.onChange(e)}
                        onBlur={e => email.onBlur(e)}
                    />
                    
                    <ModalFooter 
                        className='modalFooterAuth'
                    >
                        <Button 
                            className='buttonAuth'
                            variant='outline-primary'
                            disabled={!email.inputValid}
                            onClick={click}
                        >
                            Restore
                        </Button>
                    </ModalFooter>
                </Form>
            </Container>
        </Row>
    );
});

export default RestoringAccount;