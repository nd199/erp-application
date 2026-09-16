import {createAsyncThunk} from '@reduxjs/toolkit';
import {productsAPI} from '../api/products';

const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async (params) => {
        const {data} = await productsAPI.getAll(params)
        return data.content || data;
    }
)

const fetchProductById = createAsyncThunk(
    'products/fetchById',
    async (id) => {
        const {data} = await productsAPI.getById(id)
        return data
    }
)

const createProduct = createAsyncThunk(
    'products/create',
    async (payload) => {
        const {data} = await productsAPI.create(payload)
        return data
    }
)

const updateProduct = createAsyncThunk(
    'products/update',
    async ({id, ...payload}) => {
        const {data} = await productsAPI.update(id, payload)
        return data
    }
)

const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id) => {
        await productsAPI.delete(id)
        return id
    }
)

const searchProduct = createAsyncThunk(
    'products/search',
    async ({keyword, params}) => {
        const {data} = await productsAPI.search(keyword, params)
        return data.content || data
    }
)

export {
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProduct
}