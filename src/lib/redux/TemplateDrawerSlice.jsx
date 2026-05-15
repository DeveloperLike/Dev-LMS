import { createSlice } from '@reduxjs/toolkit';

export const TemplateDrawerSlice = createSlice({
  name: 'drawerState',
  initialState: {value: false},
  reducers: {
    updateDrawer: (state, action) => {
      state = action.payload;
    },
  },
});

export const { updateDrawer } = TemplateDrawerSlice.actions;
export default TemplateDrawerSlice.reducer;
