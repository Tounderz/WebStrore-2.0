import React from 'react';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Context } from '../../index';
import { LOGIN_ROUTE, VERIFY_EMAIL_ROUTE } from '../../utils/constRoutes';
import { Button, Card, Container, Form, ModalFooter, Row } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useInput } from '../../utils/validate';
import { confirmEmail, updateTokenConfirm } from '../../http/confirmEmailApi';

const VerifyEmail = observer(() => {
    const navigate = useNavigate();
    const { messages } = useContext(Context);
    const email = useInput('', {minLength: {value: 4, name: 'Email'}, isEmail: true});
    const search = useLocation().search;
    const token = new URLSearchParams(search).get('token');

    if (token !== null) {
        try {
            const data = confirmEmail(token);
            if (data.confirmEmail === 'true') {
                messages.setMessage(data.message);
                navigate(LOGIN_ROUTE);
            }
        } catch (e) {
            messages.setMessageError(e.response.data.message);
            navigate(VERIFY_EMAIL_ROUTE);
        }
    }

    const click = async () => {
        try {
            const data = await updateTokenConfirm(email.value);
                messages.setMessage(data.message);
        } catch (error) {
            messages.setMessageError(error.response.data.message);
        }
    }

    return (
        <Row className='orderFonPage'>
            <Container className='containerOrder'>
                <Card className='cardOrder'>
                    <h2>Send an email again</h2>
                    <div className='error_message'>{messages.messageError}</div>
                    <div className='error_message'>{messages.message}</div>
                    {(email.isDirty && email.minLengthError) && <div className='error_message'>{email.messageError}</div>}
                    {(email.isDirty && email.emailError) && <div className='error_message'>{email.messageError}</div>}
                    <Form.Control
                        className='formControlOrder'
                        placeholder='Email'
                        value={email.value}
                        onChange={e => email.onChange(e)}
                        onBlur={e => email.onBlur(e)}
                    />

                    <ModalFooter
                        className='modalFooterOrder'
                    >
                        <Button
                            className='buttonOrder'
                            variant='outline-primary'
                            disabled={!email.inputValid}
                            onClick={click}
                        >
                            Send
                        </Button>
                    </ModalFooter>
                </Card>
            </Container>
        </Row>
    );
});

export default VerifyEmail;