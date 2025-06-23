import React, { useState, useEffect } from 'react';
import '../Styles/CategoryNav.css';
import AllCategories from './AllCategories';
import Divider from '@mui/material/Divider';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../actions/dbActions';

function CategoryNav(props) {
  const categoriesList = useSelector((state) => state.categories.categoriesList);

  

  return (
    <div className="category-nav">
      <ul>
        <li key="0">
        <AllCategories handleDisplayProduct={props.handleDisplayProduct}></AllCategories>
        </li>
        {categoriesList && categoriesList.map((cat) => {
          return (
              <li key={cat.id}> {cat.name}
              </li>
          )
        })}
      </ul>
    </div>
  );
}

export default CategoryNav;