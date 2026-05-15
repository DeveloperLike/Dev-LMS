// import { createSlice } from '@reduxjs/toolkit'
// import test from 'node:test'


//   export const permissionDataSlice = createSlice({
//     name: 'permissiondata',
//     initialState :{
//       test:'yhhghh'
//      },
//     reducers: {
//      permissionData: (state) =>{

      
//       // state.map((items)=>{
//         //   console.log(items.code);
//         // });
//      }

//     },
//   })
  

//   export const {permissionData} = permissionDataSlice.actions
  
//   export default permissionDataSlice.reducer

import { createSlice } from "@reduxjs/toolkit";

export const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    progress: {},
  },
  reducers: {
    updateLoadingState: (state, action) => {
      state.progress = action.payload;    
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateLoadingState } = loaderSlice.actions;

export default loaderSlice.reducer;