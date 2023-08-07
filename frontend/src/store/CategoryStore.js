import { makeAutoObservable } from 'mobx'

export default class CategoryStore {
    constructor() {
        this._categories = [];
        this._popularCategories = [];
        this._tableCategories = [];
        this._categoriesByBrand = [];
        this._selectedCategory = {};

        makeAutoObservable(this)
    }

    setCategories(categories) {
        this._categories = categories
    }
    get categories() {
        return this._categories
    }

    setTableCategories(tableCategories) {
        this._tableCategories = tableCategories
    }
    get tableCategories() {
        return this._tableCategories
    }
    
    setPopularCategories(popularCategories) {
        this._popularCategories = popularCategories
    }
    get popularCategories() {
        return this._popularCategories
    }
    
    setCategoriesByBrand(categoriesByBrand) {
        this._categoriesByBrand = categoriesByBrand
    }
    get categoriesByBrand() {
        return this._categoriesByBrand
    }
    
    setSelectedCategory(category) {
        this._selectedCategory = category
    }
    get selectedCategory() {
        return this._selectedCategory
    }
}