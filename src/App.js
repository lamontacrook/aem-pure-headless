import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import PropTypes from 'prop-types';
import Screen from './components/screen';
import Settings, { expiry } from './utils/settings';
import { ErrorBoundary } from 'react-error-boundary';

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
  const [status, setStatus] = useState(1);

  useEffect(() => {
    // let url = localStorage.getItem('serviceURL').replace('author', 'publish');
    // fetch(url).then((response) => {
    //   console.info(response);
    //   setStatus(1);
    // }).catch((error) => {
    //   console.error(error);
    //   setStatus(1);
    // });
    setStatus(1);
  });



  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route exact={false} path={'  /aem-pure-headless'} element={
            status && localStorage.getItem('loggedin') && expiry() ?
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

          <Route exact={false} path={'/'} element={
            status && localStorage.getItem('loggedin') && expiry() ?
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

          <Route exact={true} path={'/aem-pure-headless'} element={
            status && localStorage.getItem('loggedin') && expiry() ?
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

          <Route exact={true} path={'/aem-pure-headless/:folder/:screen'} element={
            status && localStorage.getItem('loggedin') && expiry() ?
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

          <Route exact={true} path={'/:folder/:screen'} element={
            status && localStorage.getItem('loggedin') && expiry() ?
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

          <Route exact={true} path={'/settings'} element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

{/* <Switch>
        <Route exact={true} path={"/:screen"}>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}>
            <Screen />
          </ErrorBoundary>
        </Route>
        <Route exact={true} path={"/:folder/:screen"}>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}>
            <Screen />
          </ErrorBoundary>
        </Route>
        <Route exact={true} path={"/:parent/:folder/:screen"}>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}>
            <Screen />
          </ErrorBoundary>
        </Route>
        <Route path="/">
          <ErrorBoundary
            FallbackComponent={ErrorFallback}>
            <Screen />
          </ErrorBoundary>
        </Route>
      </Switch> */}
