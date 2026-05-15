import { createSlice } from "@reduxjs/toolkit";

const facebookEmailSlice = createSlice({
  name: "facebookEmail",
  initialState: {
    currentfacebookEmail: "",
  },
  reducers: {
    updateFacebookEmail: (state, action) => {
      state.currentfacebookEmail = action.payload;
    },
  },
});

export const { updateFacebookEmail } = facebookEmailSlice.actions;
export default facebookEmailSlice.reducer;