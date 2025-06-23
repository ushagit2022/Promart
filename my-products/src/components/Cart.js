import React, { useEffect } from 'react';
import CartItem from './CartItems';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, getTotal } from '../store/cartReducer';
import { removeFromCart, decreaseQuantity, increaseQuantity, addCartItem } from "../store/cartReducer";
import Table from '@mui/joy/Table';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import CloseIcon from '@mui/icons-material/Close';
import ConfirmOrder from './ConfirmOrder';
import InputGroup from 'react-bootstrap/InputGroup';


function Cart(props) {
  const cart = useSelector((state) => state.cart);

  // const cartProductQuantity  = cart.cartItems.filter((cartItem) => cartItem.id === props.product.id).map((cartItem) => cartItem.cartQuantity)
  const loginPhoneNumber = useSelector((state) => state.products.loginPhoneNumber);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTotal())
  }, [cart, dispatch])

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  // Simple validation: checks for 10 digits (Indian mobile format)
  const validatePhone = (num) => {
    return /^[6-9]\d{9}$/.test(num);
  };

  const handleChangePhone= (e) =>{
    e.preventDefault();
    setPhone(e.target.value)
  }

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!phone) {
      setError("Phone number is required.");
      return;
    }
    if (!validatePhone(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError("");
    // Call parent handler with phone number
    props.handlePhoneNumber(phone);
  };

  const handleIncrement = async (product) => {
    dispatch(addCartItem(product));
  };

  const handleDecrement = async (product) => {
    dispatch(decreaseQuantity(product));
  };

  const handleRemoveItem = (item) => {
    dispatch(removeFromCart(item));
  }

  function formatINR(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  }


  const handleClearCart = () => {
    dispatch(clearCart());
  }

  const PhoneNumberModal = () => {
    // return (
    //   <>
    //     <Modal
    //       show={props.show}
    //       size="lg"
    //       aria-labelledby="contained-modal-title-vcenter"
    //       centered
    //     >
    //       <Modal.Header >
    //         <Modal.Title id="contained-modal-title-vcenter">
    //           Products Mart
    //         </Modal.Title>
    //       </Modal.Header>
    //       <Modal.Body>
    //         <h4>Sign in with Mobile Number</h4>
    //         <Form>
    //           <InputGroup className="mb-3">
    //           <InputGroup.Text>Mobile Number:</InputGroup.Text>
    //             <InputGroup.Text id="basic-addon1">+91</InputGroup.Text>
    //             <Form.Control
    //               placeholder="Phone Number"
    //               aria-label="Phone Number"
    //               aria-describedby="basic-addon1"
    //             />
    //           </InputGroup>
    //         </Form>
    //       </Modal.Body>
    //       <Modal.Footer>
    //         <Button variant="secondary" onClick={() => props.handleClose()}>
    //           Close
    //         </Button>
    //         <Button variant="primary" onClick={props.handlePhoneNumber}>
    //           Save Changes
    //         </Button>
    //       </Modal.Footer>
    //     </Modal>
    //   </>

    // );
    return (
      <>
        <Modal
          show={props.show}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Products Mart
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Sign in with Mobile Number</h4>
            <Form onSubmit={(e) => e.preventDefault()}>
              <InputGroup className="mb-3">
                <InputGroup.Text>Mobile Number:</InputGroup.Text>
                <InputGroup.Text id="basic-addon1">+91</InputGroup.Text>
                <Form.Control
                  placeholder="Phone Number"
                  aria-label="Phone Number"
                  aria-describedby="basic-addon1"
                  value={phone}
                  onChange={handleChangePhone}
                  maxLength={10}
                />
              </InputGroup>
              {error && (
                <div style={{ color: "red", fontSize: "0.9em" }}>{error}</div>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  return (
    <div >
      {(loginPhoneNumber === 0) ? (
        <PhoneNumberModal></PhoneNumberModal>
      ) : (
        <>

          <h3>Your Cart</h3>
          <div className="cart__left">
            {cart.cartItems.length ? (
              <>
                <Table>
                  {/* <thead>
              <tr>
                <th style={{ width: '40%' }}>Product</th>
                <th>Price(Rupies)</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead> */}
                  {/* <tbody> */}
                    {cart.cartItems?.map((product, index) => (
                      <CartItem product={product}></CartItem>
                    ))}
                  {/* </tbody> */}


                </Table>

                <ConfirmOrder handleCheckout={props.handleCheckout}></ConfirmOrder>
              </>
            ) : (
              <div> Your Cart is Empty!</div>
            )}

          </div>
          <span
            //  className="continueShop"
            style={{ cursor: "pointer" }}

            onClick={props.handleProductsPage}><u>Countinue Shopping...</u>
          </span>
        </>
      )}

    </div>
  );
}
// <tr key={index}>

//       <td>
//     <img src={product.image_url} alt={product.name} width={50} /><br></br>
//     <span>{product.name}</span>

//     </td>
//   <td>{formatINR(product.price)}</td>
//   <td>
//     <div className='plusMinus'>
//     <Button variant='outline-info' className='columns' onClick={() => handleDecrement(product)}>-</Button>&nbsp;&nbsp;&nbsp;

//      <span  className='columns'>{product.cartQuantity}</span>&nbsp;&nbsp;&nbsp;

//       <Button variant='outline-info' className='columns' onClick={() => handleIncrement(product)}>+</Button> 
//       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//       <span className='columns'>

//       <CloseIcon titleAccess='Remove'                    

//          aria-label='remove'

//         onClick={() => handleRemoveItem(product)}
//         >
//         </CloseIcon>
//       </span>
//      </div>


//       </td>
//   <td>{formatINR(product.price * product.cartQuantity)}</td>
// </tr>

{/* <Table>
            <thead>
        <tr>
          <th style={{ width: '40%' }}>Product</th>
          <th>Price(Rupies)</th>
          <th>Quantity</th>
          <th>Total</th>
          
        </tr>
      </thead>
      {cart.cartItems?.map((product) => (
            <>
      <CartItem
            product={product}
            />
            </>
          ))}
          </Table> */}
{/* <div className="checkoutDiv">
           <div className='checkouts'>
          
            <Button variant='outline-danger' onClick={() =>handleClearCart()}>Clear Cart</Button>         
          </div>
          <div 
          style={{marginTop:"10px"}}
          
          ><Button variant='outline-success' className='btnOrder' 
          
         
           >Checkout</Button></div>
          <div className='checkouts'><span>SubToatal :{cart.cartTotalAmount}</span></div>
          </div> */}


export default Cart;