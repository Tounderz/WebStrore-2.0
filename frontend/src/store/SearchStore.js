import { makeAutoObservable } from 'mobx'

export default class SearchStore {
    constructor() {
        this._selectedSearchParameter = '';
        this._searchBy = '';

        makeAutoObservable(this)
    }

    setSelectedSearchParameter(parameter) {
        this._selectedSearchParameter = parameter
    }
    get selectedSearchParameter() {
        return this._selectedSearchParameter
    }

    setSearchBy(searchBy) {
        this._searchBy = searchBy
    }
    get searchBy() {
        return this._searchBy
    }
}