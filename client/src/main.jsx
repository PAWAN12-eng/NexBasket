import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './Store/Store'; 
import { RouterProvider } from 'react-router-dom';
import routerpage from './route/Index';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={routerpage} />
  </Provider>
);
