import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Screen from './components/screen';
import Settings from './utils/settings';
import { ErrorBoundary } from 'react-error-boundary';
import Screendetails from './components/screendetails';
import Error from './components/error';

const App = () => {
  const [explode, setExplode] = useState(false);

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
            ><Screen /></ErrorBoundary>
          } />
         
          <Route exact={true} path={'/aem-pure-headless/*'} element={
            <ErrorBoundary
              FallbackComponent={Error}
              onReset={() => {
                localStorage.removeItem('loggedin');
                location.href = '#/settings';
              }}
            ><Screen /></ErrorBoundary>
          } />
          <Route exact={true} path={`/${localStorage.getItem('project')}/*`} element={
            <ErrorBoundary
              FallbackComponent={Error}
              onReset={() => {
                localStorage.removeItem('loggedin');
                location.href = '#/settings';
              }}
            ><Screendetails /></ErrorBoundary>
          } />

          <Route exact={true} path={'/settings'} element={<Settings />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

//OW31eBTamBf6
export default App;

