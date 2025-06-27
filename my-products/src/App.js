import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import CategoryNav from "./components/CategoryNav";
import ProductsCarousel from "./components/ProductsModule/ProductsCarousel";
import ProductsList from "./components/ProductsModule/ProductsList";
import Products from "./components/ProductsModule/Products";
import "./Styles/App.css";
import { getCategories,getSubCategories, getProducts,getCartItems,addProductToCart,removeProductFromCart,addToCartApi,handleCheckoutApi,handleRazorpayAndOrder } from "./actions/dbActions";
import { useDispatch, useSelector } from "react-redux";
import Cart from "./components/Cart";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify";
// import { addProductToCart, removeFromCart } from "./store/productsReducer";
import { v4 as uuidv4 } from 'uuid';
import { setLoginPhonenumber } from "./store/productsReducer";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import CloseIcon from '@mui/icons-material/Close';
// import ConfirmOrder from './ConfirmOrder';
import InputGroup from 'react-bootstrap/InputGroup';
import ProductsManage from "./components/Admin/ProductsManage";
import CategoryManage from "./components/Admin/CategoryManage";
import SubcategoryManage from "./components/Admin/SubcategoryManagement";
import UserManagement from "./components/Admin/UserManagement";

function App() {
  const [cartPage, setCartPage] = useState(false);
  const [productsHomePage, setProductsHomePage] = useState(true)
  const [confirmOrderPage, setConfirmOrderPage] = useState(false)
  const [cartItemRef, setCartItemRef] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({})
  const [mobileModal, setMobileModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [paymentPage, setpaymentPage] = useState(false);

  const productsData = useSelector((state) => state.products.productsList);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const loginUserId = useSelector((state) => state.products.loginUserId);
  const loginPhoneNumber = useSelector((state) => state.products.loginPhoneNumber);
  const cartTotalAmount = useSelector((state) => state.cart.cartTotalAmount);

 
  let cartId = localStorage.getItem('cartId');


  const dispatch = useDispatch();
  useEffect(() => {
    // This will clear a specific key
    window.onbeforeunload = () => {
      localStorage.removeItem('cartId'); // replace 'yourKey' with your actual key
    };

    // If you want to clear all localStorage on refresh:
    // window.onbeforeunload = () => {
    //   localStorage.clear();
    // };
  }, []);

  useEffect(() => {
    // console.log(categoriesList,"categoriesList");
    dispatch(getProducts())
    dispatch(getCategories())
    dispatch(getSubCategories())
  }, [dispatch]);

  // useEffect(() => {
  //   // Listen for browser back button
  //   const handlePopState = () => {
  //     setCartPage(false); // Go back to products page
  //   };

  //   if (cartPage) {
  //     window.history.pushState({ cart: true }, "Cart", "#cart");
  //     window.addEventListener("popstate", handlePopState);
  //   }

  //   return () => {
  //     window.removeEventListener("popstate", handlePopState);
  //   };
  // }, [cartPage]);

//   const refreshCart = async () => {
//     const items = await getCartItems(cartId);
//     setCartItemRef(items);
//   };

   // Fetch cart items when component mounts or cartId changes
//    useEffect(() => {
//     if(cartItems.length)
// { refreshCart();
// }    
//   }, [cartId,]);

  
//   if (!cartId) {
//     cartId = uuidv4();
//     cartId = parseInt(cartId, 10);
//     localStorage.setItem('cartId', cartId);
// }

if (cartId) {
  cartId = parseInt(cartId, 10); // Convert string to integer
  localStorage.setItem('cartId', cartId);
}

  // Decrement quantity or remove product
  const decrementFromCart = (productId) => {
    // setCart((prevCart) => {
    //     const existing = prevCart.find(item => item.product.id === productId);
    //     if (existing && existing.quantity > 1) {
    //         return prevCart.map(item =>
    //             item.product.id === productId
    //                 ? { ...item, quantity: item.quantity - 1 }
    //                 : item
    //         );
    //     } else {
    //         return prevCart.filter(item => item.product.id !== productId);
    //     }
    // });
    dispatch(removeProductFromCart(productId))
  };

  // Simple validation: checks for 10 digits (Indian mobile format)
  const validatePhone = (num) => {
    console.log(/^[6-9]\d{9}$/.test(num));
    return /^[6-9]\d{9}$/.test(num);
  };

  const handleChangePhone= (e) =>{
    e.preventDefault();
    setPhone(e.target.value)
  }

  const handleSave = (e) => {
    // e.preventDefault();
    // e.stopPropagation();
    if (!phone) {
      setPhoneError("Phone number is required.");
      return;
    }
    if (!validatePhone(phone)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      return;
    }
    setPhoneError("");
    // Call parent handler with phone number
    // dispatch(setLoginPhonenumber(number))
    handlePhoneNumber(phone)
  };

  const handleCartPage =() =>{
    // if(validatePhone(phone)){
      setMobileModal(true);
    setCartPage(true);
    setProductsHomePage(false);

    // setConfirmOrderPage(false)
    // }
  }

  const handleProductsPage=()=>{
    setCartPage(false);
    setProductsHomePage(true);
    // setConfirmOrderPage(false);
  }

  const handleDisplayProduct = (product)=>{
    setCartPage(false);
    setProductsHomePage(false);
    // setConfirmOrderPage(false);
    setSelectedProduct(product)
  }

//   const handleCheckout = () =>{
//     setCartPage(false);
//     setProductsHomePage(false);
//     setConfirmOrderPage(true);
//   }
  const handlePhoneNumber =(number) =>{
    dispatch(setLoginPhonenumber(number))
  }

  const handleCheckOut =() =>{
    console.log("Handle Checkout..")
//   dispatch(handleCheckoutApi(cartItems,11)).then((cart_id) =>{

    dispatch(handleRazorpayAndOrder(10,cartItems,cartTotalAmount)).then((data) =>{
    console.log("cart_id")
    // setpaymentPage(true);
  });
    // dispatch(addToCartApi(cartItems,loginUserId));
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
          show={mobileModal}
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
              {phoneError && (
                <div style={{ color: "red", fontSize: "0.9em" }}>{phoneError}</div>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={()=>setMobileModal(false)}>
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
    <div>
      <NavBar viewCart={handleCartPage} ></NavBar>
      <ToastContainer></ToastContainer>
      <CategoryNav handleDisplayProduct ={handleDisplayProduct}></CategoryNav>
      {(!cartPage && productsHomePage ) ? (
        <>
      <div className="carouselSection">
        <ProductsCarousel></ProductsCarousel>
      </div>
      <ProductsList products={productsData} 
      cartItems={cartItems} removeFromCart={decrementFromCart}
      ></ProductsList>

       {/* <ProductsManage></ProductsManage> */}
      {/* <CategoryManage></CategoryManage>
      <SubcategoryManage></SubcategoryManage> */}
      {/* <UserManagement></UserManagement> */}
      </>
    ) : (cartPage && !productsHomePage) ?(

      <Cart 
      // cartId={cartId}
      // cart={cartItems}
      // refreshCart={refreshCart}
      handleProductsPage={handleProductsPage}

     
      handlePhoneNumber={handlePhoneNumber}
      // show={mobileModal}
      // handleClose={() => setMobileModal(false)}

      handleCheckout = {handleCheckOut}
      // handleCheckout={handleCheckout} // to call confirm Order page

      // cartItems={cart}
      //   addToCart={addToCart}
      //   removeFromCart={decrementFromCart}
      />
    ) : 
    // (!cartPage && !productsHomePage)
    (
      <Products product={selectedProduct}></Products>
    )
      }
      {/* {confirmOrderPage && (
        <ConfirmOrder></ConfirmOrder>
      )} */}
  {!loginPhoneNumber.length && (
    <PhoneNumberModal></PhoneNumberModal>
  )}
    </div>
  );
}

export default App;
