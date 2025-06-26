import { configureStore } from '@reduxjs/toolkit';
import favouritesReducer from '../features/favourites/favouritesSlice';
import { coopleApi } from './api/coopleApi';
import { jobsApi } from '../features/jobs/api';

export const store = configureStore({
  reducer: {
    favourites: favouritesReducer,
    [coopleApi.reducerPath]: coopleApi.reducer,
    [jobsApi.reducerPath]: jobsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(coopleApi.middleware)
      .concat(jobsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 