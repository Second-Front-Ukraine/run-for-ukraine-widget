import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


const widgetDivs = document.querySelectorAll('.run-registration-widget') as NodeListOf<HTMLElement>;

widgetDivs.forEach(div => {
  ReactDOM.createRoot(div).render(
    <React.StrictMode>
      <App campaign={div.dataset.campaign || ''} />
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
