import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import PropTypes from 'prop-types';
import Screen from './components/screen';
import Settings, { expiry } from './utils/settings';
import { ErrorBoundary } from 'react-error-boundary';
import Screendetails from './components/screendetails';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};


ErrorFallback.propTypes = {
  error: PropTypes.object,
  resetErrorBoundary: PropTypes.object
};

const App = () => {


  useEffect(() => {

  }, []);



  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route exact={false} path={'/*'} element={localStorage.getItem('loggedin') && expiry() ?
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => {
                // reset the state of your app so the error doesn't happen again
              }}
            ><Screen /></ErrorBoundary> :
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => {
                // reset the state of your app so the error doesn't happen again
              }}
            ><Settings /></ErrorBoundary>
          } />

          <Route exact={true} path={'/aem-pure-headless/*'} element={localStorage.getItem('loggedin') && expiry() ?
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => {
                localStorage.removeItem('loggedin');
                location.href = '/settings';
              }}
            ><Screen /></ErrorBoundary> :
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => {
                // reset the state of your app so the error doesn't happen again
              }}
            ><Settings /></ErrorBoundary>
          } />
          <Route exact={true} path={`/${localStorage.getItem('demo-assets')}/*`} element={localStorage.getItem('loggedin') && expiry() ?
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => {
                localStorage.removeItem('loggedin');
                location.href = '/settings';
              }}
            ><Screendetails /></ErrorBoundary> :
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => {
                // reset the state of your app so the error doesn't happen again
              }}
            ><Settings /></ErrorBoundary> 
          } />
          
          <Route exact={true} path={'/settings'} element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

