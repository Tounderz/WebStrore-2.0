import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { useNavigate } from 'react-router';
import { fetchCart } from '../../http/cartApi';
import { fetchUser } from '../../http/userApi';
import { Context } from '../../index';
import { ADMIN_ROUTE, CART_ROUTE, LOGIN_ROUTE,
         REGISTER_ROUTE, SHOP_ROUTE, 
         PERSONAL_ACCOUNT_ROUTE
        } from '../../utils/constRoutes';
import { SvgSelector } from '../Svg/SvgSelector';
import { logout } from '../../http/authApi';
import './css/NavBar.css'

const UserBar = observer(() => {
  const { user, auth, product, cart,
          brand, category, type } = useContext(Context);
  const navigate = useNavigate();
  
  const logOut = async () => {
    const data = await logout();
      auth.setAuth(data.user);
      user.setUser({});
      localStorage.removeItem('accessToken');
    navigate(SHOP_ROUTE);
  }

  const basket = async () => {
    const data = await fetchCart(auth?.auth?.id);
      cart.setCarts(data.carts);
      cart.setTotalAmount(data.sum);
      product.setSelectedProduct({});
    navigate(CART_ROUTE);
  }

  const admin = async () => {
    brand.setSelectedBrand({});
    category.setSelectedCategory({});
    type.setSelectedType({});
    product.setSelectedProduct({});
    navigate(ADMIN_ROUTE);
  }

  const cabinet = async () => {
    const data = await fetchUser(auth?.auth?.login);
      user.setUser(data.user);

    navigate(PERSONAL_ACCOUNT_ROUTE);
  }

  const menus = {
    user: [
      { label: 'Account', onClick: cabinet },
      { label: 'Cart', onClick: basket },
      { divider: true },
      { label: 'Logout', onClick: logOut }
    ],
    admin: [
      { label: 'Admin', onClick: admin },
      { label: 'Account', onClick: cabinet },
      { divider: true },
      { label: 'Logout', onClick: logOut }
    ]
  };

  const menuItems = menus[auth?.auth?.role] || [];

  return (
    <Navbar>
      {!auth?.auth?.isAuth ? 
        <Nav className='div-sign'>
          <Nav.Link className='sign navbar-brand' href={LOGIN_ROUTE}>
            Sign In
          </Nav.Link>
          <Nav.Link  className='sign navbar-brand' href={REGISTER_ROUTE}>
            Sign Up
          </Nav.Link>
        </Nav>
       : 
        <NavDropdown
          title={<SvgSelector id={(auth?.auth?.role === 'admin' || auth?.auth?.role  === 'moderator') ? 'admin' : 'account'} />}
          id='collasible_user_dropdown'
          menuVariant='dark'
          className='nav_dropdown_account'
        >
          {menuItems.map((item, index) => {
            if (item.divider) {
              return <NavDropdown.Divider key={index} />;
            } else {
              return (
                <NavDropdown.Item
                  className='nav_dropdown_item_active'
                  key={index}
                  onClick={item.onClick}
                >
                  {item.label}
                </NavDropdown.Item>
              );
            }
          })}
        </NavDropdown>
      }
    </Navbar>
  );
});

export default UserBar;