import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Screen from './components/screen';
import Settings from './utils/settings';
import { ErrorBoundary } from 'react-error-boundary';
import Screendetails from './components/screendetails';
import Error from './components/error';
import { useErrorHandler } from 'react-error-boundary';
import { ThreeDots } from 'react-loader-spinner';

const App = () => {

  const [authState, setAuthState] = useState({loggedin:false});
  const handleError = useErrorHandler();

  useEffect(() => {

    if (authState.loggedin) return;
    fetch(process.env.REACT_APP_ACCESS_TOKEN)
      .then(response => ({
        res: response.text().then(token => {
          if (token) {
            setAuthState({
              auth: token,
              endpoint: localStorage.endpoint || '/content/_cq_graphql/aem-demo-assets/endpoint.json',
              project: localStorage.project || 'gql-demo-template',
              loggedin: localStorage.loggedin || true,
              serviceURL: localStorage.serviceURL || 'https://author-p91555-e868145.adobeaemcloud.com/',
              publish: localStorage.publish || false,
              rda: localStorage.rda || 'v2'
            });
            localStorage.setItem('auth', token);
            localStorage.setItem('loggedin', true);
          }
        }).catch(error => {
          error.message = `Error fetching token:\n ${error.message}`;
          handleError(error);
        })
      }));
  }), [];

  if (!authState.loggedin && !authState.project) {
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
        <HashRouter>
          <Routes>
            <Route exact={false} path={'/*'} element={

              <ErrorBoundary
                FallbackComponent={Error}
                onReset={() => {
                  localStorage.setItem('loggedin', false);
                  localStorage.removeItem('auth');
                  // location.href = '#/settings';
                }}
              ><Screen context={authState} /></ErrorBoundary>

            } />

            <Route exact={true} path={'/aem-pure-headless/*'} element={

              <ErrorBoundary
                FallbackComponent={Error}
                onReset={() => {
                  localStorage.removeItem('loggedin');
                  localStorage.removeItem('auth');
                }}
              ><Screen context={authState} /></ErrorBoundary>

            } />
            <Route exact={true} path={`/${authState.project}/*`} element={
              <ErrorBoundary
                FallbackComponent={Error}
                onReset={() => {
                  localStorage.removeItem('loggedin');
                  localStorage.removeItem('auth');
                }}
              ><Screendetails context={authState} /></ErrorBoundary>
            } />

            <Route exact={true} path={'/settings'} element={<Settings />} />
          </Routes>
        </HashRouter>
      </div>
    );
  }
};

export default App;

