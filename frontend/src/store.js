// // store.js
// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import { authApi } from './services/auth';
// import { cityApi } from './services/cityApi'; // ✅ Import cityApi
// import themeReducer from './features/themeSlice';
// import userReducer from './features/userSlice';
// import { propertyApi } from './services/propertyApi';
// import { messageApi } from './services/messageApi';
// import socketReducer from './features/socketSlice';
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // defaults to localStorage

// // ✅ Combine reducers
// const rootReducer = combineReducers({
//   [authApi.reducerPath]: authApi.reducer,
//   [cityApi.reducerPath]: cityApi.reducer, 
//   [propertyApi.reducerPath]:propertyApi.reducer,// ✅ Add cityApi reducer
//   theme: themeReducer,
//   user: userReducer,
// });

// // ✅ Persist config (persist only `user`)
// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['user'], // persist only user
// };

// // ✅ Wrap rootReducer with persistReducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // ✅ Configure store
// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }).concat(authApi.middleware, cityApi.middleware ,propertyApi.middleware), // ✅ Add cityApi middleware
// });
 
// // ✅ Persistor
// export const persistor = persistStore(store);

// export default store;

// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { authApi } from './services/auth';
import { cityApi } from './services/cityApi';
import { propertyApi } from './services/propertyApi';
import { messageApi } from './services/messageApi'; // ✅ Add this
import themeReducer from './features/themeSlice';
import userReducer from './features/userSlice';
import socketReducer from './features/socketSlice'; // ✅ Add this

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// ✅ Combine reducers
const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [cityApi.reducerPath]: cityApi.reducer,
  [propertyApi.reducerPath]: propertyApi.reducer,
  [messageApi.reducerPath]: messageApi.reducer, // ✅ Add messageApi
  theme: themeReducer,
  user: userReducer,
  socket: socketReducer, // ✅ Add socket slice
});

// ✅ Persist config (persist only `user`)
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // Only user slice persisted
};

// ✅ Wrap with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      cityApi.middleware,
      propertyApi.middleware,
      messageApi.middleware // ✅ Add messageApi middleware
    ),
});

export const persistor = persistStore(store);
export default store;
