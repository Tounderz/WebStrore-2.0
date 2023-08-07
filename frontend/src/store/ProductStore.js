import { makeAutoObservable } from 'mobx'

export default class ProductStore {
    constructor() {
        this._products = [];
        this._changeProducts = [];
        this._popularProducts = [];
        this._selectedProduct = {};

        this._infoProduct = [];
        this._selectedInfoProduct = {};

        this._selectedAvailable = 0;
        this._selectedIsFavourite = 0;

        makeAutoObservable(this)
    }

    setProducts(products) {
        this._products = products
    }
    get products() {
        return this._products
    }

    setChangeProducts(products) {
        this._changeProducts = products
    }
    get changeProducts() {
        return this._changeProducts;
    }

    setPopularProducts(popularProducts) {
        this._popularProducts = popularProducts
    }
    get popularProducts() {
        return this._popularProducts
    }

    setSelectedProduct(product) {
        this._selectedProduct = product
    }
    get selectedProduct() {
        return this._selectedProduct
    }

    setInfoProduct(infoProduct) {
        this._infoProduct = infoProduct
    }
    get infoProduct() {
        return this._infoProduct
    }
    
    setSelectedInfoProduct(info) {
        this._selectedInfoProduct = info
    }
    get selectedInfoProduct() {
        return this._selectedInfoProduct
    }

    setSelectedAvailable(available) {
        this._selectedAvailable = available
    }
    get selectedAvailable() {
        return this._selectedAvailable
    }

    setSelectedIsFavourite(isFavourite) {
        this._selectedIsFavourite = isFavourite
    }
    get selectedIsFavourite() {
        return this._selectedIsFavourite
    }
}