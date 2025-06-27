import React,{useState} from 'react';
import Form from 'react-bootstrap/Form';
import { useSelector,useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { toast } from 'react-toastify';
import {sendSubCategory} from "../../actions/dbActions"


function SubcategoryManage() {
    const [subCategoryName,setSubcategoryName] = useState("");
    const [category,setCategory] = useState("")
    const dispatch = useDispatch();

const getCategories = useSelector((state)=>state.categories.categoriesList);

   const handleSubCatChange = (e) =>{
    setSubcategoryName(e.target.value)
   }

   const handleCatChange =(e)=>{
    setCategory(e.target.value);
   }
   const handleSubmit = (e) =>{
    e.preventDefault();
    if(subCategoryName === ""){
        alert("Please Enter Sub Category Name!");
        return;
    }else if(category === ""){
        alert("Please Select Category Name!");
        return;
    }
    else{
        dispatch(sendSubCategory(subCategoryName,category)).then((data) =>{
            if(data){
                setSubcategoryName("");
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
        <h2> Sub Category </h2>
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col>Sub Category Name:</Col>
                <Col>
                <Form.Control name="subcategoryName" size="sm" type="text" placeholder="Enter Sub category..."  value={subCategoryName}
  onChange={handleSubCatChange}  />
                {/* <Form.Control type="text" name="categoryName" value={categoryName} onChange={handleChange}></Form.Control> */}
                </Col>
            </Row>

            <Row>
                <Col>Category Name:</Col>
                <Col>
                <Form.Select name="categoryName" size="sm" type="text"  value={category}
  onChange={handleCatChange}  >
    <option>Choose Category..</option>
    {getCategories && getCategories.map((cat) =>
    (
        <option value={cat.id}>{cat.name}</option>
    )
    )

    }
    </Form.Select>
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

export default SubcategoryManage