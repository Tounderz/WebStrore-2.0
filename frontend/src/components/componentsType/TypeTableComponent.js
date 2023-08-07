import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import '../../pages/admin/css/AdminPage.css';
import { Context } from '../../index';
import UpdateType from './UpdateType';
import ConfirmRemoval from '../componentsConfirmRemoval/ConfirmRemoval';

const TypeTableComponent = observer(({item}) => {
    const { remove, type, category } = useContext(Context);
    const [editVisible, setEditVisible] = useState(false);
    const [removeVisible, setRemoveVisible] = useState(false);

    const typeUpdate = async () => {
            type.setSelectedType(item);
            setEditVisible(true);
    }

    const typeRemove = async () => {
        setRemoveVisible(true);
        remove.setRemoveObjeck(item);
        remove.setRemoveParameterName('type');
    }

    return (
        <tr key={item.id}>
            <th scope='col'>{item.id}</th>
            <th scope='col'>{category?.categories?.find(i => i.id === item.categoryId)?.name}</th>
            <th scope='col'>{item.name}</th>
            <th className='col'>
                <Button
                    className='button_update'
                    variant='link'
                    onClick={typeUpdate}
                >
                    Edit
                </Button>
            </th>
            <th className='col'>
                <Button
                    className='button_remove'
                    variant='link'
                    onClick={typeRemove}
                >
                    Remove
                </Button>
            </th>
            <UpdateType show={editVisible} onHide={() => setEditVisible(false)}/>
            <ConfirmRemoval show={removeVisible} onHide={() => setRemoveVisible(false)}/>
        </tr>
    );
});

export default TypeTableComponent;