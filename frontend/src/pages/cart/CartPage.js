import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Container, Nav, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { fetchPaymentMethods } from "../../http/paymentMethodsApi";
import { Context } from "../../index";
import { SHOP_ROUTE, ORDER_ROUTE } from "../../utils/constRoutes";
import ConfirmRemoval from "../../components/componentsConfirmRemoval/ConfirmRemoval";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './css/CartPage.css'
import CartComponent from "../../components/componentsCart/CartComponent";

const CartPage = observer(() => {
    const { product, remove, cart, paymentMethod, messages } = useContext(Context);
    const [removeVisible, setRemoveVisible] = useState(false);
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    const [slidesToShow, setSlidesToShow] = useState(() => {
        const width = window.innerWidth;
        if (width >= 1650) {
            return cart?.carts?.length >= 6 ? 6 : cart?.carts?.length;
        } else if (width < 1650 && width >= 1300) {
            return cart?.carts?.length >= 4 ? 4 : cart?.carts?.length;
        } else if (width => 1000 && width < 1300) {
            return cart?.carts?.length >= 3 ? 3 : cart?.carts?.length;
        } else if (width => 650 && width < 1000) {
            return cart?.carts?.length >= 2 ? 2 : cart?.carts?.length;
        } else if (width < 650) {
            return cart?.carts?.length >= 1 ? 1 : cart?.carts?.length;
        }
    });
  
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToScroll: 1,
      slidesToShow: slidesToShow,
      customPaging: i => (
        <div
          style={{
            width: "30px",
            color: "white",
          }}
        >
          {i+1}
        </div>
      )
    };
  
    useEffect(() => {
      const handleResize = () => {
        const width = window.innerWidth;
        let newSlidesToShow;
        if (width >= 1650) {
          newSlidesToShow= cart?.carts?.length >= 6 ? 6 : cart?.carts?.length;
        } else if (width < 1650 && width > 1300 ) {
          newSlidesToShow = cart?.carts?.length >= 4 ? 4 : cart?.carts?.length;
        } else if (width > 1000 && width < 1300) {
          newSlidesToShow = cart?.carts?.length >= 3 ? 3 : cart?.carts?.length;
        } else if (width > 650 && width < 1000) {
            newSlidesToShow = cart?.carts?.length >= 2 ? 2 : cart?.carts?.length;
        } else if (width < 650) {
          newSlidesToShow = cart?.carts?.length >= 1 ? 1 : cart?.carts?.length;
        }
        
        setSlidesToShow(newSlidesToShow);
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [cart?.carts?.length]);

    const cleanCart = async () => {
        setRemoveVisible(true);
        remove.setRemoveParameterName('cleanCart');
    }

    const payAllImets = async () => {
        product.setSelectedProduct({});
        const data  = await fetchPaymentMethods();
            paymentMethod.setPaymentMethods(data.paymentMethods);
        navigate(ORDER_ROUTE);
    }

    return (
        <Row className='basketfonPage'>
            <Container className='row_cart_slider'>
                {cart?.carts?.length > 0 ?
                    <Slider className='cart_slider' {...settings} ref={sliderRef}>
                        {cart?.carts?.map(item => 
                            <CartComponent item={item}/>
                        )}
                    </Slider>
                    :
                    <div className='error_message' style={{fontSize: '5em'}}>{messages.messageError}</div>    
                }
            </Container>
            <h1 className='total_cart'>
                Total: {cart.totalAmount} $
            </h1>
            <Row className='row_cart_button'>
                <Button 
                    className='button_cart_to_pay'
                    variant='link'
                    disabled={cart?.carts?.length < 1}
                    onClick={() => payAllImets()}
                >
                    To pay
                </Button>
                <Button
                    className='button_cart_clean'
                    variant='outline-danger'
                    disabled={cart.carts.length < 1}
                    onClick={() => cleanCart()}
                >
                    Clean Cart
                </Button>
            </Row>
            <Nav.Link
                className='nav_cart_back_to_top'
                onClick={() => navigate(SHOP_ROUTE)}
            >
                Back to top
            </Nav.Link>
            <ConfirmRemoval show={removeVisible} onHide={() => setRemoveVisible(false)}/>   
        </Row>
    )
})

export default CartPage;