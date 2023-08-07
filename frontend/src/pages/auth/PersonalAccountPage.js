import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Col, Image, ListGroup, Nav, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import UpdateUser from "../../components/componentsUser/UpdateUser";
import UpdatePassword from "../../components/componentsUser/UpdatePassword";
import { fetchUser } from "../../http/userApi";
import { Context } from "../../index";
import { SHOP_ROUTE, PURCHASES_STORY_ROUTE, CART_ROUTE } from "../../utils/constRoutes";
import UpdatePhoto from "../../components/componentsUser/UpdatePhoto";
import { fetchOrders } from "../../http/orderApi";
import { fetchCart } from "../../http/cartApi";
import './css/PersonalAccountPage.css'
import ConfirmRemoval from "../../components/componentsConfirmRemoval/ConfirmRemoval";
import { logout } from "../../http/authApi";
import { PAGE_FIRST } from "../../utils/const";
import { PICTURE, PICTURE_USER } from "../../utils/constFunctions";
import { fetchRoles } from "../../http/roleApi";
import { fetchGenders } from "../../http/genderApi";

const PersonalAccountPage = observer(() => {
    const { user, auth, order, messages, cart, pagination, remove, role, gender, product } = useContext(Context);
    const navigate = useNavigate();
    const [userUpdateVisible, setUserUpdateVisible] = useState(false);
    const [updatePasswordVisible, setUpdatePasswordVisible] = useState(false);
    const [updatePhotoVisible, setUpdatePhotoVisible] = useState(false);
    const [removeVisible, setRemoveVisible] = useState(false);
    
    const logOut = async () => {
        const data = await logout();
            auth.setAuth(data.user);
            user.setUser({});
            localStorage.removeItem('accessToken');
        navigate(SHOP_ROUTE)
    }

    const basket = async () => {
        product.setSelectedProduct({});
        try {
            const data = await fetchCart(auth?.auth?.id);
                cart.setCarts(data.cart);
                cart.setTotalAmount(data.sum);
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
        } finally {
            navigate(CART_ROUTE);
        }
    }

    const purchaseHistory = async () => {
        try {
            const data = await fetchOrders(user?.user?.id, PAGE_FIRST);
                order.setOrdersList(data.orders);
                order.setTotalAmount(data.totalAmount);
                pagination.setCurrentPage(PAGE_FIRST);
                pagination.setCountPages(data.countPages);
                navigate(PURCHASES_STORY_ROUTE);
        } catch (e) {
            messages.setMessageError(e.response.data.message);
                order.setOrdersList([]);
                order.setTotalAmount(0);
                pagination.setCurrentPage(PAGE_FIRST);
                pagination.setCountPages(0);
                navigate(PURCHASES_STORY_ROUTE);
        }
    }

    const userUpdate = async () => {
        const data = await fetchUser(auth?.auth?.login);
            user.setSelectedUser(data.user);
        const dataRole = await fetchRoles(0);
            role.setRoles(dataRole.roles);
        const dataGender = await fetchGenders(0);
            gender.setGender(dataGender.gender);
        setUserUpdateVisible(true);
    }

    const userRemove = async () => {
        setRemoveVisible(true);
        const data = await fetchUser(auth?.auth?.login);
            remove.setRemoveObjeck(data.user);
            remove.setRemoveParameterName('userCabinet');
    };

    return (
        <Row className='account_fon_page'>
            <Col className='container_account'>
                <h1 className='welcome_account'>{`Welcome ${auth?.auth?.login}`}</h1>
                <Row>
                    <Col md={3}>
                        <Image
                            className='imgAccount'
                            key={user?.user?.id}
                            src={PICTURE(user?.user?.img)}
                            alt={auth?.auth?.login}
                        />
                    </Col>
                    <Col 
                        className='col_listgroup'
                    >
                        <ListGroup className="listgroup_account"> 
                            <ListGroup.Item
                                className='listgroup_item_account'
                                onClick={() => setUpdatePasswordVisible(true)}
                            >
                                Edit Password
                            </ListGroup.Item>
                            <ListGroup.Item
                                className='listgroup_item_account'
                                onClick={() => userUpdate()}
                            >
                                Edit data
                            </ListGroup.Item>
                            <ListGroup.Item
                                className='listgroup_item_account'
                                onClick={() => setUpdatePhotoVisible(true)}
                            >
                                Edit photo
                            </ListGroup.Item>
                            <ListGroup.Item
                                className='listgroup_item_account'
                                onClick={() => purchaseHistory()}
                            >
                                Purchases story
                            </ListGroup.Item>
                            <ListGroup.Item
                                className='listgroup_item_account'
                                onClick={() => userRemove()}
                            >
                                Delete Account
                            </ListGroup.Item>
                            <ListGroup.Item
                                className='listgroup_item_account'
                                onClick={() => basket()}
                            >
                                Cart
                            </ListGroup.Item>
                            <ListGroup.Item
                                className='listgroup_item_account'
                                onClick={() => logOut()}
                            >
                                Logout
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
                    <Nav.Link
                     className='nav_back_to_top'
                        onClick={() => navigate(SHOP_ROUTE)}
                    >
                        Back to top
                    </Nav.Link>

                <UpdateUser show={userUpdateVisible} onHide={() => setUserUpdateVisible(false)}/>
                <UpdatePassword show={updatePasswordVisible} onHide={() => setUpdatePasswordVisible(false)}/>
                <UpdatePhoto show={updatePhotoVisible} onHide={() => setUpdatePhotoVisible(false)}/>
                <ConfirmRemoval show={removeVisible} onHide={() => setRemoveVisible(false)}/>   
            </Col>
        </Row>
    );
});

export default PersonalAccountPage;