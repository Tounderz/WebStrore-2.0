import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { fetchSearch } from '../../http/searchApi';
import { Context } from '../../index';
import { SHOP_ROUTE } from '../../utils/constRoutes';
import ProductItem from '../../components/componentsProduct/ProductComponent';
import './css/SearchPage.css'
import PaginationComponent from '../../components/componentsPagination/PaginationComponent';

const SearchPage = observer(() => {
    const { product, pagination, search } = useContext(Context);
    const navigate = useNavigate()

    const paginationClick = async () => {
        const data = await fetchSearch(search.selectedSearchParameter, pagination.currentPage);
            product.setProducts(data.products);
    }

    return (
        <Row className='searchFonPage'>
            <Container className='px-4'>
                <Col md={9}>
                    <Row>
                        {product.products.map(item => (
                            <ProductItem key={item.id} prod={item}/>
                        ))}
                        
                    </Row>
                </Col>
                    <Row onClick={() => paginationClick()}>
                        <PaginationComponent/>
                    </Row>
                    <Nav.Link onClick={() => navigate(SHOP_ROUTE)}>Back to top</Nav.Link>
            </Container>
        </Row>
    );
});

export default SearchPage;