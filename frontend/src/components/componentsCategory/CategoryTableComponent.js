import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Context } from '../../index';
import { fetchBrands } from '../../http/brandApi';
import UpdateCategory from './UpdateCategory';
import ConfirmRemoval from '../componentsConfirmRemoval/ConfirmRemoval';
import { Button } from 'react-bootstrap';
import { CATEGORY } from '../../utils/const';
import '../../pages/admin/css/AdminPage.css';

const CategoryTableComponent = observer(({item}) => {
    const { remove, category, brand } = useContext(Context);
    const [editVisible, setEditVisible] = useState(false);
    const [removeVisible, setRemoveVisible] = useState(false);

    const categoryUpdate = async () => {
        const data = await fetchBrands(item.id);
            brand.setBrandsByCategory(data.brands);
            category.setSelectedCategory(item);
            setEditVisible(true);
    }

    const categoryRemove = async () => {
        setRemoveVisible(true);
        remove.setRemoveObjeck(item);
        remove.setRemoveParameterName(CATEGORY);
    }

    return (
        <tr key={item.id}>
            <th scope='col'>{item.id}</th>
            <th scope='col'>{item.name}</th>
            <th scope='col'>{item.shortDescription}</th>
            <th scope='col'>{item.countView}</th>
            <th className='col'>
                <Button
                    className='button_update'
                    variant='link'
                    onClick={categoryUpdate}
                >
                    Edit
                </Button>
            </th>
            <th className='col'>
                <Button
                    className='button_remove'
                    variant='link'
                    onClick={categoryRemove}
                >
                    Remove
                </Button>
            </th>
            <UpdateCategory show={editVisible} onHide={() => setEditVisible(false)}/>
            <ConfirmRemoval show={removeVisible} onHide={() => setRemoveVisible(false)}/>
        </tr>
    );
});

export default CategoryTableComponent;