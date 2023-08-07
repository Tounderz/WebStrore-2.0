import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import NavBar from './components/componentsNavBar/NavBar';
import CartPage from './pages/cart/CartPage';
import ProductPage from './pages/product/ProductPage';
import TypePage from './pages/type/TypePage';
import HomePage from './pages/home/HomePage';
import { USERLIST_ROUTE, CART_ROUTE, CATEGORY_ROUTE, 
         LOGIN_ROUTE, REGISTER_ROUTE, SHOP_ROUTE, PERSONAL_ACCOUNT_ROUTE, 
         PRODUCT_ROUTE, TYPE_ROUTE, BRAND_ROUTE, ADMIN_ROUTE, 
         ORDER_ROUTE, COMPLETED_ROUTE, BRANDS_BY_CATEGORY_ROUTE,
         CATEGORIES_BY_BRAND_ROUTE, BRAND_INFO_ROUTE,
         CATEGORY_INFO_ROUTE, SEARCH_ROUTE,
         PURCHASES_STORY_ROUTE, ERROR_ROUTE,
         VERIFY_EMAIL_ROUTE, RETRIEVE_PASSWORD_ROUTE, RESTORE_ROUTE
        } from './utils/constRoutes';
import CategoryPage from './pages/category/CategoryPage';
import BrandPage from './pages/brand/BrandPage';
import OrderPage from './pages/order/OrderPage';
import CompletedPage from './pages/order/CompletedPage';
import { Context } from './index';
import { observer } from 'mobx-react-lite';
import { check } from './http/authApi';
import { Spinner } from 'react-bootstrap';
import UserTablePage from './pages/admin/UserTablePage';
import BrandsByCategoryPage from './pages/brand/BrandsByCategoryPage';
import CategoriesByBrandPage from './pages/category/CategoriesByBrandPage';
import BrandInfoPage from './pages/brand/BrandInfoPage';
import CategoryInfoPage from './pages/category/CategoryInfoPage';
import SearchPage from './pages/search/SearchPage';
import PurchasesStoryPage from './pages/auth/PurchasesStoryPage';
import ErrorPage from './pages/error/ErrorPage';
import PersonalAccountPage from './pages/auth/PersonalAccountPage';
import VerifyEmail from './pages/auth/VerifyEmail';
import RetrieveYourPasswordPage from './pages/auth/RetrieveYourPasswordPage';
import RestoringAccount from './pages/auth/RestoringAccount';
import AdminPage from './pages/admin/AdminPage';

const App = observer(() => {
  const { auth } = useContext(Context);
  const { messages } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    setTimeout(async () => {
      await check().then(data => {
        localStorage.setItem('accessToken', data.accessToken);
          auth.setAuth(data.user);
          messages.setMessage('');
          messages.setMessageError('');
      }).finally(() => setLoading(false))
    }, 1000)
  })

  if (loading) {
    return <Spinner animation={'grow'}/>
  }

  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route exact path={SHOP_ROUTE} element={<HomePage/>}/>
        <Route exact path={PERSONAL_ACCOUNT_ROUTE} element={<PersonalAccountPage/>}/>
        <Route path={LOGIN_ROUTE} element={<LoginPage/>}/>
        <Route path={REGISTER_ROUTE} element={<RegisterPage/>}/>
        <Route path={VERIFY_EMAIL_ROUTE} element={<VerifyEmail/>}/>
        <Route path={CART_ROUTE} element={<CartPage/>}/>
        <Route path={CATEGORY_ROUTE} element={<CategoryPage/>}/>
        <Route path={PRODUCT_ROUTE} element={<ProductPage/>}/>
        <Route path={TYPE_ROUTE} element={<TypePage/>}/>
        <Route path={BRAND_ROUTE} element={<BrandPage/>}/>
        <Route path={ADMIN_ROUTE} element={<AdminPage/>}/>
        <Route path={ORDER_ROUTE} element={<OrderPage/>}/>
        <Route path={COMPLETED_ROUTE} element={<CompletedPage/>}/>
        <Route path={USERLIST_ROUTE} element={<UserTablePage/>}/>
        <Route path={BRANDS_BY_CATEGORY_ROUTE} element={<BrandsByCategoryPage/>}/>
        <Route path={CATEGORIES_BY_BRAND_ROUTE} element={<CategoriesByBrandPage/>}/>
        <Route path={BRAND_INFO_ROUTE} element={<BrandInfoPage/>}/>
        <Route path={CATEGORY_INFO_ROUTE} element={<CategoryInfoPage/>}/>
        <Route path={SEARCH_ROUTE} element={<SearchPage/>}/>
        <Route path={PURCHASES_STORY_ROUTE} element={<PurchasesStoryPage/>}/>
        <Route path={ERROR_ROUTE} element={<ErrorPage/>}/>
        <Route path={RETRIEVE_PASSWORD_ROUTE} element={<RetrieveYourPasswordPage/>}/>
        <Route path={RESTORE_ROUTE} element={<RestoringAccount/>} />
      </Routes>
    </BrowserRouter>
  );
});

export default App;