import {createSlice} from '@reduxjs/toolkit';

const initialState = {
categoriesList:[],
subCategoriesList:[]
}

export const categories = createSlice({
    name:"categories",
    initialState,
    reducers:({
        setCategoriesList : (state,action) =>{
            state.categoriesList =  action.payload ;
        },
        setSubCategoriesList: (state,action) =>{
            state.subCategoriesList =  action.payload ;
        }
    })
 
})

export const {
    setCategoriesList,
    setSubCategoriesList
}= categories.actions;

export default categories.reducer;