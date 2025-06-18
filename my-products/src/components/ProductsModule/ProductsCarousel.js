
import React,{useState} from "react";
import Carousel from 'react-bootstrap/Carousel';
import home1 from "../../images/fr6.jpg"
import home2 from "../../images/backery2.jpg"
import home3 from "../../images/snack7.jpg"
import home4 from "../../images/HH3.jpg"
import home5 from "../../images/staples3.jpg"

function ProductsCaeousel() {

  const handleOrders=()=>{
    console.log("orders")
  }
 
  return (
    <div className="myCarousel">
       <div className="carouselDiv">
      <span className="textCarousel">Super Saver Offers</span>
      <div className="OrderBtndiv">
        <button type="submit" aria-label="Order" title="order" className='btnOrder'>Order Now</button>
        {/* <button aria-label="Order" title="order" type="submit" onClick={handleOrders} className="OrderBtn">Order Now</button> */}
        </div>
      </div>
      <div>
    <Carousel >
    <Carousel.Item interval={2000} >
    <img src={home1}  alt="some image" style={{ width: '100%', height: '400px',objectFit: 'contain', // or 'cover'
    display: 'block' }} ></img>
    </Carousel.Item>
    <Carousel.Item interval={2000}>
    <img src={home2}  alt="some image" style={{ width: '100%', height: '400px',objectFit: 'contain', // or 'cover'
    display: 'block' }} ></img>
    {/* className="carouselImg" */}
    </Carousel.Item>
    <Carousel.Item interval={2000} >
    <img src={home3}  alt="some image" style={{ width: '100%', height: '400px',objectFit: 'contain', // or 'cover'
    display: 'block' }} ></img>
    </Carousel.Item>
    <Carousel.Item interval={2000}>
    <img src={home4}  alt="some image" style={{ width: '100%', height: '400px' ,objectFit: 'contain', // or 'cover'
    display: 'block'}} ></img>
    {/* className="carouselImg" */}
    </Carousel.Item>
    <Carousel.Item interval={2000}>
    <img src={home5}  alt="some image" style={{ width: '100%', height: '400px' ,objectFit: 'contain', // or 'cover'
    display: 'block'}} ></img>
    {/* className="carouselImg" */}
    </Carousel.Item>
    </Carousel>
    </div>
    </div>
  );
}

export default ProductsCaeousel;