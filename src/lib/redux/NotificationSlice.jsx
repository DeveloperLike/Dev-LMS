import { createSlice } from '@reduxjs/toolkit';

export const notificationSlice = createSlice({
  name: 'toastName',
  initialState: {
    message: '',
    description: '',
    messageType: 'success',
    showProgress: 'true',
  },
  reducers: {
    notificationFun: (state, action) => {
      state.message = action.payload.message;
      state.description = action.payload.description;
      state.messageType = action.payload.messageType;
    },
  },
});

export const { notificationFun } = notificationSlice.actions;

export default notificationSlice.reducer;
