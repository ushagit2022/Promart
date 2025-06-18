import { createSlice } from "@reduxjs/toolkit";
import {toast} from "react-toastify";

const initialState = {
    cartItems : localStorage.getItem("cartItems")? JSON.parse(localStorage.getItem("cartItems")):[],
    cartTotalQantity : 0,
    cartTotalAmount:0
}

export const cartSlice = createSlice({
    name : "cart",
    initialState,
    reducers:{
        addCartItem :(state,action) =>{
            const itemIndex = state.cartItems.findIndex((item) => item.id === action.payload.id);
            if(itemIndex >= 0){
                 state.cartItems[itemIndex].cartQuantity += 1;
                 toast.info(`${action.payload.name} is increased Quantity`,{
                    position:"bottom-left"
                 }
                    
                 )
            }else{
                const tempCart = {...action.payload, cartQuantity : 1};
                state.cartItems.push(tempCart);
                toast.success(`${action.payload.name} is Added to cart`,{
                    position:"bottom-left"
                 })
            }
            localStorage.setItem("cartItems",JSON.stringify(state.cartItems))
        },
        removeFromCart:(state,action) =>{
            // state.cartItems: 
            const itemAfterRemoved = state.cartItems.filter((cartItem)=>cartItem.id !== action.payload.id);
            state.cartItems = itemAfterRemoved;
           
            toast.warning(`${action.payload.name} is Removed from cart`,{
                position:"bottom-left"
             })
             localStorage.setItem("cartItems",JSON.stringify(state.cartItems));

        },
        decreaseQuantity:(state,action) =>{
            const itemIndex = state.cartItems.findIndex((item) => item.id === action.payload.id);
            if(state.cartItems[itemIndex].cartQuantity > 1){
                state.cartItems[itemIndex].cartQuantity -= 1
            } else if(state.cartItems[itemIndex].cartQuantity === 1){
                const itemAfterRemoved = state.cartItems.filter((cartItem)=>cartItem.id !== action.payload.id);
                state.cartItems = itemAfterRemoved;
               
                toast.info(`Decreased ${action.payload.name} quantity`,{
                    position:"bottom-left"
                 })
            }
            localStorage.setItem("cartItems",JSON.stringify(state.cartItems));

        },
        increaseQuantity:(state,action) =>{
            const itemIndex = state.cartItems.findIndex((item) => item.id === action.payload.id)
            state.cartItems[itemIndex].cartQuantity +=1;

            toast.info(`Increased  ${action.payload.name} quantity`,{
                position:"bottom-left"
             })
        },
        clearCart:(state, action)=>{
            state.cartItems = [];
            toast.error(`Cart is Cleared!`,{
                position:"bottom-left"
             })
             localStorage.setItem("cartItems",JSON.stringify(state.cartItems));
        },
        getTotal:(state,action)=>{
           let {totalAmount, totalQuantity } = state.cartItems.reduce(
               (subtotal, item) => 
                {
                    let {price,cartQuantity}= item;
                    let total = price * cartQuantity;
                 
                    subtotal.totalAmount +=total;
                    subtotal.totalQuantity +=cartQuantity;

                    return subtotal;


                },
                // subtotal + item.price * item.quantity,
                {
                    totalAmount:0,totalQuantity : 0
                }
              );
              state.cartTotalAmount = totalAmount;
              state.cartTotalQantity = totalQuantity;
        }
    }
})

export const {addCartItem,removeFromCart,decreaseQuantity,increaseQuantity, clearCart, getTotal} = cartSlice.actions;

export default cartSlice.reducer;
