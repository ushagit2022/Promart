import React, { useState,useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { sendProducts } from "../../actions/dbActions"
import { toast } from 'react-toastify';
import axios from 'axios';
import Table from 'react-bootstrap/Table';

const initialProduct =  {
    productName: "",
    productDescription: "",
    productStock: 0,
    productPrice: 0,
    productImage: "",
    productCategory: "",
    productSubcategory: ""
}

const ProductsManage = () => {
    const getCategories = useSelector((state) => state.categories.categoriesList);
    const subCategoriesList = useSelector((state) => state.categories.subCategoriesList)
    const dispatch = useDispatch();

    // const [products, setProducts] = useState(
        // {
        //     productName: "",
        //     productDescription: "",
        //     productStock: 0,
        //     productPrice: 0,
        //     productImage: "",
        //     productCategory: "",
        //     productSubcategory: ""
        // }
    // )

    // const handleChange = (e) => {
    //     const { name, value, type, files } = e.target;
    //     setProducts((prev) => ({
    //         ...prev,
    //         [name]: type === "file" ? files[0] : value
    //     }));
    // };

    const validate = () => {
        if (!products.productName) return "Product name is required";
        if (products.productStock < 0) return "Stock cannot be negative";
        if (products.productPrice <= 0) return "Price must be greater than 0";
        if (!products.productCategory) return "Category is required";
        if (!products.productSubcategory) return "Subcategory is required";

        return null;
    };

    // const handleSubmit = (e) => {
        // e.preventDefault();
        // const error = validate();
        // if (error) {
        //     alert(error);
        //     return;
        // }
    //     // Submit your form
    //     dispatch(sendProducts(products)).then((data) => {
    //         setProducts({
    //             productName: "",
    //             productDescription: "",
    //             productStock: 0,
    //             productPrice: 0,
    //             productImage: "",
    //             productCategory: "",
    //             productSubcategory: ""
    //         })
    //         toast.success(`${data.message}`
    //             , {
    //                 position: "bottom-left"
    //             })

    //     })
    // };


    //code from UserMAnagement
    
    
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(initialProduct);
  const [editingId, setEditingId] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/product")
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle form submit (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
        alert(error);
        return;
    }
    if (editingId) {
      // Update product
      await axios.put(`http://127.0.0.1:5000/product/${editingId}`, product);
    } else {
      // Add product
      await axios.post("http://127.0.0.1:5000/product", product);
    }
    // Refresh product list
    const res = await axios.get("http://127.0.0.1:5000/product");
    setProducts(res.data);
    setProduct(initialProduct);
    setEditingId(null);
  };

  // Edit product
  const handleEdit = (u) => {
    setProduct({
        productName: u.name || "",
        productDescription: u.description || "",
        productStock: u.stock || "",
        productPrice: u.price || "",
        productImage: u.image_url || "",
        productCategory: u.category_id || "",
        productSubcategory: u.subcategory_id || "",
      });
    setEditingId(u.id);
  };

  // Delete product
  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:5000/product/${id}`);
    setProducts(products.filter(u => u.id !== id));
    toast.info('User Deleted..!',{
        position: "bottom-left"
    })
  };

    return (
        <div style={{ maxWidth: 1000, margin: "auto" }}>
            <h2>Products Form:</h2>
            <Form onSubmit={handleSubmit}>
                {/* <Form.Group className="mb-3" controlId="formBasicName"> */}
                <Row>
                    <Col className="divTableCell"><Form.Label>Product Name</Form.Label></Col>
                    <Col className="divTableCell"><Form.Control name="productName" size="sm" type="text" placeholder="Enter name" 
                    value={product.productName ||""}
                        onChange={handleChange} /></Col>
                    {/* <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text> */}
                    {/* </Form.Group> */}
                </Row>

                <Row className="mb-3" controlId="formBasicDescription">
                    <Col><Form.Label>Description</Form.Label></Col>
                    <Col> <Form.Control size="sm" type="text" name="productDescription" placeholder="Description" 
                    value={product.productDescription ||""}
                        onChange={handleChange} /></Col>
                </Row>

                <Row className="mb-3" controlId="formBasicPrice">
                    <Col> <Form.Label>Price</Form.Label></Col>
                    <Col><Form.Control size="sm" type="text" name="productPrice" placeholder="Price.." 
                    value={product.productPrice ||""}
                        onChange={handleChange} /></Col>
                </Row>

                <Row className="mb-3" controlId="formBasicStock">
                    <Col><Form.Label>Stock</Form.Label></Col>
                    <Col> <Form.Control size="sm" type="text" placeholder="Stock.." name="productStock" 
                    value={product.productStock ||""}
                        onChange={handleChange} /></Col>
                </Row>

                <Row className="mb-3" controlId="formBasicCategory">
                    <Col><Form.Label>Category </Form.Label></Col>
                    <Col>
                        {/* <Form.Control size="sm" type="text"  name="productCategory" placeholder='Category' value={products.productCategory} onChange={handleChange}></Form.Control> */}
                        <Form.Select defaultValue="Choose..." size="sm" name="productCategory" 
                        value={product.productCategory ||""}
                            onChange={handleChange}>
                            <option value={0}>Select Category</option>
                            {getCategories && getCategories.map((category) => {
                                return (
                                    <>           <option value={category.id}> {category.name}</option>

                                    </>
                                )

                            })}
                        </Form.Select>
                    </Col>
                </Row>
                <Row className="mb-3" controlId="formBasicCategory">
                    <Col><Form.Label>Category </Form.Label></Col>
                    <Col>
                        {/* <Form.Control size="sm" type="text" name="productSubcategory" placeholder='Sub Category' value={products.productSubcategory} onChange={handleChange}></Form.Control> */}
                        <Form.Select defaultValue="Choose..." size="sm" name="productSubcategory" 
                        value={product.productSubcategory ||""}
                            onChange={handleChange}>
                            <option value={0}>Select Sub Category</option>
                            {subCategoriesList && subCategoriesList.
                                filter(
                                    (subCategories) =>
                                        subCategories.category_id === parseInt(product.productCategory))
                                .map((subCat) => (<option value={subCat.id}>&nbsp;&nbsp;{subCat.name}</option>))
                            }
                        </Form.Select>
                    </Col>
                </Row>

                <Row className="mb-3" controlId="formBasicImage">
                    <Col> <Form.Label>Image </Form.Label></Col>
                    <Col> <Form.Control size="sm" accept="image/jpeg, image/jpg, image/png" name="productImage" type="file" placeholder="Image"
                        // value={products.productImage ||""}
                        onChange={handleChange} /></Col>
                </Row>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form><br></br>
            <Table border="1" width="100%">
        <thead>
          <tr>
            <th>productName</th><th>Description</th><th>Stock</th><th>Price</th><th>Image URL</th><th>Category</th><th>Subcategory</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.description}</td>
              <td>{u.stock}</td>
              <td>{u.price}</td>
              <td>{u.image_url}</td>
              <td>{u.category_id}</td>
              <td>{u.subcategory_id}</td>
              <td>
                <Button variant="info" onClick={() => handleEdit(u)}>Edit</Button >&nbsp;&nbsp;
                <Button variant="danger" onClick={() => handleDelete(u.id)}>Delete</Button >
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
        </div>
    )
}

export default ProductsManage
