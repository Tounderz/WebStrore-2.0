import { makeAutoObservable } from 'mobx'

export default class RoleStore {
    constructor() {
        this._roles = [];
        this._role = {};
        this._selectedRole = {};

        makeAutoObservable(this)
    }

    setRoles(roles) {
        this._roles = roles
    }
    get roles() {
        return this._roles
    }

    setRole(role) {
        this._role = role
    }
    get role() {
        return this._role
    }

    setSelectedRole(selectedRole) {
        this._selectedRole = selectedRole
    }
    get selectedRole() {
        return this._selectedRole
    }
}