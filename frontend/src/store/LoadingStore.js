import { makeAutoObservable } from 'mobx'

export default class LoadingStore {
    constructor() {
        this._isLoading = false

        makeAutoObservable(this)
    }

    setIsLoading(isLoading) {
        this._isLoading = isLoading
    }
    
    get isLoading() {
        return this._isLoading
    }
}