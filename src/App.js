import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Screen from './components/screen';
import Settings from './utils/settings';
import { ErrorBoundary } from 'react-error-boundary';
import Screendetails from './components/screendetails';
import Error from './components/error';
import { useErrorHandler } from 'react-error-boundary';

const App = () => {
  const [explode, setExplode] = useState(false);
  const handleError = useErrorHandler();
  const [loggedin, setLoggedIn] = useState(false);
  

  useEffect(() => {
    fetch(process.env.REACT_APP_ACCESS_TOKEN)
      .then(response => ({
        res: response.text().then(token => {
          if (token) {
            localStorage.setItem('endpoint', '/content/_cq_graphql/aem-assets-demo/endpoint.json');
            localStorage.setItem('serviceURL', 'https://author-p91555-e868145.adobeaemcloud.com/');
            localStorage.setItem('rda', 'v2');
            localStorage.setItem('project', 'gql-demo-template');
            localStorage.setItem('loggedin', 'true');
            localStorage.setItem('publish', 'false');
            localStorage.setItem('auth', token);
  
            setLoggedIn(true);
          }
        }).catch(error => handleError(error))
      }));
  }), [];


  if (!JSON.parse(localStorage.getItem('loggedin')) && !localStorage.getItem('project')) {
    return (<div>loading</div>);
  } else {
    return (
      <div className='App'>
        <HashRouter>
          <Routes>
            <Route exact={false} path={'/*'} element={
              <ErrorBoundary
                FallbackComponent={Error}
                onReset={() => {
                  setExplode(false);
                  localStorage.setItem('loggedin', false);
                  localStorage.removeItem('auth');
                  location.href = '#/settings';
                }}
                resetKeys={[explode]}
              ><Screen/></ErrorBoundary>
            } />

            <Route exact={true} path={'/aem-pure-headless/*'} element={
              <ErrorBoundary
                FallbackComponent={Error}
                onReset={() => {
                  localStorage.removeItem('loggedin');
                  location.href = '#/settings';
                }}
              ><Screen loggedin={loggedin} /></ErrorBoundary>
            } />
            <Route exact={true} path={`/${localStorage.getItem('project')}/*`} element={
              <ErrorBoundary
                FallbackComponent={Error}
                onReset={() => {
                  localStorage.removeItem('loggedin');
                  location.href = '#/settings';
                }}
              ><Screendetails loggedin={loggedin} /></ErrorBoundary>
            } />

            <Route exact={true} path={'/settings'} element={<Settings />} />
          </Routes>
        </HashRouter>
      </div>
    );
  }
};


//OW31eBTamBf6
export default App;

