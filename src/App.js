import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Hibernated from './utils/hibernated';
import Screen from './components/screen';
import Settings from './utils/settings';

function App() {
  const [status, setStatus] = useState(0);

  useEffect(() => {
    let url = localStorage.getItem('serviceURL').replace('author', 'publish');
    fetch(url).then((response) => {
      console.info(response);
      setStatus(1);
    }).catch((error) => {
      console.error(error);
      setStatus(0);
    });
  });

  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route exact={false} path={'/aem-pure-headless'} element={
            status && localStorage.getItem('loggedin') ? <Screen /> : (!status ? <Hibernated /> : <Settings />)
          } />
          <Route exact={false} path={'/'} element={
            status && localStorage.getItem('loggedin') ? <Screen /> : (!status ? <Hibernated /> : <Settings />)
          } />
          <Route exact={true} path={'/settings'} element={<Settings />} />
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
