// features/filters/filtersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
        serial: "",
        serviceTypes: "",
        serviceStatus: "",
        fromDate: "",
        toDate: "",
    
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      Object.assign(state, action.payload);
    },
     clearFilter: (state, action) => {
      const key = action.payload;

      if (key in state) {
        state[key as keyof typeof state] = "";
      }
    },
    resetFilters: () => initialState,
  },
});

export const {
    setFilters,
    clearFilter,
    resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;