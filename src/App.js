import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Screen from './components/screen';
import Preview from './components/preview';
import Settings from './utils/settings';
import { ErrorBoundary } from 'react-error-boundary';
import Screendetails from './components/screendetails';
import Error from './components/error';
import { useErrorHandler } from 'react-error-boundary';
import { ThreeDots } from 'react-loader-spinner';
import { AppContext } from './utils/context';
import { Helmet } from 'react-helmet';

const App = () => {
  const context = useContext(AppContext);
  const [wait, setWait] = useState(true);
  const handleError = useErrorHandler();
  const aemUrl = context.serviceURL.replace(/\/$/, '');
  useEffect(() => {

    const configured = (context.serviceURL !== context.defaultServiceURL);
    const hasAuth = context.auth !== '';

    if (!configured && !hasAuth) {
      fetch(context.accessToken)
        .then(response => ({
          res: response.text().then(token => {
            if (token) {
              sessionStorage.setItem('auth', token);
              sessionStorage.setItem('loggedin', true);
              context.auth = token;
              setWait(false);
            }
          }).catch(error => {
            error.message = `Error fetching token:\n ${error.message}`;
            handleError(error);
          })
        }));
    } else
      setWait(false);

  }, [context, handleError]);

  if (wait) {
    return (<ThreeDots
      height='120'
      width='120'
      radius='9'
      color='rgba(41,41,41)'
      ariaLabel='three-dots-loading'
      wrapperStyle={{}}
      wrapperClassName='.loading'
      visible={true}
    />);
  } else {
    return (
      <div className='App'>
        <Helmet>
          <meta name='urn:auecon:aemconnection' content={`aem:${aemUrl}`} />
        </Helmet>
        <BrowserRouter>
          <Routes>
            <Route exact={true} path={'/preview/*'} element={
              <ErrorBoundary
                FallbackComponent={Error}
                onReset={() => {
                  sessionStorage.removeItem('loggedin');
                  sessionStorage.removeItem('auth');
                }}
              ><Preview /></ErrorBoundary>
            } />

            <Route exact={true} path={'/settings'} element={
              <ErrorBoundary
                FallbackComponent={Error}
                onReset={() => {
                  sessionStorage.removeItem('loggedin');
                  sessionStorage.removeItem('auth');
                }}
              >
                <Settings /> </ErrorBoundary>} />
            <Route exact={false} path={'/*'} element={

              <ErrorBoundary
                FallbackComponent={Error}
                onReset={() => {
                  sessionStorage.clear();
                  localStorage.clear();
                }}
              ><Screen /></ErrorBoundary>

            } />

            <Route exact={true} path={'/aem-pure-headless/*'} element={

              <ErrorBoundary
                FallbackComponent={Error}
                onReset={() => {
                  sessionStorage.removeItem('loggedin');
                  sessionStorage.removeItem('auth');
                }}
              ><Screen /></ErrorBoundary>

            } />
            <Route exact={true} path={`/${context.project}/*`} element={
              <ErrorBoundary
                FallbackComponent={Error}
                onReset={() => {
                  sessionStorage.removeItem('loggedin');
                  sessionStorage.removeItem('auth');
                }}
              ><Screendetails /></ErrorBoundary>
            } />

          </Routes>
        </BrowserRouter>
      </div>
    );
  }
};

export default App;

