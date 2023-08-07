import React, { useContext, useState } from "react";
import { REGISTER_ROUTE, PERSONAL_ACCOUNT_ROUTE, RESTORE_ROUTE, VERIFY_EMAIL_ROUTE } from "../../utils/constRoutes";
import { NavLink } from 'react-router-dom';
import { Button, Container, Form, ModalFooter, Row } from "react-bootstrap";
import { Context } from "../../index";
import { useNavigate } from "react-router";
import { fetchUser } from "../../http/userApi";
import { useInput } from "../../utils/validate";
import './css/Auth.css'
import RetrieveYourPasswordComponent from "../../components/componentsUser/RetrieveYourPasswordComponent";
import { observer } from "mobx-react-lite";
import { signIn } from "../../http/authApi";

const Login = observer(() => {
    const { auth, user, messages } = useContext(Context);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isConfirmEmail, setIsConfirmEmail] = useState(true);
    const login = useInput('', {minLength: {value: 3, name: 'login'}});
    const password = useInput('', {minLength: {value: 4, name: 'password'}});
    const navigate = useNavigate();
    const [retrievePasswordVisible, setRetrievePasswordVisible] = useState(false);

    const click = async () => {
        try {
            const data = await signIn(login.value, password.value);
            if (data.isDeleted) {
                setIsDeleted(true);
            } else if (!data.isConfirmEmail) {
                setIsConfirmEmail(false);
            } else if (!data.isDeleted && data.isConfirmEmail) {
                localStorage.setItem('accessToken', data.accessToken);
                auth.setAuth(data.user);
                const dataUser = await fetchUser(data.user.login);
                    user.setUser(dataUser.user);
                    clearMessage();
                navigate(PERSONAL_ACCOUNT_ROUTE);
            }
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
        } finally {
            login.onChange('');
            password.onChange('');
        }
    }

    const clearMessage = () => {
        messages.setMessageError('');
        messages.setMessage('');
    }

    const restore = () => {
        clearMessage();
        navigate(RESTORE_ROUTE);
    }

    const verifyEmail = () => {
        clearMessage();
        navigate(VERIFY_EMAIL_ROUTE);
    };

    return (
        <Row className='loginFonPage'>
            <Container className='containerAuth'>
                <Form
                    className='formAuth'
                >
                    <h1 style={{ textName: 'italic' }}>Please Sign In</h1>
                    <h5 style={{ textName: 'italic' }}>{messages.message}</h5>
                    <div className='error_message'>{messages.messageError}</div>
                    {(login.isDirty && login.minLengthError) && <div className='error_message'>{login.messageError}</div>}
                    <Form.Control
                        className='formControlAuth'
                        placeholder='Login'
                        value={login.value}
                        onChange={e => login.onChange(e)}
                        onBlur={e => login.onBlur(e)}
                    />

                    {((password.isDirty && password.minLengthError)) && <div className='error_message'>{password.messageError}</div>}
                    <Form.Control
                        className='formControlAuth'
                        type="password"
                        placeholder="Password"
                        value={password.value}
                        onChange={e => password.onChange(e)}
                        onBlur={e => password.onBlur(e)}
                    />
                    
                    <div 
                        className='checkboxLogin'
                    >
                        Remembre me 
                        <input 
                            className='input-checkbox-auth'
                            type='checkbox' 
                            value='remember-me'
                        />
                        <Button
                            variant='outline-primary'
                            className='forgot-your-password-auth'
                            onClick={() => setRetrievePasswordVisible(true)}
                        >
                            Forgot your password?
                        </Button>
                    </div>
                    
                    <ModalFooter 
                        className='modalFooterAuth'
                    >
                        {isDeleted ? 
                            <Button
                                className='button-restore-login'
                                variant='outline-success'
                                onClick={() => restore()}
                            >
                                Recovery user
                            </Button>
                        :
                        ''
                        }
                        {!isConfirmEmail ? 
                            <Button
                                className='button-restore-login'
                                variant='outline-success'
                                onClick={() => verifyEmail()}
                            >
                                Confirm Email
                            </Button>
                            :
                            ''
                        }
                        Not an account? 
                        <NavLink 
                            className='nav-link-sign-up'
                            to={REGISTER_ROUTE}
                        >
                            Sign Up
                        </NavLink>
                        <Button 
                            className='buttonAuth'
                            variant='outline-primary'
                            disabled={!login.inputValid || !password.inputValid}
                            onClick={click}
                        >
                            Sign in
                        </Button>
                    </ModalFooter>
                </Form>
            </Container>
            <RetrieveYourPasswordComponent  show={retrievePasswordVisible} onHide={() => setRetrievePasswordVisible(false)}/>
        </Row>
    );
});

export default Login;