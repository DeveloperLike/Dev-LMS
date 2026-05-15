// import { createSlice } from "@reduxjs/toolkit";

// export const facebookSlice = createSlice({
//   name: "facebookAccessToken",
//   initialState: {
//     facebookTokenUpdate: "", // initialize the variable
//   },
//   reducers: {
//     facebookTokenUpdate: (state, action) => {
//       state.facebookTokenUpdate = action.payload;  //update the facebookTokenUpdate state
//     },
//   },
// });

// // Action creators are generated for each case reducer function
// export const { facebookTokenUpdate } = facebookSlice.actions;

// export default facebookSlice.reducer; // export the facebookSlice as a reducer





// FacebookToken.js
import { createSlice } from "@reduxjs/toolkit";

const facebookSlice = createSlice({
  name: "facebookAccessToken",
  initialState: {
    facebookTokenUpdate: "", // initial state
  },
  reducers: {
    facebookTokenUpdate: (state, action) => {
      state.facebookTokenUpdate = action.payload; // update state
    },
  },
});

// Action creators
export const { facebookTokenUpdate } = facebookSlice.actions;

// Default export: reducer
export default facebookSlice.reducer;
