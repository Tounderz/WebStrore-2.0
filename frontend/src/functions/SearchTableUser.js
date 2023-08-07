import { fetchSearchUsers } from "../http/searchApi";
import { IS_EMAIL, IS_NUMBER, IS_PHONE, PAGE_FIRST } from "../utils/const";

export const SearchTableUser = async (searchBy, searchParameter) => {
        switch(searchBy) {
            case 'Id':
                if (!IS_NUMBER.test(searchParameter)) {
                    return null;
                }
            break;
            case 'Phone':
                if (!IS_PHONE.test(searchParameter)) {
                    return null;
                }
                break;
            case 'Email':
                if (!IS_EMAIL.test(String(searchParameter).toLowerCase())) {
                    return null;
                }
                break;
            default:
                break;
        }

        const data = await fetchSearchUsers(searchParameter, PAGE_FIRST, searchBy);
        return data;
}