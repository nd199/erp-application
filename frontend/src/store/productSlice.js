import {createSlice} from '@reduxjs/toolkit';
import {
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProduct
} from './productThunks.js'

const pending = (state) => {
    state.loading = true
    state.error = null
}
const rejected = (state, action) => {
    state.loading = false
    state.error = action.error.message
}

const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        currProduct: null,
        loading: false,
        error: null
    },
    reducers: {
        clearCurrProduct: (state) => {
            state.currProduct = null;
        },
        clearProdErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                pending(state)
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(fetchProductById.pending, (state) => {
                pending(state)
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false
                state.currProduct = action.payload
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(createProduct.pending, (state) => {
                pending(state)
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false
                state.products.push(action.payload)
            })
            .addCase(createProduct.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(updateProduct.pending, (state) => {
                pending(state)
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false
                state.products = state.products
                    .map(p => p.id === action.payload.id ? action.payload : p)
            })
            .addCase(updateProduct.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(deleteProduct.pending, (state) => {
                pending(state)
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false
                state.products = state.products
                    .filter(p => p.id !== action.payload)
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                rejected(state, action)
            })
            .addCase(searchProduct.pending, (state) => {
                pending(state)
            })
            .addCase(searchProduct.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload
            })
            .addCase(searchProduct.rejected, (state, action) => {
                rejected(state, action)
            })
    }
})

export const {clearCurrProduct, clearProdErrors} = productSlice.actions
export default productSlice.reducer;