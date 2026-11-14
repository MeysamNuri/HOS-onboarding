import { configureStore } from '@reduxjs/toolkit';
import userInfoSlice from '../../features/HomePage/reducers/userInfoSlice';
import userPlansSlice from '../../features/HomePage/reducers/userPlansSlice';
import { baseApi } from '../api/baseApi';
import filtersReducer from '@features/Orders/reducers/filterSlice';
import sendLinksfiltersSlice from '@features/SendLink/reducers/filterSlice';
import sidebarReducer from '@/core/api/sideBarSlice';
import { serialReducer, packageReducer, packagFiltersReducer } from '@/core/api/slices'
export const store = configureStore({
  reducer: {

    // auth: loginReducer,
    userInfo: userInfoSlice,
    insertedSerial: serialReducer,
    insertedSelectedPackage: packageReducer,
    userPlans: userPlansSlice,
    filters: filtersReducer,
    sendLinksfilters: sendLinksfiltersSlice,
    packageFilters: packagFiltersReducer,
    sidebar: sidebarReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
