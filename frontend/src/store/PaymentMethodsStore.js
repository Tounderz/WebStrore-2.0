import { makeAutoObservable } from 'mobx'

export default class PaymentMethodsStore {
    constructor() {
        this._paymentMethods = []

        makeAutoObservable(this)
    }

    setPaymentMethods(paymentMethods) {
        this._paymentMethods = paymentMethods
    }
    get paymentMethods() {
        return this._paymentMethods
    }
}