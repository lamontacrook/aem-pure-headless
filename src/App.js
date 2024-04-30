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
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { componentDefinition, modelDefinition, filterDefinition } from './utils/ue-definitions';

const App = () => {
  const context = useContext(AppContext);
  const [wait, setWait] = useState(true);
  const handleError = useErrorHandler();
  const aemUrl = context.serviceURL.replace(/\/$/, '');

  useEffect(() => {
    if (!document.querySelector(`head link[rel='preconnect'][href='${aemUrl}']`)) {
      document.querySelector('head').insertAdjacentHTML('beforeend', `<link rel='preconnect' href='${aemUrl}' />`);
    }
  }, [aemUrl]);

  useEffect(() => {

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
      <HelmetProvider>
        <div className='App'>
          <Helmet>
            <meta name='urn:adobe:aue:system:aemconnection' content={`aem:${aemUrl}`} />
            <script type='application/vnd.adobe.aue.filter+json'>{JSON.stringify(filterDefinition(context))}</script>
            <script type='application/vnd.adobe.aue.component+json'>{JSON.stringify(componentDefinition(context))}</script>
            <script type='application/vnd.adobe.aue.model+json'>{JSON.stringify(modelDefinition(context))}</script>
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
              <Route exact={false} path={'/aem-pure-headless/*'} element={

                <ErrorBoundary
                  FallbackComponent={Error}
                  onReset={() => {
                    sessionStorage.clear();
                    localStorage.clear();
                  }}
                ><Screen /></ErrorBoundary>

              } />
              <Route exact={false} path={`/${context.project}/*`} element={

                <ErrorBoundary
                  FallbackComponent={Error}
                  onReset={() => {
                    sessionStorage.clear();
                    localStorage.clear();
                  }}
                ><Screen /></ErrorBoundary>

              } />

              <Route exact={true} path={`/aem-pure-headless/${context.project}/*`} element={

                <ErrorBoundary
                  FallbackComponent={Error}
                  onReset={() => {
                    sessionStorage.removeItem('loggedin');
                    sessionStorage.removeItem('auth');
                  }}
                ><Screen /></ErrorBoundary>

              } />
              <Route exact={true} path={'/aem-demo-assets/*'} element={
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
      </HelmetProvider>
    );
  }
};

export default App;
