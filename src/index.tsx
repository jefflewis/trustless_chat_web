import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import "./index.css";
import mediaClient from './mediaClient';

mediaClient.init()

export const themeOptions = createTheme({
  palette: {
    mode: 'dark',
    action: {
      disabledBackground: '#808080',
      disabled: '#ffffff'
    },
    primary: {
      main: '#ffa31a',
    },
    secondary: {
      main: '#808080',
    },
    background: {
      default: '#1b1b1b',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={themeOptions}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
