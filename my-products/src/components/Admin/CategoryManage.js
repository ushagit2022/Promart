import React,{useState} from 'react';

import { useSelector,useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { toast } from 'react-toastify';
import {sendCategory} from "../../actions/dbActions"


function CategoryManage() {
    const [categoryName,setCategoryName] = useState("");
    const dispatch = useDispatch();

   const handleChange = (e) =>{
     setCategoryName(e.target.value)
   }

   const handleSubmit = (e) =>{
    e.preventDefault();
    if(categoryName === ""){
        alert("Please Enter Category Name!");
        return;
    }else{
        dispatch(sendCategory(categoryName)).then((data) =>{
            if(data){
                setCategoryName("");
                toast.success(`${data.message}`,{
                    position:"bottom-left"
                 }
                )
            }
        })
    }

   }

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
        <h2> Category </h2>
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col>Category Name:</Col>
                <Col>
                <Form.Control name="categoryName" size="sm" type="text" placeholder="Enter name"  value={categoryName}
  onChange={handleChange}  />
                {/* <Form.Control type="text" name="categoryName" value={categoryName} onChange={handleChange}></Form.Control> */}
                </Col>
            </Row>
            <Button variant="primary" type="submit">
        Submit
      </Button>
        </Form>
    </div>
  )
}

export default CategoryManage