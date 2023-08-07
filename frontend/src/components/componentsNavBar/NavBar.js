import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { Context } from '../../index';
import { SHOP_ROUTE } from '../../utils/constRoutes';
import BrandDropdown from './BrandDropdown';
import CategoryDropdown from './CategoryDropdown';
import UserBar from './UserBar';
import SearchForm from './SearchForm';
import './css/NavBar.css';
import './css/NavBarMedia.css';
import { fetchBrandsPopular, fetchCategoriesPopular, fetchProductsPopular } from '../../http/homeApi';
import { fetchCategories } from '../../http/categoryApi';
import { fetchBrands } from '../../http/brandApi';

const NavBar = observer(() => {
    const { category, brand, product } = useContext(Context);

    const onClick = async () => {
        const dataPopularCategories = await fetchCategoriesPopular();
            category.setPopularCategories(dataPopularCategories.popularCategories);

        const dataCategories = await fetchCategories(0);
            category.setCategories(dataCategories.categories);

        const dataPopularBrands = await fetchBrandsPopular();
            brand.setPopularBrands(dataPopularBrands.popularBrands);
            
        const dataBrands = await fetchBrands(0);
            brand.setBrands(dataBrands.brands);
        
        const dataProducts = await fetchProductsPopular();
            product.setPopularProducts(dataProducts.popularProducts);
        category.setSelectedCategory({});
        brand.setSelectedBrand({});
    }

    return (
        <Navbar expand='lg' className='bg-body-tertiary'>
            <Container fluid>
                <Navbar.Brand className='navbar_brand'>Store</Navbar.Brand>
                <Navbar.Toggle className='navbar_toggle' aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='me-auto'>
                        <Nav.Link
                            className='link_home' 
                            href={SHOP_ROUTE}
                            onClick={onClick}
                        >
                            Home
                        </Nav.Link>
                        <NavDropdown
                            className='navDropdown'
                            title='Categories'
                            id='collasible-nav-dropdown'
                        >
                            <div className='scroll-nav'>
                                {category.categories.map((categoryItem) => (
                                    <CategoryDropdown key={categoryItem.id} categoryItem={categoryItem}/>
                                ))}
                            </div>
                        </NavDropdown>
                        <NavDropdown
                            className='navDropdown'
                            title='Brands'
                            id='collasible-nav-dropdown'
                        >
                            <div className='scroll-nav'>
                                {brand.brands.map((brandItem) => (
                                    <BrandDropdown key={brandItem.id} brandItem={brandItem}/>
                                ))}
                            </div>
                        </NavDropdown>
                    </Nav>
                    <SearchForm key='id'/>
                    <UserBar/>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
});

export default NavBar;