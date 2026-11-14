
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from "@reduxjs/toolkit";
import { packageFilterInitial, type IServicePacketOBG, type PackageFilterState } from '../types/models';

const initialState = {
  inserteSerial: "",


};

const serialSlice = createSlice({
  name: 'serial',
  initialState,
  reducers: {
    setInseretedSerial: (state, action: PayloadAction<string>) => {
      state.inserteSerial = action.payload;
    }
  },
});

const initialPackageState: IServicePacketOBG | null = null;

const packageSlice = createSlice({
  name: "package",
  initialState: initialPackageState as IServicePacketOBG | null,
  reducers: {
    setSelectedPackage: (
      _,
      action: PayloadAction<IServicePacketOBG>
    ) => {
      return action.payload;
    },

    clearSelectedPackage: () => {
      return null;
    },
  },
});



const packageFilters = createSlice({
  name: "Packagefilters",
  initialState: packageFilterInitial,
  reducers: {
    setPackageFilters: (
      state,
      action: PayloadAction<Partial<PackageFilterState>>
    ) => {
      Object.assign(state, action.payload);
    },
    clearPackageFilter: (state, action) => {
      const key = action.payload;

      if (key in state) {
        state[key as keyof typeof state] = "";
      }
    },
    resetFilters: () => packageFilterInitial,
  },
});
export const {
  setPackageFilters,
  resetFilters,
  clearPackageFilter
} = packageFilters.actions;


export const {
  setSelectedPackage,
  clearSelectedPackage,
} = packageSlice.actions;


export const {
  setInseretedSerial,

} = serialSlice.actions;

export const serialReducer = serialSlice.reducer;
export const packageReducer = packageSlice.reducer;
export const packagFiltersReducer = packageFilters.reducer;