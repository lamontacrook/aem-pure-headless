import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import './settings.css';
import endpointmd from './endpoint.md';
import serviceURLmd from './serviceURL.md';
import projectmd from './project.md';
import authmd from './auth.md';
import { AEMHeadless } from '@adobe/aem-headless-client-js';
import { useErrorHandler } from 'react-error-boundary';
import PropTypes from 'prop-types';
import { proxyURL } from '../index';

const instructionsData = {
  'serviceURL': serviceURLmd,
  'auth': authmd,
  'endpoint': endpointmd,
  'authenticate': 'My error message',
  'project': projectmd,
  'publish': projectmd
};


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

const Settings = ({ context }) => {
  const handleError = useErrorHandler();
  const [instructions, setInstructions] = useState('');
  const [endpoint, setEndpoint] = useState(context.endpoint);
  const [project, setProject] = useState(context.project);
  const [loggedin, setLoggedin] = useState(context.loggedin);
  const [auth, setAuth] = useState(context.auth);
  const [serviceURL, setServiceURL] = useState(context.serviceURL);
  const [config, setConfig] = useState({});
  const [publish, setPublish] = useState(context.publish);
  const [statusCode, setStatusCode] = useState('');
  const configPath = `/content/dam/${project}/site/configuration/configuration`;


  const getConfiguration = () => {

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
      serviceURL: serviceURL,
      endpoint: endpoint,
      auth: auth
    });


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

    const url = `${serviceURL}/content/experience-fragments/wknde-site/language-masters/en/site/footer/master.content.html?wcmmode=disabled`;

    const headers = new Headers({
      'Authorization': `Bearer ${auth}`,
      'Content-Type': 'text/html',
    });

    context.useProxy && headers.append('aem-url', url);

    const req = context.useProxy ?
      new Request(proxyURL, {
        method: 'get',
        headers: headers,
        mode: 'cors',
        referrerPolicy: 'origin-when-cross-origin'
      }) :
      new Request(url, {
        method: 'get',
        headers: headers,
        mode: 'cors',
        referrerPolicy: 'origin-when-cross-origin'
      });

    fetch(req)
      .then((response) => {
        if (response) {
          setStatusCode(response.status);
        }
      })
      .catch((error) => {
        handleError(error);
      });


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
    if (localStorage.getItem(value)) {
      if (value === 'publish')
        func(JSON.parse(localStorage.getItem(value)));
      else
        func(localStorage.getItem(value));
    }
  };

  const syncLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
  };

  return (
    <React.Fragment>

      <header className='home-hero'></header>
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
          {!Object.keys(config).length && (<div className='instructions' dangerouslySetInnerHTML={{ __html: instructionsData[instructions.name] }}>
          </div>)}
          {Object.keys(config).length !== 0 && (

            <div className='instructions'>
              <p>You are loggedin.  You can now navigate to the app <a href='/aem-pure-headless'>here</a>.</p>
              <p>You can configuration the configuration fragment <a href={serviceURL + 'editor.html' + configPath} target='_blank' rel='noreferrer'>here</a>.</p>
              {statusCode === 404 && (<p>The out of the box configuration depends on a the wknd site Experience Fragments with the name wknd-site.  This can be overriden with the wknd path configuration path, but all content fragments with references to the Experiense Fragments should be updated.</p>)}
            </div>

          )}
        </div>
      </div>

    </React.Fragment>
  );
};

Settings.propTypes = {
  context: PropTypes.object
};

export default Settings;