import React from "react";
import axios from 'axios';
import { setProductsList, setCartItems} from "../store/productsReducer";
import { setCategoriesList } from "../store/categoriesReducer";
import {toast} from "react-toastify";


const apiUrl = "http://127.0.0.1:5000"

export const gerLoginUserId = (name,email,is_admin,auth0_id,created_at) =>async(dispatch) =>{
    return axios.post(`${apiUrl}/api/users`, {
        name,
        email,
        // password,
        is_admin,
        auth0_id,
        created_at
      }).then((res) =>{
        console.log(res,"userId");
        return res.data
      }).catch((err) => {
        // Optionally handle error (e.g., user already exists)
        console.error(err);
      });
}

export const getProducts = () => async (dispatch) =>{
    return axios.get(`${apiUrl}/api/productslist`,{}, 
        {
        headers: {
          "Content-Type": "application/json",
        },
    }
      ).then((res)=> {
        // console.log(res.data,"data");
       if(res.data) dispatch(setProductsList(res.data));
    //    return res.data;

      }).catch((err) =>{
        console.log(err)
      })
}

export const getCategories = () => async (dispatch) =>{
    return axios.get(`${apiUrl}/api/categorylist`,{}, 
        {
        headers: {
          "Content-Type": "application/json",
        },
    }
      ).then((res)=> {
       if(res.data) dispatch(setCategoriesList(res.data));
      }).catch((err) =>{
        console.log(err)
      })
}

// Add product to cart or increment quantity
// export const addProductToCart = async (cartId, productId) => {
//   return axios.post('/api/cart_items', {
//     cartId,
//     productId,
//     action: 'increment'
//   }).then((res) => {
//     return res.data;
//   }).catch((err)=>{
//     console.log(err)
//   });
// };

// Similarly, after add/increment/decrement/remove, dispatch setCartItems with the new cart data
export const addProductToCart = (cartId, productId) => async (dispatch) => {
    return await axios.post(`${apiUrl}/api/cart_items`, {
        cartId,
        productId,
        action: 'increment'
      }).then((res) =>{
        dispatch(setCartItems(res.data));
        return res.data;
      }).catch((err) => {
      console.error(err);
    })
  };

// Decrement product quantity in cart
export const decrementProductInCart = (cartId, productId) => async (dispatch) => {
  return axios.post(`${apiUrl}/api/cart_items`, {
    cartId,
    productId,
    action: 'decrement'
  }).then((res) => {
    dispatch(setCartItems(res.data));
    return res.data;
  }).catch((err)=>{
    console.log(err)
  });
};

// Add product with specific quantity
export const addProductWithQuantity =  (cartId, productId, quantity) => async (dispatch) => {
  return axios.post(`${apiUrl}/api/cart_items`, {
    cartId,
    productId,
    quantity,
    action: 'add'
  }).then((res) => {
    dispatch(setCartItems(res.data));
    return res.data;
  }).catch((err)=>{
    console.log(err)
  });
};

// Remove product from cart
export const removeProductFromCart = (cartId, productId) => async (dispatch) => {
  return axios.post(`${apiUrl}/api/cart_items`, {
    cartId,
    productId,
    action: 'remove'
  }).then((res) => {
    dispatch(setCartItems(res.data));
    return res.data;
  }).catch((err)=>{
    console.log(err)
  });
};

export const getCartItems = (cartId) => async (dispatch) => {
    try {
      const res = await axios.get(`${apiUrl}/api/cart_items?cartId=${cartId}`);
      dispatch(setCartItems(res.data));
      return res.data;
    } catch (err) {
      console.error(err);
      dispatch(setCartItems([]));
      return [];
    }
  };

  export const getOrCreateCartId = async (userId = null) => {
    let cartId = localStorage.getItem("cartId");
    if (!cartId) {
      // Call backend to create a new cart
      return await axios.post(`${apiUrl}/api/create_cart`,
         { user_id: userId }.then((res)=>{
            cartId = res.data.cart_id;
      localStorage.setItem("cartId", cartId);
      return cartId;
         }).catch((err) =>{
           console.log(err)
         })
        )
    }
  }

export const addToCartApi =  (productId,userId) =>async (dispatch)=> {
    const created_at = new Date().toISOString();
  let cartIdStored = localStorage.getItem("cartId");
  let cartId 
  
  if (!cartIdStored) {
    // Create cart if it doesn't exist
    const res = await axios.post(`${apiUrl}/api/create_cart`,{user_id : userId,created_at: created_at});
    cartIdStored = res.data.cart_id;
    localStorage.setItem("cartId",cartIdStored);
    cartId = cartIdStored
  }

//   cartId = parseInt(cartIdStored);
console.log(typeof cartId,"cart from back ID", cartId)
  // Now add the product to the cart
  await axios.post(`${apiUrl}/api/cart_items`, {
    cartId,
    productId,
    action: "increment",
  });
};

export const handleCheckoutApi =  (cartItems, userId) => async (dispatch) => {
  return await axios.post(`${apiUrl}/cart/checkout`, {
      user_id: userId,
      items: cartItems, // [{ product_id, quantity, price }, ...]
    }).then((res) =>{
      console.log(res.data,"response with cart_id && cart_id");
      toast.info(`${res.data.message} `,{
                          position:"bottom-left"
                       })
      return res.data && res.data.cart_id;
    }).catch((err) =>{
       console.log(err)
    })
    // Handle success (show confirmation, clear cart, etc.)
  
};

export const placeOrder = async (userId, total, paymentId, items) => {
  try {
    const response = await axios.post("/api/orders", {
      user_id: userId,
      total,
      payment_id: paymentId,
      items,
    });
    return response.data; // { order_id: ... }
  } catch (error) {
    throw error;
  }
};

//to make the call for razorpay and open the razorpay popup, based on payment success call the orders api to update the db.
export const handleRazorpayAndOrder = ({ userId, cartItems, total }) => async(dispatch) =>{
  try {
    // 1. Create Razorpay order
    const razorpayRes = await axios.post(`${apiUrl}/api/razorpay_order`, {
      amount: total * 100, // amount in paise
    });

    if (razorpayRes.data && razorpayRes.data.id) {
      // 2. Open Razorpay checkout
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID",
        amount: razorpayRes.data.amount,
        currency: razorpayRes.data.currency,
        order_id: razorpayRes.data.id,
        handler: async function (response) {
          // 3. On payment success, create order in your DB
          await axios.post("/api/orders", {
            user_id: userId,
            total: total,
            payment_id: response.razorpay_payment_id,
            items: cartItems,
          });
          alert("Order placed successfully!");
        },
        prefill: { name: "User", email: "user@example.com" },
        theme: { color: "#3399cc" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      alert("Failed to create Razorpay order.");
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// const handlePaymentSuccess = async () => {
//   try {
//     const result = await placeOrder(
//       userId,
//       total,
//       paymentId,
//       cartItems // [{ product_id, quantity, price }]
//     );
//     console.log("Order placed:", result.order_id);
//     // Show confirmation, redirect, etc.
//   } catch (err) {
//     console.error("Order failed:", err);
//     // Show error message
//   }
// };


