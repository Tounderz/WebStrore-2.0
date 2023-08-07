import { makeAutoObservable } from 'mobx'

export default class CartStore {
    constructor() {
        this._carts = [];
        this._totalAmount = 0;

        makeAutoObservable(this)
    }

    setCarts(carts) {
        this._carts = carts
    }
    get carts() {
        return this._carts
    }

    setTotalAmount(totalAmount) {
        this._totalAmount = totalAmount
    }
    get totalAmount() {
        return this._totalAmount
    }   
}