import { makeAutoObservable } from 'mobx'

export default class UserStore {
    constructor() {
        this._selectedUser = {}
        this._user = {}
        this._usersList = []

        makeAutoObservable(this)
    }

    setUser(user) {
        this._user = user
    }
    get user(){
        return this._user
    }

    setUsersList(usersList) {
        this._usersList = usersList
    }
    get usersList() {
        return this._usersList
    }

    setSelectedUser(user) {
        this._selectedUser = user
    }
    get selectedUser() {
        return this._selectedUser
    }
}