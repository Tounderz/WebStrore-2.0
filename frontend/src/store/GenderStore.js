import { makeAutoObservable } from 'mobx'

export default class GenderStore {
    constructor() {
        this._genders = [];
        this._gender = {};
        this._selectedGender = {};

        makeAutoObservable(this)
    }

    setGenders(genders) {
        this._genders = genders
    }
    get genders() {
        return this._genders
    }

    setGender(gender) {
        this._gender = gender
    }
    get gender() {
        return this._gender
    }

    setSelectedGender(selectedGender) {
        this._selectedGender = selectedGender
    }
    get selectedGender() {
        return this._selectedGender
    }
}