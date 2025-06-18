import React,{useState} from 'react'
import { useSelector,useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { clearCart } from '../store/cartReducer';


const ConfirmOrder = (props) => {
    const cart= useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const handleClearCart=() =>{
          dispatch(clearCart());
        }
  return (
    <div className="checkoutDiv">
           <div className='checkouts'>
           {/* className="cartCheckout" */}
            <Button variant='outline-danger' onClick={() =>handleClearCart()}>Clear Cart</Button>         
          </div>
          <div className='checkouts'><span>SubToatal :{cart.cartTotalAmount}</span></div>
          <div 
          style={{marginTop:"10px"}}
          //className='checkouts'
          ><Button variant='outline-success' className='btnOrder' 
          onClick = {props.handleCheckout}
           >Checkout</Button></div>
          
          </div>
  )
}

export default ConfirmOrder