import React, { useState, useEffect } from 'react';
import Navigation from '../../components/navigation';
import { marked } from 'marked';
import './settings.css';
import endpointmd from './endpoint.md';
import serviceURLmd from './serviceURL.md';
import authmd from './auth.md';
import { AEMHeadless } from '@adobe/aem-headless-client-js';
import { useErrorHandler } from 'react-error-boundary';

const instructionsData = {
  'serviceURL': serviceURLmd,
  'auth': authmd,
  'endpoint': endpointmd,
  'authenticate': 'My error message',
  'project': authmd
};

export const expiry = () => {
  const now = new Date();
  if (localStorage.getItem('expiry') && (now.getTime() > localStorage.getItem('expiry'))) {
    localStorage.removeItem('expiry');
    localStorage.removeItem('auth');
    return false;
  } else if (!localStorage.getItem('expiry')) {
    return false;
  } else {
    return true;
  }
};

const Settings = () => {
  const handleError = useErrorHandler();

  const [instructions, setInstructions] = useState('');
  const [endpoint, setEndpoint] = useState('/content/_cq_graphql/gql-demo/endpoint.json');
  const [project, setProject] = useState('/content/dam/gql-demo');
  const [loggedin, setLoggedin] = useState(false);
  const [auth, setAuth] = useState('');
  const [serviceURL, setServiceURL] = useState('');
  const [config, setConfig] = useState('');

  const getConfiguration = () => {
    if (config) return;

    const now = new Date();

    syncLocalStorage('serviceURL', serviceURL);
    syncLocalStorage('endpoint', endpoint);
    syncLocalStorage('auth', auth);
    syncLocalStorage('project', project);


    if (localStorage.getItem('expiry') === null)
      localStorage.setItem('expiry', now.getTime() + 82800000);

    const sdk = new AEMHeadless({
      serviceURL: serviceURL,
      endpoint: endpoint,
      auth: auth
    });

    sdk.runPersistedQuery('aem-demo-assets/gql-demo-configuration')
      .then(({ data }) => {

        if (data) {
          setConfig(<Navigation logo={data.configurationByPath.item.siteLogo} />);
          localStorage.setItem('loggedin', true);
        }
      })
      .catch((error) => {
        // localStorage.setItem('auth', 'There is an issue with the Developer Token.');
        handleError(error);
      });
  };



  if (!expiry() && auth !== '' && expiry !== '') {
    localStorage.setItem('loggedin', 0);
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
  }, [instructions, handleError]);

  const syncState = (value, func) => {
    localStorage.getItem(value) && func(localStorage.getItem(value));
  };




  const syncLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
  };

  if (auth && endpoint && project && serviceURL && JSON.parse(loggedin)) {
    getConfiguration();
  }

  return (
    <React.Fragment>
      <header>{config}</header>
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
                placeholder='/content/dam/gql-demo'
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
          <div className='instructions' dangerouslySetInnerHTML={{ __html: instructionsData[instructions.name] }}>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};


export default Settings;