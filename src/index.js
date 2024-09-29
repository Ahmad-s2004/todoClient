import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CategoryContext } from './context/Category';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CategoryContext>
    <App />
    </CategoryContext>
  </React.StrictMode>
);
