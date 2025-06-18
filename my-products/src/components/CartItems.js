
import React from "react";
import {useSelector,useDispatch} from "react-redux"
import { removeFromCart,decreaseQuantity,increaseQuantity, addCartItem} from "../store/cartReducer";
import Table from '@mui/joy/Table';
import Button from 'react-bootstrap/Button';
import CloseIcon from '@mui/icons-material/Close';

// function CartItems({ cartId, cartItems, refreshCart }) {
    function CartItems({ product}) {
  // Call this after each API action to refresh cart state from backend
  // (You might fetch cart items again or update local state)
  const cart= useSelector((state) => state.cart)

  const cartProductQuantity  = cart.cartItems.filter((cartItem) => cartItem.id === product.id).map((cartItem) => cartItem.cartQuantity)
  const dispatch= useDispatch();

  const handleIncrement = async (product) => {
    dispatch(addCartItem(product));
  };

  const handleDecrement = async (product) => {
    dispatch(decreaseQuantity(product));
  };

const handleRemoveItem = (item) =>{
    dispatch(removeFromCart(item));
}

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

const total = Math.round(product.price * cartProductQuantity);

  return (
    <div>
     
       <tr>
               <td>
                       <img src={product.image_url} alt={product.name} width={50} /><br></br>
                       <span>{product.name}</span>
                      
                       </td>
                     <td>{formatINR(product.price)}</td>
                     <td>
                       <div className='plusMinus'>
                       <Button variant='outline-info' className='columns' onClick={() => handleDecrement(product)}>-</Button>&nbsp;&nbsp;&nbsp;
            
                        <span  className='columns'>{product.cartQuantity}</span>&nbsp;&nbsp;&nbsp;
                       
                         <Button variant='outline-info' className='columns' onClick={() => handleIncrement(product)}>+</Button> 
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                         <span className='columns'>
                           
                         <CloseIcon titleAccess='Remove'                    
                           
                            aria-label='remove'
           
                           onClick={() => handleRemoveItem(product)}
                           >
                           </CloseIcon>
                         </span>
                        </div>
     
                     
                         </td>
                     <td>{formatINR(product.price * product.cartQuantity)}</td>
                   </tr>
        {/* <tr>
          <td><img src={product.image_url} alt={product.name} width={50} /><span>{product.name}</span></td>
          <td>{product.price}</td>
          <td><button onClick={() => handleDecrement(product)}>-</button>
             {cartProductQuantity}
              <button  onClick={() => handleIncrement(product)}>+</button> 
             
              <button onClick={() => handleRemoveItem(product)} title="remove" className="btnRemove"  aria-label="Add to Cart">Remove</button></td>
          <td>{formatINR(product.price * cartProductQuantity)}</td>
        </tr> */}

        {/* <ul key={product.id}> */}
        {/* {item.map((product) => ( */}
            {/* <li key={product.id}> */}
              {/* <img src={product.image_url} alt={product.name} width={50} />
              <span>{product.name}</span> */}
              {/* <span>Price: {formatINR(product.price * cartProductQuantity)}</span> */}
              
             {/* <button onClick={() => handleDecrement(product)}>-</button>
             {cartProductQuantity}
              <button  onClick={() => handleIncrement(product)}>+</button> 
             
              <button onClick={() => handleRemoveItem(product)}>Remove</button> */}
            {/* </li> */}
           {/* ))}  */}
        {/* </ul> */}

        
      {/* )} */}
    </div>
  );
}

export default CartItems;