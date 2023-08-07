import { makeAutoObservable } from 'mobx'

export default class TypeStore {
    constructor() {
        this._types = [];
        this._tableTipes = [];
        this._selectedType = {};

        makeAutoObservable(this)
    }

    setTypes(types) {
        this._types = types
    }
    get types() {
        return this._types
    }

    setTableTypes(tableTipes) {
        this._tableTipes = tableTipes
    }
    get tableTypes() {
        return this._tableTipes
    }
    
    setSelectedType(type) {
        this._selectedType = type
    }
    get selectedType() {
        return this._selectedType
    }
}