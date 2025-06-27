import {createSlice} from '@reduxjs/toolkit';

const initialState = {
// sendProduct:{},
productsList:[],
cartProductsCountIncrement:[],
// cart: [],
cartItems :[],
loginUserId : null,
quantities: [],
loginPhoneNumber:"",
}

export const products = createSlice({
    name:"products",
    initialState,
    reducers:({
        setLoginPhonenumber:(state,action) =>{
          state.loginPhoneNumber= action.payload;
        },
        setProductIncrement: (state,action) =>{
           state.quantities = {...state,
            quantities: {
              ...state.quantities,
              [action.payload]: (state.quantities[action.payload] || 0) + 1,
            }}        
        },
        setProductDecrement:(state,action)=>{
          state.quantities ={...state,quantities:{ ...state.quantities,[action.payload]: Math.max((state.quantities[action.payload] || 1) - 1,1)}}
        },
        setLoginUserId: (state,action) =>{
   state.loginUserId = action.payload
        },
        setProductsList : (state,action) =>{
            state.productsList =  action.payload ;
        },
        //Client side calculation for the cart items
        // addProductToCart: (state, action) => {
        //     const itemInCart = state.cart.find((item) => item.id === action.payload.id);
        //     if (itemInCart) {
        //       itemInCart.quantity++;
        //     } else {
        //       state.cart.push({ ...action.payload, quantity: 1 });
        //     }
        //   },
        //   incrementQuantity: (state, action) => {
        //     const item = state.cart.find((item) => item.id === action.payload);
        //     item.quantity++;
        //   },
        //   decrementQuantity: (state, action) => {
        //     const item = state.cart.find((item) => item.id === action.payload);
        //     if (item.quantity === 1) {
        //       item.quantity = 1
        //     } else {
        //       item.quantity--;
        //     }
        //   },
        //   removeFromCart: (state, action) => {
        //     const removeItem = state.cart.filter((item) => item.id !== action.payload);
        //     state.cart = removeItem;
        //   },
        setCartItems :(state,action)=>{
            state.cartItems = action.payload
        }
    })
})

export const {
    setLoginPhonenumber,
    setProductIncrement,
    setProductDecrement,
    setLoginUserId,
    setCartItems,
    setProductsList,
    // addProductToCart,decrementQuantity,incrementQuantity,removeFromCart
}= products.actions;

export default products.reducer;

// In your main entry file, e.g., App.js or _app.js (Next.js)
// import { CartProvider } from "./CartContext";

// function MyApp({ Component, pageProps }) {
//   return (
//     <CartProvider>
//       <Component {...pageProps} />
//     </CartProvider>
//   );
// }

// export default MyApp;