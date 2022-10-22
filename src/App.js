import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Screen from './components/screen';
import Settings from './components/Settings/settings';

function App() {
  return (
    <div className='App'>
     
      <BrowserRouter>
        <Routes>
          <Route exact={true} path={'/'} element={<Screen />}>
            
          </Route>
          <Route exact={true} path={'/settings'} element={<Settings/>}>
            
          </Route>
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
