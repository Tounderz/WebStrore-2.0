import { makeAutoObservable } from 'mobx'

export default class SortStore {
    constructor() {
        this._fieldNames = []
        this._fieldName = ''
        this._typeSort = ''

        makeAutoObservable(this)
    }

    setFieldNames(fieldNames) {
        this._fieldNames = fieldNames
    }
    get fieldNames() {
        return this._fieldNames
    }

    setFieldName(fieldName) {
        this._fieldName = fieldName
    }
    get fieldName() {
        return this._fieldName
    }

    setTypeSort(typeSort) {
        this._typeSort = typeSort
    }
    get typeSort() {
        return this._typeSort
    }
}