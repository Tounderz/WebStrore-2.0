import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Form, Modal, Button, FloatingLabel } from 'react-bootstrap';
import { fetchUsers, formDataUser, updateUser } from '../../http/userApi';
import { useInput } from '../../utils/validate';
import { Context } from '../../index';
import {  PAGE_FIRST, SELECT_GENDER, SELECT_ROLE } from '../../utils/const';
import './css/UpdateUser.css'

const UpdateUser = observer(({show, onHide}) => {
    const { user, pagination, gender, role, auth } = useContext(Context);
    const name = useInput('', {minLength: {value: 3, name: 'Name'}});
    const lastname = useInput('', {minLength: {value: 3, name: 'Surname'}});
    const genderId = useInput(0, {isNumberId: {name: 'Gender'}});
    const dateOfBirth = useInput('',{minLength: {value: 1, name: 'DateOfBirth'}, age: {name: 'DateOfBirth'}} );
    const email = useInput('', {minLength: {value: 4, name: 'Email'}, isEmail: true});
    const phone = useInput('', {isPhone: true});
    const login = useInput('', {minLength: {value: 3, name: 'Login'}});
    const roleId = useInput(0, { isNumberId: {name: 'Role'} });
    const img = useInput(null, {isImg: { name: 'Img' }} );
    const [messageError, setMessageError] = useState('');
    const roleArray = [];

    for (let index = 0; index < role?.roles?.length; index++) {
        if (auth?.auth?.role === 'admin' && role.roles[index] !== 'admin') {
            roleArray.push(role.roles[index])
        } else if (auth?.auth?.role === 'moderator' && 
                    role.roles[index] !== 'admin' && 
                    role.roles[index] !== 'moderator') {
            roleArray.push(role.roles[index])
        }
    }
    
    const update = async () => {
        try {
            setMessageError('');
            let formData;
            if (auth?.auth?.role === 'admin' || auth?.auth?.role === 'moderator') {
                formData = formDataUser(
                    user?.selectedUser?.id, name.value, 
                    lastname.value, genderId.value, 
                    dateOfBirth.value, email.value, 
                    phone.value, login.value, 
                    '', img.value, roleId.value
                );
            } else {
                formData = formDataUser(
                    user?.selectedUser?.id, name.value, 
                    lastname.value, genderId.value, 
                    dateOfBirth.value, email.value, 
                    phone.value, login.value, 
                    '', img.value, 0
                );
            }

            await updateUser(formData);
            if (auth?.auth?.role === 'admin' || auth?.auth?.role === 'moderator') {
                const data = await fetchUsers(PAGE_FIRST);
                    user.setUsersList(data.usersList);
                    pagination.setCountPages(data.countPages);
                    user.setSelectedUser({});
            }
            close();
        } catch (e) {
            setMessageError(e?.response?.data?.message);
        }
    }

    const close = () => {
        name.onChange('');
        lastname.onChange('');
        document.getElementById(SELECT_GENDER).value = '0';
        genderId.onChange('');
        dateOfBirth.onChange('');
        email.onChange('');
        phone.onChange('');
        login.onChange('');
        document.getElementById(SELECT_ROLE).value = '0';
        roleId.onChange('');
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
                    Edit User : {user?.selectedUser?.login}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='error_message'>{messageError}</div>
                <Form>
                    {(name.isDirty && name.minLengthError) && 
                        <div className='error_message'>
                            {name.messageError}
                        </div>}
                    <FloatingLabel label='Name'>
                        <Form.Control
                            className='form-update-user'
                            value={name.value.length > 0 ? 
                                name.value : user?.selectedUser?.name}
                            onChange={e => name.onChange(e)}
                            onBlur={e => name.onBlur(e)}
                            placeholder='Name'
                        />
                    </FloatingLabel>

                    {(lastname.isDirty && lastname.minLengthError) && 
                        <div className='error_message'>
                            {lastname.messageError}
                        </div>}
                    <FloatingLabel label='Lastname'>
                        <Form.Control
                            className='form-update-user'
                            value={lastname.value.length > 0 ? 
                                lastname.value : user?.selectedUser?.lastname}
                            onChange={e => lastname.onChange(e)}
                            onBlur={e => lastname.onBlur(e)}
                            placeholder='Lastname'
                        />
                    </FloatingLabel>

                    {(genderId.isDirty && genderId.isNumberError) && 
                        <div className='error_message'>
                            {genderId.messageError}
                        </div>}
                    <FloatingLabel label='Selected Gender'>
                        <Form.Select 
                            id={SELECT_GENDER}
                            className='form-update-user-select'
                            onChange={e => genderId.onChange(e)}
                            onBlur={e => genderId.onBlur(e)}
                        >
                            <option 
                                key='0'
                                value='0'
                            >
                               {`Current Gender: ${gender?.genders?.find(el => el.id === user?.selectedUser?.genderId)?.genderName}`}
                            </option>
                            {gender?.genders?.map(item => (
                                <option
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
                            className='form-update-user'
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
                            className='form-update-user'
                            type='email'
                            placeholder='Email address'
                            value={email.value.length > 0 ? 
                                email.value : user?.selectedUser?.email}
                            onChange={e => email.onChange(e)}
                            onBlur={e => email.onBlur(e)}
                        />
                    </FloatingLabel>

                    {((phone.isDirty && phone.isEmpty) || 
                        (phone.isDirty && phone.phoneError)) && 
                        <div className='error_message'>{phone.messageError}</div>}
                    <FloatingLabel label='Phone'>
                        <Form.Control
                            className='form-update-user'
                            type='tel' 
                            value={phone.value.length > 0 ? 
                                phone.value : user?.selectedUser?.phone}
                            onChange={e => phone.onChange(e)}
                            onBlur={e => phone.onBlur(e)}
                            placeholder='Phone'
                        />
                    </FloatingLabel>

                    {(login.isDirty && login.minLengthError) && 
                        <div className='error_message'>
                            {login.messageError}
                        </div>}
                    <FloatingLabel label='Login'>
                        <Form.Control
                            className='form-update-user'
                            value={login.value.length > 0 ? login.value : user?.selectedUser?.login}
                            onChange={e => login.onChange(e)}
                            onBlur={e => login.onBlur(e)}
                            placeholder='Login'
                        />
                    </FloatingLabel>
                    {(auth?.auth?.role === 'admin' || auth?.auth?.role === 'moderator') ? 
                        <Form>
                        {(roleId.isDirty && roleId.minLengthError) && 
                            <div className='error_message'>{roleId.messageError}</div>}
                        <FloatingLabel label='Selected Role'>
                            <Form.Select
                                id={SELECT_ROLE} 
                                className='form-update-user' 
                                onChange={e => roleId.onChange(e)}
                                onBlur={e => roleId.onBlur(e)}
                            >
                                <option 
                                    key='0'
                                    value='0'
                                >
                                    {`Current Role: ${role?.roles?.find(el => el.id === user?.selectedUser?.roleId)?.roleName}`}
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
                        </Form>
                        :
                        ''
                    }

                    {(img.isDirty && img.imgError) && 
                        <div className='error_message'>
                            {img.messageError}
                        </div>}
                    <Form.Control
                        className='form-update-user'
                        type='file'
                        onChange={e => img.saveImg(e)}
                        onBlur={e => img.onBlur(e)}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    className='button_update_user'
                    variant='link'
                    disabled={
                        !name.inputValid && 
                        !lastname.inputValid && 
                        !genderId.inputValid &&
                        !dateOfBirth.inputValid &&
                        !email.inputValid && 
                        !phone.inputValid && 
                        !login.inputValid && 
                        !roleId.inputValid && 
                        !img.inputValid
                    }
                    onClick={update}
                >
                    Update
                </Button>
                <Button
                    className='button_update_user_close'
                    variant='link'
                    onClick={close}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default UpdateUser;