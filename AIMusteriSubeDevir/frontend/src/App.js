// Main Application Component
// Ana uygulama bileşeni
// Root component with MUI Theme, Redux Provider, and Toast

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import store from './store/store';
import theme from './theme/theme';
import { ToastProvider } from './components/common/Toast';
import LoginForm from './components/LoginForm';
import './App.css';

/**
 * App Component
 * Redux, MUI Theme, ve Toast provider'ları ile sarılmış ana bileşen
 * Main component wrapped with Redux, MUI Theme, and Toast providers
 */
function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <CssBaseline />
          <div className="App">
            <LoginForm />
          </div>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

