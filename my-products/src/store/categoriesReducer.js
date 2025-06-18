import {createSlice} from '@reduxjs/toolkit';

const initialState = {
categoriesList:[],
}

export const categories = createSlice({
    name:"categories",
    initialState,
    reducers:({
        setCategoriesList : (state,action) =>{
            state.categoriesList =  action.payload ;
        }
    })
 
})

export const {
    setCategoriesList
}= categories.actions;

export default categories.reducer;