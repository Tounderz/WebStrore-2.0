import { observer } from 'mobx-react-lite';
import React from 'react';
import { useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { cleanToCart, removeToCartItem } from '../../http/cartApi';
import { removeProduct } from '../../http/productApi';
import { fetchUsers, removeUser } from '../../http/userApi';
import { Context } from '../../index';
import { CART_ROUTE, SHOP_ROUTE } from '../../utils/constRoutes';
import { logout } from '../../http/authApi';
import { BRAND, CATEGORY, GENDER, PAGE_FIRST, PRODUCT, ROLE, TYPE, USER } from '../../utils/const';
import { fetchInfoProduct, removeInfoProduct } from '../../http/productInfoApi';
import { fetchTableBrands, removeBrand } from '../../http/brandApi';
import { fetchTableCategories, removeCategory } from '../../http/categoryApi';
import { fetchTableTypes, removeType } from '../../http/typeApi';
import './css/ConfirmRemoval.css';
import { fetchRoles, removeRole } from '../../http/roleApi';
import { fetchGenders, removeGender } from '../../http/genderApi';

const ConfirmRemoval = observer(({show, onHide}) => {
    const { product, user, auth, 
        remove, cart, pagination, 
        messages, brand, category, 
        type, role, gender } = useContext(Context);
    const navigate = useNavigate();

    const click = async () => {
        try {
            let data;
            switch(remove.removeParameterName) {
                case PRODUCT:
                    data = await removeProduct(remove.removeObjeck.id);
                        product.setProducts(data.products);
                    paginationParameter(data.countPages);
                    close();
                    break;
                case BRAND:
                    await removeBrand(remove.removeObjeck.id);
                    data = await fetchTableBrands(PAGE_FIRST);
                        brand.setTableBrands(data.brands);
                    paginationParameter(data.countPages);
                    close();
                    break;
                case CATEGORY:
                    await removeCategory(remove.removeObjeck.id);
                    data = await fetchTableCategories(PAGE_FIRST);
                        category.setTableCategories(data.categories);
                    paginationParameter(data.countPages);
                    close();
                    break;
                case TYPE:
                    await removeType(remove.removeObjeck.id);
                    data = await fetchTableTypes(PAGE_FIRST);
                        type.setTableTypes(data.types);
                    paginationParameter(data.countPages);
                    close();
                    break;
                case USER:
                    await removeUser(remove.removeObjeck.id);
                    data = await fetchUsers(PAGE_FIRST);
                        user.setUsersList(data.usersList);
                    paginationParameter(data.countPages);
                    close();
                    break;
                case ROLE:
                    await removeRole(remove.removeObjeck.id);
                    data = await fetchRoles(PAGE_FIRST);
                        role.setRoles(data.roles);
                    paginationParameter(data.countPages);
                    close();
                    break;
                case GENDER:
                    await removeGender(remove.removeObjeck.id);
                    data = await fetchGenders(PAGE_FIRST);
                        gender.setGendets(data.genders);
                    paginationParameter(data.countPages);
                    close();
                    break;
                case 'userCabinet':
                    await removeUser(remove.removeObjeck.id);
                    close();
                    logOut();
                    break;
                case 'basketItem':
                    data = await removeToCartItem(remove.removeObjeck.id, auth?.auth?.id);
                        cart.setCarts(data.cart);
                        cart.setTotalAmount(data.sum);
                    close();
                    navigate(CART_ROUTE);
                    break;
                case 'cleanCart':
                    data = await cleanToCart(auth?.auth?.id);
                        cart.setCarts([]);
                        cart.setTotalAmount(data.sum);
                    close();
                    navigate(CART_ROUTE);
                    break;
                case 'removeProductInfo':
                    await removeInfoProduct(remove.removeObjeck.id);
                    data = await fetchInfoProduct(product.selectedProduct.id);
                        product.setInfoProduct(data.infoProducts);
                    close();
                    break;
                default:
                    break;
            }
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
        }
       
    }

    const logOut = async () => {
        const data = await logout();
            auth.setAuth(data.user);
            user.setUser();
            localStorage.removeItem('accessToken');
        navigate(SHOP_ROUTE)
    }

    const paginationParameter = (countPages) => {
        pagination.setCountPages(countPages);
        pagination.setCurrentPage(PAGE_FIRST);
    }

    let string;
    switch (remove.removeParameterName) {
        case PRODUCT:
            string = `Are you sure you want to remove product: '${remove.removeObjeck.name}'?`
            break;
        case CATEGORY:
            string = `Are you sure you want to remove category: '${remove.removeObjeck.name}'?`
            break;
        case BRAND:
            string = `Are you sure you want to remove brand: '${remove.removeObjeck.name}'?`
            break;
        case TYPE:
            string = `Are you sure you want to remove type: '${remove.removeObjeck.name}'?`
            break;
        case USER:
            string = `Are you sure you want to remove user: '${remove.removeObjeck.name}'?`
            break;
        case ROLE:
            string = `Are you sure you want to remove role: '${remove.removeObjeck.roleName}'?`
            break;
        case GENDER:
            string = `Are you sure you want to remove gender: '${remove.removeObjeck.genderName}'?`
            break;
        case 'userCabinet':
            string = `Are you sure you want to remove user: '${remove.removeObjeck.name}'?`
            break;
        case 'basketItem':
            string = `Are you sure you want to remove product: '${remove.removeObjeck.name}'?`
            break;
        case 'cleanCart':
            string = `Are you sure you want to empty the recycle bin?`
            break;
        case 'removeProductInfo':
            string = `Are you sure you want to remove product info: '${remove.removeObjeck.title}'?`
            break;
        default:
            break;
    }

    const close = () => {
        remove.setRemoveObjeck({});
        remove.setRemoveParameterName('');
        onHide();
    }

    return (
        <Modal
            show={show}
            onHide={close}
            size='lg'
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title 
                    id='contained-modal-title-vcenter'
                >
                    {string}
                </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button
                    className='button_confirm_yes'
                    variant='link'
                    onClick={click}
                >
                    Yes
                </Button>
                <Button 
                    className='button_confirm_no'
                    variant='link'
                    onClick={close}
                >
                    No
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default ConfirmRemoval;