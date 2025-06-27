// import React, {useState} from "react";
import React, { useState, useEffect } from "react";
import '../Styles/NavBar.css';
import { FaUser, FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
// import Authentication from "./Users/Authentication";
import Login from "./Users/Login";
import ProductLogo from "../images/logo3.png";
import GeoLocation from '../components/GeoLocation';
import Badge from '@mui/joy/Badge';
import Typography from '@mui/joy/Typography';
import { colors } from "@mui/material";
import MailIcon from '@mui/icons-material/Mail';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector } from "react-redux";
import Button from "react-bootstrap/esm/Button";
import LoginModal from "./Users/LoginModal";

function NavBar({viewCart}) {
    const [user, setUser] = useState("");
    const [loginModal,setLoginModal] = useState(false);
   const cartItems= useSelector((state)=>state.cart.cartItems)
   const cartQuantity = useSelector((state)=>state.cart.cartTotalQantity);

//    const getTotalQuantity = () => {
//     let total = 0
//     cart.forEach(item => {
//       total += item.quantity
//     })
//     return total
//   }

    const handleLoginClick = (userData) => {
        // Simulate login logic
        // setUser(userData);
          setLoginModal(true)
        // Redirect to another page after login
        //   window.location.href = "/dashboard"; // Change "/dashboard" to your desired page
    };
    const handleLogin = (userData) =>{
        setUser(userData);
        setLoginModal(false)
    }

    return (
        <header className="navbar">
            <div className="logo"><img src={ProductLogo} alt="Logo" style={{ width: "80px", height: "80px" }}></img></div>
            <div className="search-bar">
                <input type="text" placeholder="Search..." />
            </div>
            <nav className="links">
                <a ><FaMapMarkerAlt /></a>
                <a><GeoLocation></GeoLocation></a>
                {loginModal && (
                    // <Login onLogin={handleLogin} />
                    <LoginModal show={loginModal} onClose={()=>setLoginModal(false)} onLogin={handleLogin}> </LoginModal>
                )}
                {!user  ? (
        
        <Button size="sm" variant="primary" onClick ={handleLoginClick}>Login</Button>
      ) : (
     <>          <h6>Welcome, {user.name || user.mobile || localStorage.getItem("Mobile") || "User"}</h6>
          {/* Render dashboard or other components here */}
          </>
      )}
                {/* <Authentication></Authentication> */}
                {/* <a href="/cart" style={{ border: "1px black" }}> */}
                    <Badge badgeContent=
                    {cartItems.length || 0}
                    // {cartQuantity || 0} 
                    variant="solid">
                        {/* <Typography sx={{ fontSize: 'xl' }} > */}
                        <ShoppingCartIcon onClick={viewCart}/>
                        {/* </Typography> */}
                        {/*</a> */}
                    </Badge>
                {/* </a> */}
            </nav>
        </header>
    );
}

export default NavBar;