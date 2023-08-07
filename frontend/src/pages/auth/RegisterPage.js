import React, { useState } from "react";
import { Button, Container, FloatingLabel, Form, ModalFooter, Row } from "react-bootstrap";
import { LOGIN_ROUTE } from "../../utils/constRoutes";
import { NavLink } from 'react-router-dom';
import { formDataUser, register } from "../../http/userApi";
import { useNavigate } from "react-router";
import { useInput } from "../../utils/validate";
import { observer } from "mobx-react-lite";
import { SELECT_GENDER } from "../../utils/const";
import { useContext } from "react";
import { Context } from "../../index";
import './css/Auth.css'
import { useEffect } from "react";
import { fetchGenders } from "../../http/genderApi";

const Register = observer(() => {
    const { gender, messages } = useContext(Context);
    const name = useInput('', { minLength: {value: 3, name: 'Name'}});
    const lastName = useInput('', {minLength: {value: 4, name: 'Surname'}});
    const genderId = useInput(0, {isNumberId: {name: 'Gender'}});
    const dateOfBirth = useInput('', {minLength: {value: 1, name: 'DateOfBirth'}, age: {name: 'DateOfBirth'}} );
    const email = useInput('', {minLength: {value: 4, name: 'Email'}, isEmail: true});
    const phone = useInput('', {isPhone: true});
    const login = useInput('', {minLength: {value: 3, name: 'Login'}});
    const password = useInput('', {minLength: {value: 6, name: 'Password'}});
    const confirmPassword = useInput('', {minLength: {value: 6, name: 'Confirm Password'}, isConfirmPassword: {value: password.value}});
    const img = useInput(null);
    const [messageError, setMessageError] = useState('');
    const navigate = useNavigate();

    useEffect(async() => {
        messages.setMessage('');
        messages.setMessageError('');
        const data = await fetchGenders(0);
            gender.setGenders(data.genders);
    });

    const click = async () => {
        try {
            const formData = formDataUser(0, name.value, lastName.value, 
                genderId.value, dateOfBirth.value, email.value, 
                phone.value, login.value, password.value, img.value, 0);
            await register(formData);
            navigate(LOGIN_ROUTE);
        } catch (e) {
            setMessageError(e.response.data.message)
        }
        finally{
            name.onChange('');
            lastName.onChange('');
            email.onChange('');
            document.getElementById(SELECT_GENDER).value = '0';
            genderId.onChange(0);
            dateOfBirth.onChange('');
            phone.onChange('');
            login.onChange('');
            password.onChange('');
            confirmPassword.onChange('');
            img.saveImg(null);
        } 
    }
    
    return (
        <Row className='loginFonPage'>
            <Container className='containerAuth'>
                <Form
                    className='formAuth'
                >
                    <h1 className="h3 mb-3 fw-normal">Please Sign Up</h1>
                    <div className='error_message'>{messageError}</div>

                    {(name.isDirty && name.minLengthError) && 
                        <div className='error_message'>{name.messageError}</div>}
                    <FloatingLabel label='Name'>
                        <Form.Control
                            className='formControlAuth'
                            placeholder='Name'
                            value={name.value}
                            onChange={e => name.onChange(e)}
                            onBlur={e => name.onBlur(e)}
                        />
                    </FloatingLabel>

                    {(lastName.isDirty && lastName.minLengthError) && 
                        <div className='error_message'>{lastName.messageError}</div>}
                    <FloatingLabel label='Lastname'>
                        <Form.Control
                            className='formControlAuth'
                            placeholder='Lastname'
                            value={lastName.value}
                            onChange={e => lastName.onChange(e)}
                            onBlur={e => lastName.onBlur(e)}
                        />
                    </FloatingLabel>

                    {(genderId.isDirty && genderId.isNumberError) && 
                        <div className='error_message'>
                            {genderId.messageError}
                        </div>}
                    <FloatingLabel label='Selected Gender'>
                        <Form.Select 
                            id={SELECT_GENDER}
                            className='formControlAuth'
                            onChange={e => genderId.onChange(e)}
                            onBlur={e => genderId.onBlur(e)}
                        >
                            <option 
                                className='formControlAuth-select-option'
                                key='0'
                                value='0'
                            >
                                Select a gender
                            </option>
                            {gender?.genders?.map(item => (
                                <option
                                    className='formControlAuth-select-option'
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.genderName}
                                </option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>

                    {(dateOfBirth.isDirty && dateOfBirth.dateError) && 
                        <div className='error_message'>
                            {dateOfBirth.messageError}
                        </div>}
                    <FloatingLabel label='Date Of Birth'>
                        <Form.Control
                            className='formControlAuth'
                            value={dateOfBirth.value}
                            placeholder='Date Of Birth'
                            type='date'
                            onChange={e => dateOfBirth.onChange(e)}
                            onBlur={e => dateOfBirth.onBlur(e)}
                        />
                    </FloatingLabel>

                    {((email.isDirty && email.emailError) || 
                        (email.isDirty && email.isEmpty)) && 
                        <div className='error_message'>{email.messageError}</div>}
                    <FloatingLabel label='Email address'>
                        <Form.Control
                            className='formControlAuth'
                            type='email' 
                            placeholder='Email address'
                            value={email.value}
                            onChange={e => email.onChange(e)}
                            onBlur={e => email.onBlur(e)}
                        />
                    </FloatingLabel>

                    {((phone.isDirty && phone.isEmpty) || 
                        (phone.isDirty && phone.phoneError)) && 
                        <div className='error_message'>{phone.messageError}</div>}
                    <FloatingLabel label='Phone number'>
                        <Form.Control
                            className='formControlAuth'
                            type='tel' 
                            placeholder='Phone number'
                            value={phone.value}
                            onChange={e => phone.onChange(e)}
                            onBlur={e => phone.onBlur(e)}
                        />
                    </FloatingLabel>

                    {(login.isDirty && login.minLengthError) && 
                        <div className='error_message'>{login.messageError}</div>}
                    <FloatingLabel label='Login'>
                        <Form.Control
                            className='formControlAuth'
                            placeholder='Login'
                            value={login.value}
                            onChange={e => login.onChange(e)}
                            onBlur={e => login.onBlur(e)}
                        />
                    </FloatingLabel>

                    {((password.isDirty && password.minLengthError) || 
                        (password.isDirty && password.passwordSecurityError)) && 
                        <div className='error_message'>{password.messageError}</div>}
                    <FloatingLabel label='Password'>
                        <Form.Control
                            className='formControlAuth'
                            type='password'
                            placeholder='Password'
                            value={password.value}
                            onChange={e => password.onChange(e)}
                            onBlur={e => password.onBlur(e)}
                        />
                    </FloatingLabel>

                    {((confirmPassword.isDirty && confirmPassword.minLengthError) 
                        || (confirmPassword.isDirty && confirmPassword.confirmPasswordError)) && 
                        <div className='error_message'>{confirmPassword.messageError}</div>}
                    <FloatingLabel label='ConfirmPassword'>
                        <Form.Control
                            className='formControlAuth'
                            type='password'
                            placeholder='ConfirmPassword'
                            value={confirmPassword.value}
                            onChange={e => confirmPassword.onChange(e)}
                            onBlur={e => confirmPassword.onBlur(e)}
                        />
                    </FloatingLabel>

                    {(img.isDirty && img.imgError) && 
                        <div className='error_message'>{img.messageError}</div>}
                    <Form.Control
                        className='formControlAuth'
                        type='file'
                        onChange={e => img.saveImg(e)}
                        onBlur={e => img.onBlur(e)}
                    />

                    <ModalFooter className='modalFooterAuth'>
                        There is an account? <NavLink className='nav-link-sign-up' to={LOGIN_ROUTE}>Sign in</NavLink>
                        <Button
                            className='buttonAuth'
                            variant='outline-primary'
                            disabled={
                                !name.inputValid || 
                                !lastName.inputValid || 
                                !genderId.inputValid || 
                                !phone.inputValid || 
                                !email.inputValid || 
                                !login.inputValid || 
                                !password.inputValid ||
                                !confirmPassword.inputValid
                            }
                            onClick={click}
                        >
                            Register
                        </Button>

                    </ModalFooter>
                </Form>
            </Container>
        </Row>
    );
})

export default Register;