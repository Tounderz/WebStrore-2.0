import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Button, Card, Container, FloatingLabel, Form, ModalFooter, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { placeOrders, placeOrder } from '../../http/orderApi';
import { cleanToCart, removeToCartItem } from '../../http/cartApi';
import { Context } from '../../index';
import { COMPLETED_ROUTE } from '../../utils/constRoutes';
import { useInput } from '../../utils/validate';
import './css/OrderPage.css'

const OrderPage = observer(() => {
    const { product, auth, messages, paymentMethod } = useContext(Context);
    const name = useInput('', { minLength: {value: 3, name: 'Name'}});
    const phone = useInput('', {isPhone: true});
    const email = useInput('', {minLength: {value: 4, name: 'Email'}, isEmail: true});
    const city = useInput('', {minLength: {value: 3, name: 'City'}});
    const street = useInput('', {minLength: {value: 3, name: 'Street'}});
    const house = useInput('', {isNumberId: {name: 'House'}});
    const flat = useInput('', {isNumberId: {name: 'Flat'}});
    const orderComment = useInput('', {minLength: {value: 3, name: 'Comments Order'}});
    const method = useInput(0, {isNumberId: {name: 'Payment Method'}});
    const navigate = useNavigate();

    const click = async () => {
        try {
            if (product.selectedProduct.id) {
                const data = await placeOrder(
                    auth?.auth?.id, product.selectedProduct.id, name.value, 
                    phone.value, email.value, city.value, street.value, 
                    house.value, flat.value, orderComment.value, method.value
                );

                messages.setMessage(data.message);
                await removeToCartItem(product.selectedProduct.id, auth?.auth?.id);
            } else {
                const data = await placeOrders(
                    auth?.auth?.id, name.value, phone.value, email.value, 
                    city.value, street.value, house.value, flat.value, 
                    orderComment.value, method.value
                );

                messages.setMessage(data.message);
                await cleanToCart(auth?.auth?.id);
            }
    
            navigate(COMPLETED_ROUTE);
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message || 'An error occurred. Please try again later.');
        }
    }

    return (
        <Row className='orderFonPage'>
            <Container className='containerOrder'>
                <Card className='cardOrder'>
                    <h1>Complete Order</h1>
                    <div className='error_message'>{messages.messageError}</div>
                    <Form>
                        {(name.isDirty && name.minLengthError) && 
                            <div className='error_message'>{name.messageError}</div>}
                        <FloatingLabel label='Name'>
                            <Form.Control
                                className='formControlOrder'
                                placeholder='Name'
                                value={name.value}
                                onChange={e => name.onChange(e)}
                                onBlur={e => name.onBlur(e)}
                            />
                        </FloatingLabel>

                        {((phone.isDirty && phone.isEmpty) || 
                            (phone.isDirty && phone.phoneError)) && 
                            <div className='error_message'>{phone.messageError}</div>}
                        <FloatingLabel label='Phone number'>
                            <Form.Control
                                className='formControlOrder'
                                type='tel' 
                                placeholder='Phone number'
                                value={phone.value}
                                onChange={e => phone.onChange(e)}
                                onBlur={e => phone.onBlur(e)}
                            />
                        </FloatingLabel>

                        {((email.isDirty && email.emailError) || (email.isDirty && email.isEmpty)) && 
                            <div className='error_message'>{email.messageError}</div>}
                        <FloatingLabel label='Email address'>
                            <Form.Control
                                className='formControlOrder'
                                type='email' 
                                placeholder='Email address'
                                value={email.value}
                                onChange={e => email.onChange(e)}
                                onBlur={e => email.onBlur(e)}
                            />
                        </FloatingLabel>

                        {(city.isDirty && city.minLengthError) && 
                            <div className='error_message'>{city.messageError}</div>}
                        <FloatingLabel label='City'>
                            <Form.Control
                                className='formControlOrder'
                                placeholder='City'
                                value={city.value}
                                onChange={e => city.onChange(e)}
                                onBlur={e => city.onBlur(e)}
                            />
                        </FloatingLabel>

                        {(street.isDirty && street.minLengthError) && 
                            <div className='error_message'>{street.messageError}</div>}
                        <FloatingLabel label='Street'>
                            <Form.Control
                                className='formControlOrder'
                                placeholder='Street'
                                value={street.value}
                                onChange={e => street.onChange(e)}
                                onBlur={e => street.onBlur(e)}
                            />
                        </FloatingLabel>

                        {(house.isDirty && house.isNumberError) && 
                            <div className='error_message'>{house.messageError}</div>}
                        <FloatingLabel label='House'>
                            <Form.Control
                                className='formControlOrder'
                                placeholder='House'
                                value={house.value}
                                onChange={e => house.onChange(e)}
                                onBlur={e => house.onBlur(e)}
                            />
                        </FloatingLabel>

                        {(flat.isDirty && flat.isNumberError) && 
                            <div className='error_message'>{flat.messageError}</div>}
                        <FloatingLabel label='Flat'>
                            <Form.Control
                                className='formControlOrder'
                                placeholder='Flat'
                                value={flat.value}
                                onChange={e => flat.onChange(e)}
                                onBlur={e => flat.onBlur(e)}
                            />
                        </FloatingLabel>

                        {(orderComment.isDirty && orderComment.minLengthError) && 
                            <div className='error_message'>{orderComment.messageError}</div>}
                        <FloatingLabel label='Order Comment'>
                            <Form.Control
                                className='formControlOrder'
                                placeholder='Order Comment'
                                value={orderComment.value}
                                onChange={e => orderComment.onChange(e)}
                                onBlur={e => orderComment.onBlur(e)}
                            />
                        </FloatingLabel>

                        {(method.isDirty && method.isNumberError) && <div className='error_message'>{method.messageError}</div>}
                        <FloatingLabel label='Selected Payment Method'>
                            <Form.Select 
                                className='formControlOrder'
                                onChange={e => method.onChange(e)}
                                onBlur={e => method.onBlur(e)}
                            >
                                <option
                                    className='option_payment_method'
                                    key='0'
                                    value=''
                                >
                                    Select a Payment Method
                                </option>
                                {paymentMethod.paymentMethods.map(item => (
                                    <option
                                        className='option_payment_method'
                                        key={item.id} 
                                        value={item.name}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                    </Form>
                    <ModalFooter
                        className='modalFooterOrder'
                    >
                        <Button
                            className='buttonOrder'
                            variant='outline-primary'
                            disabled={
                                !name.inputValid || !email.inputValid || 
                                !city.inputValid || !street.inputValid || 
                                !house.inputValid || !flat.inputValid || 
                                !method.inputValid}
                            onClick={click}
                        >
                            Place an order
                        </Button>
                    </ModalFooter>
                </Card>
            </Container>
        </Row>
    );
});

export default OrderPage;