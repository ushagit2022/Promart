import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from 'react-bootstrap/Table';


const initialUser = {
  name: "",
  email: "",
  mobile: "",
  location: "",
  pincode: "",
  address: "",
  is_admin: false,
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(initialUser);
  const [editingId, setEditingId] = useState(null);

  // Fetch users from backend
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/users")
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle form submit (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // Update user
      await axios.put(`http://127.0.0.1:5000/api/users/${editingId}`, user);
    } else {
      // Add user
      await axios.post("http://127.0.0.1:5000/api/users", user);
    }
    // Refresh user list
    const res = await axios.get("http://127.0.0.1:5000/api/users");
    setUsers(res.data);
    setUser(initialUser);
    setEditingId(null);
  };

  // Edit user
  const handleEdit = (u) => {
    setUser({
        name: u.name || "",
        email: u.email || "",
        mobile: u.mobile || "",
        location: u.location || "",
        pincode: u.pincode || "",
        address: u.address || "",
        is_admin: !!u.is_admin,
      });
    setEditingId(u.id);
  };

  // Delete user
  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:5000/api/users/${id}`);
    setUsers(users.filter(u => u.id !== id));
    toast.info('User Deleted..!',{
        position: "bottom-left"
    })
  };

  return (
    <div style={{ maxWidth: 750, margin: "auto" }}>
      <h2>User Management</h2>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Row>
            <Col><Form.Label>Name </Form.Label> </Col>
        <Col><Form.Control
          type="text"
          name="name"
          placeholder="Name"
          value={user.name || ""}
          onChange={handleChange}
          required
        />
        </Col>
        </Row>{" "}
        <Row>
            <Col><Form.Label>Email </Form.Label> </Col>
        <Col>
        <Form.Control
          type="email"
          name="email"
          placeholder="Email"
          value={user.email || ""}
          onChange={handleChange}
          required
        /></Col>
</Row>        {" "}
<Row>
            <Col><Form.Label>Mobile </Form.Label> </Col>
        <Col><Form.Control
          type="tel"
          name="mobile"
          placeholder="Mobile"
          value={user.mobile || ""}
          onChange={handleChange}
          pattern="[0-9]{10}"
          required
        /> </Col></Row>{" "}
        <Row>
            <Col><Form.Label>Location </Form.Label> </Col>
        <Col><Form.Control
          type="text"
          name="location"
          placeholder="Location"
          value={user.location}
          onChange={handleChange}
        /></Col></Row>{" "}
        <Row>
            <Col><Form.Label>Pincode </Form.Label> </Col>
        <Col><Form.Control
          type="text"
          name="pincode"
          placeholder="Pin Code"
          value={user.pincode || ""}
          onChange={handleChange}
          pattern="[0-9]{6}"
          required
        /></Col></Row>{" "}
        <Row>
            <Col><Form.Label>Address </Form.Label> </Col>
        <Col><Form.Control
          type="text"
          name="address"
          placeholder="Address"
          value={user.address}
          onChange={handleChange}
        /></Col></Row>{" "}
        <Row>
            <Col >
          <Form.Check
             name="is_admin"
             checked={!!user.is_admin}
             onChange={handleChange}
           type="checkbox"
            label={`Admin`}
            // id={`disabled-default-${type}`}
          /></Col>
          <Col>
          <Button variant="success" type="submit">{editingId ? "Update" : "Add"} User</Button >{""}
        {editingId && (
          <Button type="button" onClick={() => { setUser(initialUser); setEditingId(null); }}>
            Cancel
          </Button >
        )}</Col>
          </Row>
        {" "}
        
      </Form><br></br>
      <Table border="1" width="100%">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Mobile</th><th>Location</th><th>Pincode</th><th>Admin</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.mobile}</td>
              <td>{u.location}</td>
              <td>{u.pincode}</td>
              <td>{u.is_admin ? "Yes" : "No"}</td>
              <td>
                <Button variant="info" onClick={() => handleEdit(u)}>Edit</Button >&nbsp;&nbsp;
                <Button variant="danger" onClick={() => handleDelete(u.id)}>Delete</Button >
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserManagement;