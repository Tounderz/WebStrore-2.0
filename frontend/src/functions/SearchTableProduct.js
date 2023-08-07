import { fetchSearchProductAdmin } from "../http/searchApi";
import { IS_NUMBER, PAGE_FIRST } from "../utils/const";

export const SearchTableProduct = async (searchBy, searchParameter) => {
        const searchByArray = ['Id', 'Price', 'CountView'];
        
        if (searchByArray.find(item => item === searchBy)) {
            if (!IS_NUMBER.test(searchParameter)) {
                return null;
            }
        } else if (searchBy === 'Available') {
            if (searchParameter.toLowerCase() !== 'true' && searchParameter.toLowerCase() !== 'false') {
                return null;
            }
        }

        const data = await fetchSearchProductAdmin(searchParameter, PAGE_FIRST, searchBy);
        return data;
}