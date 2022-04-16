import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './style.css';

import MainPage from './Navbar'


import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <MainPage
    backendUrl="http://localhost:5000"
    />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();