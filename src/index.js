import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { SavedDishesProvider } from './components/SavedDishesContext';
import './styles/index.css';

ReactDOM.render(
  <React.StrictMode>
    <SavedDishesProvider>
      <App />
    </SavedDishesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);