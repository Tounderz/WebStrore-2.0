import React, { useContext } from 'react';
import { Card, Col } from 'react-bootstrap'
import { Context } from '../../index';
import { useNavigate } from 'react-router';
import { PRODUCT_ROUTE } from '../../utils/constRoutes';
import { fetchInfoProduct } from '../../http/productInfoApi';
import './css/ProductComponent.css'
import { observer } from 'mobx-react-lite';
import { PICTURE } from '../../utils/constFunctions';

const ProductComponent = observer(({prod}) => {
    const { product, brand } = useContext(Context);
    const navigate = useNavigate()

    const getProduct = async () => {
        product.setSelectedProduct(prod);
        const data = await fetchInfoProduct(prod.id);
            product.setInfoProduct(data.info);
        navigate(PRODUCT_ROUTE);
    }
    
    return (
        <Col 
            md={3} 
            className='colProductItem'
            onClick={() => getProduct()}
        >
            <Card 
                className='cardProductItem'
            >
                <Card.Img 
                    className='cardImgProductItem'
                    src={PICTURE(prod.img)}
                />
                <div className='div_card_product_item'>
                    <div>
                        Brand: {brand.brands.filter(brandItem => {
                            return brandItem.id === prod.brandId}).map(brandItem => brandItem.name)}
                    </div>
                    <div>
                        Model: {prod.name}
                    </div>
                    <div>
                        Short Description: {prod.shortDescription}
                    </div>
                    <div>
                        Price: {prod.price}$
                    </div>
                    <div className='availableProductItem'>
                        {prod.available ? 'Available in stock' : 'Out of stock'}
                    </div>
                    
                </div>
            </Card>
        </Col>       
    );
});

export default ProductComponent;