import React, { useState, useEffect, useContext } from 'react';
import { marked } from 'marked';
import './settings.css';
import endpointmd from './endpoint.md';
import serviceURLmd from './serviceURL.md';
import projectmd from './project.md';
import authmd from './auth.md';
import versionmd from './version.md';
import intromd from './intro.md';
import placeholdersExtensionURLmd from './placeholdersExtensionURL.md';
import { useErrorHandler } from 'react-error-boundary';
import PropTypes from 'prop-types';
import { prepareRequest } from '../index';
import { AppContext } from '../context';

const instructionsData = {
  'serviceURL': serviceURLmd,
  'intro': intromd,
  'auth': authmd,
  'endpoint': endpointmd,
  'authenticate': 'My error message',
  'project': projectmd,
  'publish': projectmd,
  'version': versionmd,
  'placeholdersExtensionURL': placeholdersExtensionURLmd,
};

const Settings = () => {
  const context = useContext(AppContext);
  const handleError = useErrorHandler();
  const [instructions, setInstructions] = useState('');
  const [intro, setIntro] = useState('');
  const [project, setProject] = useState(context.project);
  const [serviceURL, setServiceURL] = useState(context.serviceURL);
  const [config, setConfig] = useState({});
  const [statusCode, setStatusCode] = useState('');
  const [version, setVersion] = useState(context.version);
  const [placeholdersExtensionURL, setPlaceholdersExtensionURL] = useState(context.placeholdersExtensionURL);
  const configPath = `/content/dam/${project}/site/configuration/configuration-v2`;

  let inFrame = false;
  if (window.location !== window.parent.location) {
    inFrame = true;
  }

  const getConfiguration = () => {

    syncLocalStorage('serviceURL', serviceURL);
    syncLocalStorage('project', project);
    syncLocalStorage('endpoint', context.endpoint);
    syncLocalStorage('version', version);

    context.serviceURL = serviceURL;
    context.project = project;

    const sdk = prepareRequest(context);

    sdk.runPersistedQuery(`aem-demo-assets/${context.pqs.config}`, { path: configPath })
      .then(({ data }) => {

        if (data) {
          setConfig(data);
          sessionStorage.removeItem('auth');
          sessionStorage.removeItem('loggedin');
        }
      })
      .catch((error) => {
        handleError(error);
      });

    const headers = new Headers({
      'Content-Type': 'text/html',
    });
  };

  useEffect(() => {

    for (let [key, value] of Object.entries(instructionsData)) {
      if (value.includes('/static/media')) {
        fetch(value)
          .then((r) => r.text())
          .then(text => {
            instructionsData[key] = marked.parse(text);
            if (key === 'intro') setIntro(marked.parse(text));
          }).catch(error => {
            handleError(error);
          }).catch(error => {
            handleError(error);
          });
      }
    }

  }, [handleError, instructions]);

  const syncLocalStorage = (key, value) => {
    if (key === 'auth' || key === 'loggedin')
      sessionStorage.setItem(key, value);
    else
      localStorage.setItem(key, value);
  };

  return (
    <React.Fragment>
      <AppContext.Provider value={context}>
        <header className='home-hero'></header>
        <div className={'main settings' + (inFrame ? ' iframe' : '')}>
          <div className='settings-form'>
            <form>
              <label>Author URL
                <input className='author-url'
                  type='text'
                  placeholder='Enter the URL of your author environment'
                  name='serviceURL'
                  onSelect={(e) => setInstructions(instructionsData[e.target.name])}
                  value={serviceURL}
                  onChange={(e) => setServiceURL(e.target.value)}>
                </input>
              </label>
              <label>Project Name
                <input className='shared-project'
                  type='text'
                  placeholder='gql-demo'
                  name='project'
                  onSelect={(e) => setInstructions(instructionsData[e.target.name])}
                  value={project}
                  onChange={(e) => setProject(e.target.value)}></input>
              </label>
              <label>Version
                <input className='version'
                  type='text'
                  placeholder=''
                  name='version'
                  onSelect={(e) => setInstructions(instructionsData[e.target.name])}
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}></input>
              </label>
              <label>Placeholders Extension URL
                <input className='placeholders-extension-url'
                  type='text'
                  placeholder='Enter the URL of your placeholders extension'
                  name='placeholdersExtensionURL'
                  onSelect={(e) => setInstructions(instructionsData[e.target.name])}
                  value={placeholdersExtensionURL}
                  onChange={(e) => setPlaceholdersExtensionURL(e.target.value)}>
                </input>
              </label>
              <button className='button'
                type='button'
                name='authenticate'
                onClick={(e) => getConfiguration(e)}>Authenticate</button>
            </form>
            {!Object.keys(config).length && (
              <div className='instructions'>
                <div className='overview' dangerouslySetInnerHTML={{ __html: intro }} />
                <div className='item' dangerouslySetInnerHTML={{ __html: instructions }} />
              </div>
            )}
            {Object.keys(config).length !== 0 && (

              <div className='instructions'>
                <p>You are loggedin.  You can now navigate to the app <a href='/aem-pure-headless'>here</a>.</p>
                <p>You can configuration the configuration fragment <a href={serviceURL + 'editor.html' + configPath} target='_blank' rel='noreferrer'>here</a>.</p>
              </div>
            )}
          </div>
        </div>
      </AppContext.Provider>
    </React.Fragment>
  );
};

Settings.propTypes = {
  context: PropTypes.object
};

export default Settings;