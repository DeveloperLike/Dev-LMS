import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  permissionsData: {
  }
};

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    permissionsData: (state, action) => {
      state.permissionsData = {
        ...state.permissionsData,
        ...action.payload,
      };
    },
  },
});

export const { permissionsData } = permissionsSlice.actions;
export default permissionsSlice.reducer;

