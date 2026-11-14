// features/filters/filtersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
        serial: "",
        reportType: "",
        search:"",
        status: "",
        sendDateFrom: "",
        sendDateTo: "",
    
};

const sendLinksfiltersSlice = createSlice({
  name: 'sentLinksfilters',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      // Merge payload into existing state (Immer allows direct mutation)
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
    resetFilters,
    clearFilter,
} = sendLinksfiltersSlice.actions;

export default sendLinksfiltersSlice.reducer;
