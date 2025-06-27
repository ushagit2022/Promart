import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginUser } from "../../actions/dbActions";
import Form from 'react-bootstrap/Form';
import { toast } from "react-toastify";


const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const validateEmail = (email) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateMobile = (mobile) => {
    // Simple validation for 10 digit Indian mobile numbers
    return /^[6-9]\d{9}$/.test(mobile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validateMobile(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    dispatch(loginUser(email,isAdmin,mobile)).then((data) =>{
            onLogin(data);
            setMobile("");
            setIsAdmin(false);
            setError("");
             toast.info(`${data.message}`,{
                                position:"bottom-left"
                             }
                            )
                            localStorage.setItem("UserId",data.user_id);
                            localStorage.setItem("Mobile",data.mobile);
                            localStorage.setItem("Email",data.email)            
            // onClose();
        }).catch ((err)=> {
          setError("Login failed. Please try again.");
        })
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 350, margin: "auto" }}>
      {/* <h2>Login</h2> */}
      <div>
        <label>Mobile Number:</label>
        <Form.Control
          type="tel"
          value={mobile}
          required
          maxLength={10}
          pattern="[6-9]{1}[0-9]{9}"
          onChange={e => setMobile(e.target.value.replace(/\D/, ""))}
          placeholder="Enter 10-digit mobile"
        />
      </div>
      <div>
        <label>Email:</label>
        <Form.Control
          type="email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>
          <Form.Check
            type="checkbox"
            checked={isAdmin}
            onChange={e => setIsAdmin(e.target.checked)}
            label="Admin"
          />
        
        </label>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;