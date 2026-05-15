import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  branchDataRedux:[]
};

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    branchDataRedux: (state, action) => {
      state.branchDataRedux = action.payload; 
    },
  },
});

export const { branchDataRedux } = branchSlice.actions;
export default branchSlice.reducer;

