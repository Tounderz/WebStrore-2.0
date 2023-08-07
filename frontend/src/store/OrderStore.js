import { makeAutoObservable } from 'mobx'

export default class OrderStore {
    constructor() {
        this._ordersList = [];
        this._selectedOrderId = {};
        this._totalAmount = 0;

        makeAutoObservable(this)
    }

    setSelectedOrderId(orderId) {
        this._selectedOrderId = orderId
    }
    get selectedOrderId() {
        return this._selectedOrderId
    }
    
    setOrdersList(ordersList) {
        this._ordersList = ordersList
    }
    get ordersList() {
        return this._ordersList
    }

    setTotalAmount(totalAmount) {
        this._totalAmount = totalAmount
    }
    get totalAmount() {
        return this._totalAmount
    }   
}