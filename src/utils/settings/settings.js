import React, { useState, useEffect } from 'react';
// import Navigation from '../../components/navigation';
import { marked } from 'marked';
import './settings.css';
import endpointmd from './endpoint.md';
import serviceURLmd from './serviceURL.md';
import projectmd from './project.md';
import authmd from './auth.md';
import { AEMHeadless } from '@adobe/aem-headless-client-js';
import { useErrorHandler } from 'react-error-boundary';
import { createGlobalStyle } from 'styled-components';
import PropTypes from 'prop-types';

const instructionsData = {
  'serviceURL': serviceURLmd,
  'auth': authmd,
  'endpoint': endpointmd,
  'authenticate': 'My error message',
  'project': projectmd,
  'publish': projectmd
};

const GlobalStyles = createGlobalStyle`
:root {
  
}
`;

export const expiry = () => {
  const now = new Date();
  if (localStorage.getItem('expiry') && (now.getTime() > localStorage.getItem('expiry'))) {
    localStorage.removeItem('expiry');
    localStorage.removeItem('auth');
    localStorage.setItem('loggedin', false);
   
    return false;
  } else if (!localStorage.getItem('expiry')) {
    return false;
  } else {
    return true;
  }
};
document.title = 'Settings';

const Settings = ({context}) => {
  const handleError = useErrorHandler();
  const [instructions, setInstructions] = useState('');
  const [endpoint, setEndpoint] = useState(context.endpoint);
  const [project, setProject] = useState(context.project);
  const [loggedin, setLoggedin] = useState(context.loggedin);
  const [auth, setAuth] = useState(context.auth);
  const [serviceURL, setServiceURL] = useState(context.serviceURL);
  const [config, setConfig] = useState({});
  const [schema, setSchema] = useState('');
  const [publish, setPublish] = useState(context.publish);

  const getConfiguration = () => {
    if (config && schema) return;

    const now = new Date();

    syncLocalStorage('serviceURL', serviceURL);
    syncLocalStorage('endpoint', endpoint);
    syncLocalStorage('auth', auth);
    syncLocalStorage('project', project);
    syncLocalStorage('publish', publish);
    syncLocalStorage('loggedin', loggedin);


    if (localStorage.getItem('expiry') === null)
      localStorage.setItem('expiry', now.getTime() + 82800000);

    const sdk = new AEMHeadless({
      serviceURL: 'https://102588-505tanocelot.adobeioruntime.net/api/v1/web/aem/proxy',
      endpoint: endpoint,
      auth: auth,
      headers: {
        'aem-url': serviceURL
      }
    });

    const configPath = `/content/dam/${localStorage.getItem('project')}/site/configuration/configuration`;
  
    if (!config) {
      sdk.runPersistedQuery('aem-demo-assets/gql-demo-configuration', { path: configPath })
        .then(({ data }) => {

          if (data) {
            
            setConfig(data);
            
            localStorage.setItem('loggedin', true);
          }
        })
        .catch((error) => {
          localStorage.setItem('loggedin', false);
          setAuth('');
          handleError(error);
        });
    }

    if (!schema) {
      fetch(`${serviceURL}content/cq:graphql/aem-demo-assets/endpoint.GQLschema.md`, {
        method: 'GET',
        headers: {
          'Content-Type': 'text/markdown',
          'Authorization': 'Bearer ' + auth,
        }
      }).
        then(res => res.text()
          .then(data => {
            data = data.substring(data.indexOf('AdventureModel {'), data.length);
            data = data.substring(0, data.indexOf('}') + 1);
            if (data.includes('adventureTitle'))
              localStorage.setItem('rda', 'v1');
            else
              localStorage.setItem('rda', 'v2');
            setSchema(data);
          })).catch(error => handleError(error));
    }
  };

  if (!expiry() && auth !== '' && expiry !== '') {
    localStorage.setItem('loggedin', false);
    localStorage.setItem('auth', '');
  }

  useEffect(() => {
    for (let [key, value] of Object.entries(instructionsData)) {
      if (value.includes('/static/media')) {
        fetch(value)
          .then((r) => r.text())
          .then(text => {
            instructionsData[key] = marked.parse(text);
          }).catch(error => {
            handleError(error);
          }).catch(error => {
            handleError(error);
          });
      }
    }
    syncState('endpoint', setEndpoint);
    syncState('auth', setAuth);
    syncState('project', setProject);
    syncState('loggedin', setLoggedin);
    syncState('serviceURL', setServiceURL);
    syncState('publish', setPublish);

  }, [handleError]);

  const syncState = (value, func) => {
    if(localStorage.getItem(value)) {
      if(value === 'publish')
        func(JSON.parse(localStorage.getItem(value)));
      else
        func(localStorage.getItem(value));
    }
  };

  const syncLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
  };

  // if (auth && endpoint && project && serviceURL && JSON.parse(loggedin)) {
  //   getConfiguration();
  // }

  return (
    <React.Fragment>
      <GlobalStyles></GlobalStyles>
      {/* <header className='home-hero'><Navigation className='light-nav' config={config} /></header> */}
      <div className='main-body settings'>
        <div className='settings-form'>
          <form>
            <label>Author URL
              <input className='author-url'
                type='text'
                placeholder='Enter the URL of your author environment'
                name='serviceURL'
                onSelect={(e) => setInstructions(e.target)}
                value={serviceURL}
                onChange={(e) => setServiceURL(e.target.value)}>

              </input>
            </label>
            <label>Developer Token
              <textarea className='developer-token'
                type='text'
                rows={28}
                placeholder='Paste your Bearer Token'
                name='auth'
                onSelect={(e) => setInstructions(e.target)}
                value={auth}
                onChange={(e) => setAuth(e.target.value)}>
              </textarea>
            </label>
            <label>GraphQL Endpoint
              <input className='graphql-endpoint'
                type='text'
                placeholder='/content/_cq_graphql/aem-demo-assets/endpoint.json'
                name='endpoint'
                onSelect={(e) => setInstructions(e.target)}
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}>
              </input>
            </label>

            <label>Project Name
              <input className='shared-project'
                type='text'
                placeholder='gql-demo'
                name='project'
                onSelect={(e) => setInstructions(e.target)}
                value={project}
                onChange={(e) => setProject(e.target.value)}></input>
            </label>

            <button className='button'
              type='button'
              name='authenticate'
              onClick={(e) => getConfiguration(e)}>Authenticate</button>
          </form>
          {!schema && (<div className='instructions' dangerouslySetInnerHTML={{ __html: instructionsData[instructions.name] }}>
          </div>)}
          <pre>{schema && (<div><h3>You are loggedin.  You can now navigate to the app.</h3></div>)}</pre>
        </div>
      </div>

    </React.Fragment>
  );
};

Settings.propTypes = {
  context: PropTypes.object
};

export default Settings;