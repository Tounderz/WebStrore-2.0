import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import UpdateGender from './UpdateGender';
import ConfirmRemoval from '../componentsConfirmRemoval/ConfirmRemoval';
import { Context } from '../../index';
import { fetchGender } from '../../http/genderApi';
import { GENDER } from '../../utils/const';
import '../../pages/admin/css/AdminPage.css';

const GenderTableComponent = observer(({item}) => {
    const { remove, gender} = useContext(Context);
    const [editVisible, setEditVisible] = useState(false);
    const [removeVisible, setRemoveVisible] = useState(false);

    const genderUpdate = async () => {
        const data = await fetchGender(item.id);
            gender.setSelectedGender(data.gender);
        setEditVisible(true);
    }

    const roleRemove = async () => {
        setRemoveVisible(true);
            remove.setRemoveObjeck(item);
            remove.setRemoveParameterName(GENDER);
    }

    return (
        <tr key={item.id}>
            <th scope='col'>{item.id}</th>
            <th scope='col'>{item.genderName}</th>
            <th className='col'>
                <Button
                    className='button_update'
                    variant='link'
                    onClick={genderUpdate}
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
            <UpdateGender show={editVisible} onHide={() => setEditVisible(false)}/>
            <ConfirmRemoval show={removeVisible} onHide={() => setRemoveVisible(false)}/>
        </tr>
    );
});

export default GenderTableComponent;