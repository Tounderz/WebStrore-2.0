import { makeAutoObservable } from 'mobx'

export default class MessageStore {
    constructor() {
        this._messageError = '';
        this._message = '';

        makeAutoObservable(this);
    }

    setMessageError(messageError) {
        this._messageError = messageError;
    }
    get messageError() {
        return this._messageError;
    }

    setMessage(message) {
        this._message = message;
    }
    get message() {
        return this._message;
    }
}