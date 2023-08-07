import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import UpdateBrand from './UpdateBrand';
import ConfirmRemoval from '../componentsConfirmRemoval/ConfirmRemoval';
import { fetchCategories } from '../../http/categoryApi';
import '../../pages/admin/css/AdminPage.css';
import { Context } from '../../index';
import { BRAND } from '../../utils/const';

const BrandTableComponent = observer(({item}) => {
    const { remove, category, brand } = useContext(Context);
    const [editVisible, setEditVisible] = useState(false);
    const [removeVisible, setRemoveVisible] = useState(false);

    const brandUpdate = async () => {
        const data = await fetchCategories(item.id);
            category.setCategoriesByBrand(data.categories)
            brand.setSelectedBrand(item);
            setEditVisible(true);
    }

    const brandRemove = async () => {
        setRemoveVisible(true);
            remove.setRemoveObjeck(item);
            remove.setRemoveParameterName(BRAND);
    }

    return (
        <tr key={item.id}>
            <th scope='col'>{item.id}</th>
            <th scope='col'>{item.name}</th>
            <th scope='col'>{item.countView}</th>
            <th className='col'>
                <Button
                    className='button_update'
                    variant='link'
                    onClick={brandUpdate}
                >
                    Edit
                </Button>
            </th>
            <th className='col'>
                <Button
                    className='button_remove'
                    variant='link'
                    onClick={brandRemove}
                >
                    Remove
                </Button>
            </th>
            <UpdateBrand show={editVisible} onHide={() => setEditVisible(false)}/>
            <ConfirmRemoval show={removeVisible} onHide={() => setRemoveVisible(false)}/>
        </tr>
    );
});

export default BrandTableComponent;