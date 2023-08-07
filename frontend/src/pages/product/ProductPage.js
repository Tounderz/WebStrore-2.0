import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Card, Col, Container, Row, Image, Button, Table } from 'react-bootstrap';
import { Context } from '../../index';
import ProductInfoComponent from '../../components/componentsProductInfo/ProductInfoComponent';
import { useNavigate } from 'react-router';
import { LOGIN_ROUTE, SHOP_ROUTE } from '../../utils/constRoutes';
import { addToCart } from '../../http/cartApi';
import { SvgSelector } from '../../components/Svg/SvgSelector';
import './css/ProductPage.css'
import { PICTURE } from '../../utils/constFunctions';
import CreateInfoProduct from '../../components/componentsProductInfo/CreateInfoProduct';

const ProductPage = observer(() => {
    const { product, auth } = useContext(Context);
    const navigate = useNavigate();
    const [createInfoProduct, setCreateInfoProduct] = useState(false);

    const onClick = async () => {
        if(auth?.auth?.isAuth) {
            await addToCart(product.selectedProduct.id, auth?.auth?.id);
            navigate(SHOP_ROUTE);
        } else {
            navigate(LOGIN_ROUTE);
        }
    }

    return (
        <div className='fonPageProduct'>
            <Container className='containerProduct'>
                <Row>
                    <Col md={3}>
                        <Row className='rowImgProduct'>
                            <Image
                                className='imgProduct'
                                src={PICTURE(product.selectedProduct.img)}
                            />
                        </Row>
                    </Col>
                    <Col 
                        className='colModalProduct'
                        md={5}
                    >
                        <h2>Modal: </h2>
                        <h2>{product.selectedProduct.name}</h2>
                    </Col>
                    <Col 
                        md={3}                    
                        className='colCartProduct'
                    >
                        <Card
                            className='cardProduct'
                        >
                            <h1 className='addToCartProduct'>Price: {product.selectedProduct.price} $</h1>
                            <Button
                                variant='link'
                                disabled={!product.selectedProduct.available} 
                                onClick={onClick}
                            >
                                <SvgSelector id='addToCart'/>
                            </Button>
                        </Card>
                    </Col>
                </Row>
                <Row className='rowSpecificationsProduct'>
                    <h2>
                        Specifications:
                    </h2>
                    <Table 
                        key='id'
                        className='tableProduct'
                    >
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product?.infoProduct?.map((info, id) => (
                                <ProductInfoComponent key={id} info={info} id={id + 1}/>
                            ))}
                        </tbody>
                    </Table>
                </Row>
                {(auth?.auth?.role !== 'user' && auth?.auth?.isAuth) ? 
                    <Button 
                        className='button_create_info'
                        variant='link'
                        onClick={() => {setCreateInfoProduct(true)}}
                    >
                        Create Info
                    </Button>
                    :
                    ''
                }
                <CreateInfoProduct show={createInfoProduct} onHide={() => setCreateInfoProduct(false)} productId={product.selectedProduct.id}/>
            </Container>
        </div>
    );
});

export default ProductPage;