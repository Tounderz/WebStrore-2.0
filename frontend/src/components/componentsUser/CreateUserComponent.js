import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import { useInput } from '../../utils/validate';
import { Context } from '../../index';
import { PAGE_FIRST, SELECT_GENDER, SELECT_ROLE } from '../../utils/const';
import './css/CreateUserComponent.css';
import { fetchUsers, formDataUser, register } from '../../http/userApi';

const CreateUserComponent = observer(({show, onHide}) => {
    const { gender, role, user, pagination } = useContext(Context);
    const name = useInput('', { minLength: {value: 3, name: 'Name'}});
    const lastName = useInput('', {minLength: {value: 4, name: 'Surname'}});
    const genderId = useInput(0, {isNumberId: {name: 'Gender'}});
    const roleId = useInput(0, {isNumberId: {name: 'Role'}});
    const dateOfBirth = useInput('', {minLength: {value: 1, name: 'DateOfBirth'}, age: {name: 'DateOfBirth'}} );
    const email = useInput('', {minLength: {value: 4, name: 'Email'}, isEmail: true});
    const phone = useInput('', {isPhone: true});
    const login = useInput('', {minLength: {value: 3, name: 'Login'}});
    const password = useInput('', {minLength: {value: 6, name: 'Password'}});
    const img = useInput(null);
    const [messageError, setMessageError] = useState('');

    const click = async () => {
        try {
            const formData = formDataUser(0, name.value, lastName.value, 
                genderId.value, dateOfBirth.value, email.value, 
                phone.value, login.value, password.value, img.value, 0);
            await register(formData);
            const data = await fetchUsers(PAGE_FIRST);
                user.setUsers(data.users);
                pagination.setCountPages(data.countPages);
                pagination.setCurrentPage(PAGE_FIRST);
            close();
        } catch (e) {
            setMessageError(e?.response?.data?.message)
        }
    }

    const close = () => {
        name.onChange('');
        lastName.onChange('');
        email.onChange('');
        document.getElementById(SELECT_GENDER).value = '0';
        genderId.onChange(0);
        document.getElementById(SELECT_ROLE).value = '0';
        roleId.onChange(0);
        dateOfBirth.onChange('');
        phone.onChange('');
        login.onChange('');
        password.onChange('');
        img.saveImg(null);
        setMessageError('');
        onHide();
    }

    return (
        <Modal
            show={show}
            onHide={close}
            centered
            className='modal_create_user'
        >
            <Modal.Header closeButton>
                <Modal.Title 
                    id='contained-modal-title-vcenter'
                >
                    New User
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='error_message'>{messageError}</div>
                <Form>
                    <div className='error_message'>{messageError}</div>

                    {(name.isDirty && name.minLengthError) && 
                        <div className='error_message'>{name.messageError}</div>}
                    <FloatingLabel label='Name'>
                        <Form.Control
                            className='form_control_create_user'
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
                            className='form_control_create_user'
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
                            className='form_control_create_user'
                            onChange={e => genderId.onChange(e)}
                            onBlur={e => genderId.onBlur(e)}
                        >
                            <option 
                                className='form_control_create_user-select-option'
                                key='0'
                                value='0'
                            >
                                Select a gender
                            </option>
                            {gender?.genders?.map(item => (
                                <option
                                    className='form_control_create_user-select-option'
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.genderName}
                                </option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>

                    {(roleId.isDirty && roleId.isNumberError) && 
                        <div className='error_message'>
                            {roleId.messageError}
                        </div>}
                    <FloatingLabel label='Selected Role'>
                        <Form.Select 
                            id={SELECT_ROLE}
                            className='form_control_create_user'
                            onChange={e => roleId.onChange(e)}
                            onBlur={e => roleId.onBlur(e)}
                        >
                            <option 
                                key='0'
                                value='0'
                            >
                                Select a role
                            </option>
                            {role?.roles?.map(item => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.roleName}
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
                            className='form_control_create_user'
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
                            className='form_control_create_user'
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
                            className='form_control_create_user'
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
                            className='form_control_create_user'
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
                            className='form_control_create_user'
                            type='password'
                            placeholder='Password'
                            value={password.value}
                            onChange={e => password.onChange(e)}
                            onBlur={e => password.onBlur(e)}
                        />
                    </FloatingLabel>

                    {(img.isDirty && img.imgError) && 
                        <div className='error_message'>{img.messageError}</div>}
                    <Form.Control
                        className='form_control_create_user'
                        type='file'
                        onChange={e => img.saveImg(e)}
                        onBlur={e => img.onBlur(e)}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button_create_user'
                    variant='link'
                    disabled={
                        !name.inputValid || 
                        !lastName.inputValid || 
                        !genderId.inputValid || 
                        !phone.inputValid || 
                        !email.inputValid ||
                        !roleId.inputValid ||
                        !login.inputValid || 
                        !password.inputValid
                    }
                    onClick={click}
                >
                    Create
                </Button>
                <Button
                    className='button_create_user_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateUserComponent;