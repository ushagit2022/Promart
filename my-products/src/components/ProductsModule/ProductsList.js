import React, { useEffect, useState } from 'react';
import axios from "axios"
import "../../Styles/App.css"
import { FiPlusSquare } from "react-icons/fi";
import { FaRegMinusSquare } from "react-icons/fa";
import {getProducts} from "../../actions/dbActions";
import {useDispatch, useSelector} from "react-redux"
import Product from './Products';


function ProductsList({products,addToCart,cartItems, removeFromCart}) {
  

  const dispatch = useDispatch();
  // const productList = useSelector((state)=> state.products.productsList)

// useEffect(() => {
//     dispatch(getProducts())
//     // .then(res=> setProducts(res))
//     // .catch(err=> console.log(err));
//   }, [dispatch]);
//   console.log(productList,"productList")

// const handleIncrement = (productId) =>{
//     setProductCount(prevVal => ({
//         ...prevVal,
//         [productId] : (prevVal[productId] || 0 ) + 1
//     })
//     );
// }

// const handleDecrement = (productId) =>{
//     setProductCount(prev => ({...prev,
//         [productId] : Math.max((prev[productId] || 0) -1,0)
//      }));
// }

// const handleAddItem=() =>{
//     console.log("Item Added to cart");
// }

  return (
    <div style={{ maxWidth: "90%", margin: '2rem auto' }}>
      <h2>Products</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10,}}>
        { products && products.map(product => (
          // <div key={product.id} style={{ border: '1px solid #ddd', padding: 16, width: 220 , borderRadius: "8px"}}>
          //   <img src={product.image_url} alt={product.name} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
          //   <h3>{product.name}</h3>
          //   <p>{product.description}</p>
          //   <div>Price: ₹{product.price}</div>
          //   <div style={{display:"flex",jystifyContent:"space-between",alignItems:"center"}}>Stock: {product.stock} 
                
          //       </div>
          //       <div ><button className='smallBtn' onClick={() => handleIncrement(product.id)}>+</button> {" "}{productCount[product.id] || 0}{" "}
          //       <button className='smallBtn' onClick={() =>handleDecrement(product.id)}>-</button> 
          //       &nbsp;&nbsp;&nbsp;&nbsp;
          //       <span><button type="submit" className='btnClass' onClick={handleAddItem}>Add</button></span></div>
               
          // </div>
          <Product 
          key={product.id} 
          cartItems={cartItems}
                    product={product} 
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                    />
          
        ))}
      </div>
    </div>
  );
}

export default ProductsList;