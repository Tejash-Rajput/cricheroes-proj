import { configureStore } from '@reduxjs/toolkit';
import { cricApi } from '../api/cricApi';

export const store = configureStore({
  reducer: {
    [cricApi.reducerPath]: cricApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(cricApi.middleware),
});
