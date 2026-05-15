import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: ""
};

const leadFilterSlice = createSlice({
  name: "leadFilter",
  initialState,
  reducers: {
    setLeadFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    resetLeadFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const { setLeadFilters, resetLeadFilters } = leadFilterSlice.actions;
export default leadFilterSlice.reducer;
