
import { createSlice } from "@reduxjs/toolkit";

export const loginOtpDataSlice = createSlice({
  name: "nameloginOtpData",
  initialState: {
    loginOtpData: {}
  },
  reducers: {
    loginOtpData : (state, action)=>{
      state.loginOtpData = action.payload
    }
  },
});

export const { loginOtpData} = loginOtpDataSlice.actions;

export default loginOtpDataSlice.reducer;