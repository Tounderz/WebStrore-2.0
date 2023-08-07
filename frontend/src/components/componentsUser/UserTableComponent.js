import { observer } from 'mobx-react-lite';
import React from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { fetchUsers } from '../../http/userApi';
import { Context } from '../../index';
import { PAGE_FIRST } from '../../utils/const';
import ConfirmRemoval from '../componentsConfirmRemoval/ConfirmRemoval';
import UpdateUser from './UpdateUser';
import '../../pages/admin/css/AdminPage.css';

const UserTableComponent = observer(({item}) => {
    const { remove, user, pagination, search, sort, gender, role } = useContext(Context);
    const [userUpdateVisible, setUserUpdateVisible] = useState(false);
    const [removeVisible, setRemoveVisible] = useState(false);

    const userRemove = async (item) => {
        setRemoveVisible(true);
        remove.setRemoveObjeck(item);
        remove.setRemoveParameterName('user');
    };

    const userUpdate = async (item) => {
        user.setSelectedUser(item);
            setUserUpdateVisible(true);
        allUsers();
    };

    const allUsers = async () => {
        pagination.setCurrentPage(PAGE_FIRST);
        cleanSearchAndSort();
        const data = await fetchUsers(PAGE_FIRST);
            user.setUsersList(data.usersList);
            pagination.setCountPages(data.countPages);
    }

    const cleanSearchAndSort = () => {
        sort.setFieldNames([]);
        sort.setFieldName('');
        sort.setTypeSort('');
        search.setSearchBy('');
        search.setSelectedSearchParameter('');
    }


    return (
        <tr key={item.id}>
            <th className='col'>{item.id}</th>
            <th className='col'>{item.name}</th>
            <th className='col'>{item.surname}</th>
            <th className='col'>{gender?.genders?.find(el => el.id === item.genderId)?.genderName }</th>
            <th className='col'>{item.dateOfBirth}</th>
            <th className='col'>{item.email}</th>
            <th className='col'>{item.phone}</th>
            <th className='col'>{item.login}</th>
            <th className='col'>{role?.roles?.find(el => el.id === item.roleId)?.roleName }</th>
            <th className='col'>{item.isConfirmEmail.toString()}</th>
            <th className='col'>{item.isDeleted.toString()}</th>
            <th className='col'>
                <Button
                    className='button_update'
                    variant='link'
                    disabled={!role?.roles?.some((i) => i === item.roleId)}
                    onClick={() => userUpdate(item)}
                >
                    Edit
                </Button>
            </th>
            <th className='col'>
                <Button
                    className='button_remove'
                    variant='link'
                    disabled={!role?.roles?.some((i) => i === item.role)}
                    onClick={() => userRemove(item)}
                >
                    Remove
                </Button>                         
            </th>

            <UpdateUser
                show={userUpdateVisible}
                onHide={() => setUserUpdateVisible(false)}
            />     
            <ConfirmRemoval show={removeVisible} onHide={() => setRemoveVisible(false)}/>       
        </tr>
    );
});

export default UserTableComponent;