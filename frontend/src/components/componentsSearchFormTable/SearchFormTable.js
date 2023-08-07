import React, { useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Context } from '../../index';
import { useInput } from '../../utils/validate';
import { observer } from 'mobx-react-lite';
import { SearchTableProduct } from '../../functions/SearchTableProduct';
import { SearchTableUser } from '../../functions/SearchTableUser';
import './css/SearchFormTable.css'
import { BRAND, CATEGORY, PAGE_FIRST, PRODUCT, SELECT_SEARCH, TYPE, USER } from '../../utils/const';
import { fetchSearchBrand, fetchSearchCategory, fetchSearchType } from '../../http/searchApi';

const SearchFormTable = observer(({parameter, array}) => {
    const { pagination, product, user, sort, messages, search, category, brand, type } = useContext(Context);
    const searchParameter = useInput('', {minLength: {value: 1, name: 'Search'}});
    const searchBy = useInput('', { minLength: {value: 2, name: 'Search by'}});

    const clean = () => {
        searchParameter.onChange('');
        sort.setFieldNames([]);
        sort.setFieldName('');
        sort.setTypeSort('');
        document.getElementById(SELECT_SEARCH).value = '0';
        searchBy.onChange('');
    }

    const saveSearchStote = () => {
        search.setSearchBy(searchBy.value);
        search.setSelectedSearchParameter(searchParameter.value);
        messages.setMessageError('');
    }

    const searchClick = async () => {
        switch(parameter) {
            case USER:
                try {
                    const data = await SearchTableUser(searchBy.value, searchParameter.value);
                        user.setUsersList(data.usersList);
                    paginationParameter(data.countPages);
                    saveSearchStote();
                } catch (e) {
                    user.setUsersList([]);
                    paginationParameter(1);
                    messages.setMessageError(e?.response?.data?.message);
                } finally {
                    clean();
                }
                break;
            case PRODUCT:
                try {
                    const data = await SearchTableProduct(searchBy.value, searchParameter.value);
                        product.setProducts(data.products);
                    paginationParameter(data.countPages);
                    saveSearchStote();
                    clean();
                } catch (e) {
                    product.setProducts([]);
                    paginationParameter(1);
                    messages.setMessageError(e?.response?.data?.message);
                } finally {
                    clean();
                }
                break;
            case CATEGORY:
                try {
                    const data = await fetchSearchCategory(searchParameter.value, PAGE_FIRST, searchBy.value);
                        category.setTableCategories(data.categories);
                    paginationParameter(data.countPages);
                    saveSearchStote();
                } catch (e) {
                    category.setTableCategories([]);
                    paginationParameter(1);
                    messages.setMessageError(e?.response?.data?.message);
                } finally {
                    clean();
                }
                break;
            case BRAND:
                try {
                    const data = await fetchSearchBrand(searchParameter.value, PAGE_FIRST, searchBy.value);
                        brand.setTableBrands(data.brands);
                    paginationParameter(data.countPages);
                    saveSearchStote();
                } catch (e) {
                    brand.setTableBrands([]);
                    paginationParameter(1);
                    messages.setMessageError(e?.response?.data?.message);
                } finally {
                    clean();
                }
                break;
            case TYPE:
                try {
                    const data = await fetchSearchType(searchParameter.value, PAGE_FIRST, searchBy.value);
                        type.setTableTypes(data.types);
                    paginationParameter(data.countPages);
                    saveSearchStote();
                } catch (e) {
                    type.setTableTypes([]);
                    paginationParameter(1);
                    messages.setMessageError(e?.response?.data?.message);
                } finally {
                    clean();
                }
                break;
            default:
                break;
        }   
    }

    function onKeyPress(e) {
        if (e.key === 'Enter' || e.key === 'NumpadEnter') {
            searchClick();
        }
    }

    const paginationParameter = (countPages) => {
        pagination.setCountPages(countPages);
        pagination.setCurrentPage(PAGE_FIRST);
    }

    return (
        <div className='div-search'>
            <Form.Select
                id={SELECT_SEARCH} 
                className='form-select-search'
                onChange={e => searchBy.onChange(e)}
                onBlur={e => searchBy.onBlur(e)}
            >
                <option
                    value='0'
                    key='0'
                >
                    Search by
                </option>
                {array?.map(item => 
                     <option
                        value={item}
                        key={item}
                    >
                        {item}
                    </option>
                )}
            </Form.Select>
            <Form.Control
                onKeyPress={onKeyPress}
                type='search'
                className='form-control-search'
                placeholder='Search'
                value={searchParameter.value}
                onChange={e => searchParameter.onChange(e)}
                onBlur={e => searchParameter.onBlur(e)}
            />
            <Button
                className='button_search_table'
                variant='link'
                disabled={!searchParameter.inputValid || !searchBy.inputValid}
                onClick={searchClick}
            >
                Search
            </Button>
        </div>
    );
});

export default SearchFormTable;