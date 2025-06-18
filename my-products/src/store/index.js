import {configureStore} from '@reduxjs/toolkit'
import logger from "redux-logger";
import productsReducer from './productsReducer';
import categoriesReducer from "./categoriesReducer";
import cartReducer, { getTotal } from "./cartReducer";

const store = configureStore({
 reducer: {
    products:productsReducer,
    categories:categoriesReducer,
    cart:cartReducer
 },
 middleware:(getDeafaultMiddleware) =>getDeafaultMiddleware().concat(logger)
})

store.dispatch(getTotal());

export default store;