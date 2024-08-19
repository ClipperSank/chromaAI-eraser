import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AppV2 from './App_v2';
import KonvaShapeSwapper from './App_v1';
import reportWebVitals from './reportWebVitals';
import KonvaShapeSwapperV2 from './App_v3'
import KonvaShapeSwapperV3 from './App_v4';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <KonvaShapeSwapper/> */}
    <KonvaShapeSwapperV2/>
    {/* <KonvaShapeSwapperV3/> */}
    {/* <App /> */}
    {/* <AppV2/> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
