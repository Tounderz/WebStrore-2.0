import { makeAutoObservable } from 'mobx'

export default class PaginationStore {
    constructor() {
        this._currentPage = 1
        this._countPages = []

        makeAutoObservable(this)
    }

    setCurrentPage(currentPage) {
        this._currentPage = currentPage
    }
    get currentPage() {
        return this._currentPage;
    }

    setCountPages(countPages) {
        this._countPages = countPages
    }
    get countPages() {
        return this._countPages
    }
}