import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { SavedDishesProvider } from './components/SavedDishesContext';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SavedDishesProvider>
      <App />
    </SavedDishesProvider>
  </React.StrictMode>
);
