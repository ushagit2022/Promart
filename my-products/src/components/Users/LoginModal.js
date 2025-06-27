import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import Modal from 'react-bootstrap/Modal';
import Login from "./Login";
import { useDispatch } from "react-redux";
import { loginUser } from "../../actions/dbActions";

const LoginModal = ({ show, onClose, onLogin }) => {
  if (!show) return null;

  return (
    // <div className="modal show" style={{ display: "block" }} tabIndex="-1">
    //   <div className="modal-dialog">
    //     <div className="modal-content">
    //       <form onSubmit={handleSubmit}>
    //         <div className="modal-header">
    //           <h5 className="modal-title">Login</h5>
    //           <button type="button" className="btn-close" onClick={onClose}></button>
    //         </div>
    //         <div className="modal-body">
    //           <div className="mb-3">
    //             <label className="form-label">Mobile Number:</label>
    //             <input
    //               type="tel"
    //               className="form-control"
    //               value={mobile}
    //               required
    //               maxLength={10}
    //               pattern="[6-9]{1}[0-9]{9}"
    //               onChange={e => setMobile(e.target.value.replace(/\D/, ""))}
    //               placeholder="Enter 10-digit mobile"
    //             />
    //           </div>
    //           <div className="form-check mb-3">
    //             <input
    //               type="checkbox"
    //               className="form-check-input"
    //               checked={isAdmin}
    //               onChange={e => setIsAdmin(e.target.checked)}
    //               id="adminCheck"
    //             />
    //             <label className="form-check-label" htmlFor="adminCheck">
    //               Admin
    //             </label>
    //           </div>
    //           {error && <div className="text-danger">{error}</div>}
    //         </div>
    //         <div className="modal-footer">
    //           <button type="submit" className="btn btn-primary">Login</button>
    //           <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    //   <div className="modal-backdrop show"></div>
    // </div>
    <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Login</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Login onLogin={onLogin} />
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
  );
};

export default LoginModal;