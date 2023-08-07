import { makeAutoObservable } from 'mobx'

export default class AuthStore {
    constructor() {
        this._auth = {};

        makeAutoObservable(this)
    }

    setAuth(auth) {
        this._auth = auth
    }
    get auth() {
        return this._auth
    }
}