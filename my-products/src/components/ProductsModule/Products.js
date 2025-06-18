import React, { useState } from 'react';
import { addCartItem } from '../../store/cartReducer';
import { useSelector, useDispatch } from 'react-redux';


const Product = ({ product }) => {

    const { id, image_url, name, price, description, stock } = product;
    const [productCount, setProductCount] = useState([]);
    let quantities = useSelector((state) => state.products.quantities);
    const dispatch = useDispatch();


    const handleIncrement = (productId) => {
        setProductCount(prevVal => ({
            ...prevVal,
            [productId]: (prevVal[productId] || 0) + 1
        })
        );
    }

    const handleDecrement = (productId) => {
        setProductCount(prev => ({
            ...prev,
            [productId]: Math.max((prev[productId] || 0) - 1, 0)
        }));
    }

    const handleAddCart = (event) => {
        dispatch(addCartItem(product));
    }
    return (
    //     <div key={id} classname="product">
    //     <h3>{name}</h3>
    //     <img src={image_url} alt={name}  />
     
    //     <div className='details'>
    //         <span>{description}</span>
    //     <span>Price: ₹{price}</span>
    //     <span >Stock: {stock}</span>
    //     <span >Quantities:{quantities.map((quantity) => (quantity)) || 0}{" "}   &nbsp;&nbsp;&nbsp;&nbsp;
    //     </span>
    //     </div>
    //     <button type="submit" className='btnClass' onClick={() => handleAddCart(product)
    //            }>
    //             Add</button>
        
        
    // </div>
        <div key={id} style={{ border: '1px solid #ddd', padding: 16, width: 220, borderRadius: "8px" }}>
            <img src={image_url} alt={name} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
            <h3>{name}</h3>
            <p>{description}</p>
            <div>Price: ₹{price}</div>
            <div style={{ display: "flex", jystifyContent: "space-between", alignItems: "center" }}>Stock: {stock}</div>
            <div >{quantities.map((quantity) => (quantity)) || 0}{" "}   &nbsp;&nbsp;&nbsp;&nbsp;
                  <span><button type="submit" className='btnClass' onClick={() => handleAddCart(product)
                   }>
                    Add</button></span>
            </div>
        </div>

        
    );
};

export default Product;