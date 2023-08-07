import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { Context } from '../../index';
import UpdateInfoProduct from './UpdateInfoProduct';
import ConfirmRemoval from '../componentsConfirmRemoval/ConfirmRemoval';
import './css/ProductInfoComponent.css';

const ProductInfoComponent = observer(({id, info}) => {
  const { auth, remove } = useContext(Context);
  const [updateInfoVisible, setUpdateInfoVisible] = useState(false);
  const [removeVisible, setRemoveVisible] = useState(false);

  const productInfoRemove = async () => {
    setRemoveVisible(true);
        remove.setRemoveObjeck(info);
        remove.setRemoveParameterName('removeProductInfo');
}

  const admin = auth?.auth?.role !== 'user' && auth?.auth?.isAuth && (
    <Col className='col_button_info'>
      <Button
        className='button_update_info'
        variant='link'
        onClick={() => setUpdateInfoVisible(true)}
      >
        Update
      </Button>
      <Button
        className='button_remove_info'
        variant='link'
        onClick={() => productInfoRemove()}
      >
        Remove
      </Button>
      <UpdateInfoProduct info={info} show={updateInfoVisible} onHide={() => setUpdateInfoVisible(false)} />
      <ConfirmRemoval show={removeVisible} onHide={() => setRemoveVisible(false)}/>
    </Col>
  );

  return (
    <tr key='id' className="mb-3">
      <td style={ { width: '50px' } }> 
        {id} :
      </td>
      <td style={ { width: '300px' } }>
        {info.title}
      </td>
      <td style={ { width: '500px' } }>
        {info.description}
      </td>
      <td style={ { width: '200px' } }>
        {admin}
      </td>         
    </tr>
  );
});

export default ProductInfoComponent;