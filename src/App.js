import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Screen from './components/screen';
import Settings from './components/settings';

function App() {
  return (
    <div className='App'>

      <BrowserRouter>
        <Routes>
          <Route exact={false} path={'/aem-pure-headless'} element={
            localStorage.getItem('loggedin') ? <Screen /> : <Settings/>
          } />
          <Route exact={false} path={'/'} element={
            localStorage.getItem('auth') !== null ? <Screen /> : <Settings/>
          } />
          <Route exact={true} path={'/settings'} element={<Settings />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

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
