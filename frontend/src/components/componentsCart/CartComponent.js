import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Context } from '../../index';
import { ORDER_ROUTE } from '../../utils/constRoutes';
import { fetchPaymentMethods } from '../../http/paymentMethodsApi';
import { PICTURE } from '../../utils/constFunctions';
import { useNavigate } from 'react-router';
import { Button, Card } from 'react-bootstrap';
import './css/CartComponent.css';
import ConfirmRemoval from '../componentsConfirmRemoval/ConfirmRemoval';

const CartComponent = observer(({item}) => {
    const { product, auth, remove, cart, paymentMethod } = useContext(Context);
    const navigate = useNavigate();
    const [removeVisible, setRemoveVisible] = useState(false);

    const pay = async () => {
        product.setSelectedProduct(item);
        const data  = await fetchPaymentMethods();
            paymentMethod.setPaymentMethods(data.paymentMethods);
        navigate(ORDER_ROUTE)
    }

    const removeItem = async () => {
        setRemoveVisible(true);
            remove.setRemoveObjeck(item);
            remove.setRemoveParameterName('basketItem');
    }

    return (
        <Card
            className='card_basket'
        >
            <Card.Img 
                className='cardImgBasket'
                src={PICTURE(item.img)}
            />
            <Card.Body>
                <Card.Title className='card_title_cart'>
                    {item.name}
                </Card.Title>
                <Card.Text>
                    Price: {item.price}$
                </Card.Text>
                <div className='row_cart_card_button'>
                    <Button 
                        className='button_card_to_pay'
                        variant='link'
                        onClick={pay}
                    >
                        To pay
                    </Button>
                    <Button
                        className='button_card_remove'
                        variant='link'
                        onClick={removeItem}
                    >
                        Remove
                    </Button>
                </div>
            </Card.Body>
            <ConfirmRemoval show={removeVisible} onHide={() => setRemoveVisible(false)}/> 
        </Card>
    );
});

export default CartComponent;