import { makeAutoObservable } from 'mobx'

export default class RemoveStore {
    constructor() {
        this._removeObjeck = {}
        this._removeParameterName = ''

        makeAutoObservable(this)
    }

    setRemoveObjeck(removeObjeck) {
        this._removeObjeck = removeObjeck
    }
    
    get removeObjeck() {
        return this._removeObjeck
    }

    setRemoveParameterName(removeParameterName) {
        this._removeParameterName = removeParameterName
    }

    get removeParameterName() {
        return this._removeParameterName
    }
}