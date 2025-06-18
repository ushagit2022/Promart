import React, { useEffect, useState } from 'react';
import { MdMenu } from "react-icons/md";
import '../Styles/AllCategories.css';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { getCategories } from '../actions/dbActions';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';

function AllCategories(props) {
    const [categoryModal, setCategoryModal] = useState(false);
    const dispatch = useDispatch();

    // Get categories from Redux store
    const categoriesList = useSelector((state) => state.categories.categoriesList);
    const productList = useSelector((state)=> state.products.productsList);
      
    //   const product_category = categoriesList.filter((category)=> productList.includes(category.id)).map((pro) => pro.name)

    // Fetch categories on mount
    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    const handleCategories = () => {
        setCategoryModal(true);
    };

    const handleClose = () => setCategoryModal(false);

    const handleProduct = (pro) => {
        setCategoryModal(false);
        props.handleDisplayProduct(pro);
    }

    return (
        <>
            <div className="all-categories">
                <MdMenu />
                <span onClick={handleCategories}>All Categories</span>
            </div>
            <Offcanvas show={categoryModal} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Products Mart</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <h4>Categories</h4>
                    <ul style={{ paddingLeft: 0 }}>
                        {categoriesList && categoriesList.map(category => (<>
                            <li style={{ listStyle: "none" }} key={category.id}>{category.name}</li>
                            <ul>
                            {productList && productList.map((product) =>{
                                if(product.category_id === category.id){
                                   return (<li key={product.id} style={{ listStyle: "none" }} onClick={()=>handleProduct(product)}>{product.name}</li>)
                                }
                            })}
                            </ul>
                            </>
                        ))}
                    </ul>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );

    //  return (
    //     <>        <div className="all-categories">
    //                 <MdMenu />
    //             <span onClick={handleCategories}>All Categories</span>
    //             </div>
    //   <Modal
    //   show={categoryModal}
    //     size="lg"
    //     aria-labelledby="contained-modal-title-vcenter"
    //     centered
    //   >
    //     <Modal.Header >
    //       <Modal.Title id="contained-modal-title-vcenter">
    //        Products Categories
    //       </Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>
    //     <h4>Categories</h4>
    //                 <ul style={{ paddingLeft: 0 }}>
    //                     {categoriesList && categoriesList.map(category => (<>
    //                         <li style={{ listStyle: "none" }} key={category.id}>{category.name}</li>
    //                         <ul>
    //                         {productList && productList.map((product) =>{
    //                             if(product.category_id === category.id){
    //                                return <li key={product.id}>{product.name}</li>
    //                             }
    //                         })}
    //                         </ul>
    //                         </>
    //                     ))}
    //                 </ul>
    //     </Modal.Body>
    //     <Modal.Footer>
    //       <Button onClick={() => setCategoryModal(false)}>Close</Button>
    //     </Modal.Footer>
    //   </Modal>
    //   </>

    // );
}

export default AllCategories;