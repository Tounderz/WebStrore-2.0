import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Context } from '../../index';
import { ROLE } from '../../utils/const';
import UpdateRole from './UpdateRole';
import { fetchRole } from '../../http/roleApi';
import '../../pages/admin/css/AdminPage.css';
import { Button } from 'react-bootstrap';
import ConfirmRemoval from '../componentsConfirmRemoval/ConfirmRemoval';

const RoleTableComponent = observer(({item}) => {
    const { remove, role} = useContext(Context);
    const [editVisible, setEditVisible] = useState(false);
    const [removeVisible, setRemoveVisible] = useState(false);

    const roleUpdate = async () => {
        const data = await fetchRole(item.id);
            role.setSelectedRole(data.role);
        setEditVisible(true);
    }

    const roleRemove = async () => {
        setRemoveVisible(true);
            remove.setRemoveObjeck(item);
            remove.setRemoveParameterName(ROLE);
    }

    return (
        <tr key={item.id}>
            <th scope='col'>{item.id}</th>
            <th scope='col'>{item.roleName}</th>
            <th className='col'>
                <Button
                    className='button_update'
                    variant='link'
                    onClick={roleUpdate}
                >
                    Edit
                </Button>
            </th>
            <th className='col'>
                <Button
                    className='button_remove'
                    variant='link'
                    onClick={roleRemove}
                >
                    Remove
                </Button>
            </th>
            <UpdateRole show={editVisible} onHide={() => setEditVisible(false)}/>
            <ConfirmRemoval show={removeVisible} onHide={() => setRemoveVisible(false)}/>
        </tr>
    );
});

export default RoleTableComponent;