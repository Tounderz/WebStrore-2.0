import React, { useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Context } from '../../index';
import { useInput } from '../../utils/validate';
import { ERROR_ROUTE, SEARCH_ROUTE } from '../../utils/constRoutes';
import { fetchSearch } from '../../http/searchApi';
import { observer } from 'mobx-react-lite';
import { PAGE_FIRST } from '../../utils/const';

const SearchForm = observer(() => {
    const { product, search, messages, pagination } = useContext(Context);
    const navigate = useNavigate();
    const searchParameter = useInput('', {minLength: {value: 1, name: 'Search'}});

    const searchClick = async () => {
        try {
            const data = await fetchSearch(searchParameter.value, PAGE_FIRST);
                product.setProducts(data.products);
                pagination.setCurrentPage(PAGE_FIRST);
                pagination.setCountPages(data.countPages);
                search.setSelectedSearchParameter(searchParameter.value);
                navigate(SEARCH_ROUTE);
        } catch (e) {
            messages.setMessageError(e?.response?.data?.message);
                navigate(ERROR_ROUTE);
        } finally {
            searchParameter.onChange('');
        }
    }

    function onKeyPress(e) {
        if (e.key === 'Enter' || e.key === 'NumpadEnter') {
            searchClick();
        }
    }

    return (
        <div className="d-flex">
            <Form.Control
                onKeyPress={onKeyPress}
                type='search'
                className='me-2'
                placeholder='Search'
                value={searchParameter.value}
                onChange={e => searchParameter.onChange(e)}
                onBlur={e => searchParameter.onBlur(e)}
            />
            <Button
                variant='outline-success'
                disabled={!searchParameter.inputValid}
                style={{
                    cursor: 'pointer',
                    borderRadius: '5px',
                }}
                onClick={searchClick}
            >
                Search
            </Button>
        </div>
    );
});

export default SearchForm;