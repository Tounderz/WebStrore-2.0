import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Col, Image, Nav, Row, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Context } from '../../index';
import PaginationComponent from '../../components/componentsPagination/PaginationComponent';
import { fetchOrders } from '../../http/orderApi';
import { PERSONAL_ACCOUNT_ROUTE } from '../../utils/constRoutes';
import { PICTURE } from '../../utils/constFunctions';
import './css/PurchasesStoryPage.css';

const PurchasesStoryPage = observer(() => {
    const { pagination, order, auth, messages } = useContext(Context);
    const navigate = useNavigate();

    const paginationClick = async () => {
        const data = await fetchOrders(auth?.auth?.id, pagination.currentPage);
            order.setOrdersList(data.orders);
            order.setTotalAmount(data.totalAmount);
    }

    return (
        <Row className='row_purchases_story'>
            <Col className='container_purchases_story'>
                {order?.ordersList?.length > 0 ? 
                    <Table className='table_purchases_story'>
                        <thead>
                            <tr>
                                <th scope='col'>Order Id</th>
                                <th scope='col'>Order Time</th>
                                <th scope='col'>Product Name</th>
                                <th scope='col'>Product Img</th>
                                <th scope='col'>Product Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order?.ordersList?.map(item => 
                                <tr key={item.orderId}>
                                    <th scope='row'>{item.orderId}</th>
                                    <td>{item.orderTime}</td>
                                    <td>{item.productName}</td>
                                    <td>
                                        <Image 
                                            className='imgTable'
                                            src={PICTURE(item.productImg)}
                                        />
                                    </td>
                                    <td>{item.productPrice}$</td>
                                </tr>
                            )}
                            <tr>
                                <th colSpan={4}>Total amount:</th>
                                <th>{order.totalAmount}$</th>
                            </tr>
                        </tbody>
                    </Table>
                    : 
                    <h1 className='error_message_purchases_story'>{messages.messageError}</h1>
                }
                <Row onClick={() => paginationClick()}>
                    <PaginationComponent/>
                </Row>
                <Nav.Link 
                        className='navigate_purchases_story'
                        onClick={() => navigate(PERSONAL_ACCOUNT_ROUTE)}
                    >
                        Cabinet
                    </Nav.Link>
            </Col>
        </Row>
    );
});

export default PurchasesStoryPage;