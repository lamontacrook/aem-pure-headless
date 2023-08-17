import React, { useState, useEffect, useContext } from 'react';
import { marked } from 'marked';
import './settings.css';
import endpointmd from './endpoint.md';
import serviceURLmd from './serviceURL.md';
import projectmd from './project.md';
import authmd from './auth.md';
import proxymd from './proxymd.md';
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
  'proxy': proxymd,
  'placeholdersExtensionURL': placeholdersExtensionURLmd,
};

const Settings = () => {
  const context = useContext(AppContext);
  const handleError = useErrorHandler();
  const [instructions, setInstructions] = useState('');
  const [intro, setIntro] = useState('');
  const [project, setProject] = useState(context.project);
  const [drNumber, setDRNumber] = useState('optional');
  const [serviceURL, setServiceURL] = useState(context.serviceURL);
  const [config, setConfig] = useState({});
  const [statusCode, setStatusCode] = useState('');
  const [placeholdersExtensionURL, setPlaceholdersExtensionURL] = useState(context.placeholdersExtensionURL);
  const configPath = `/content/dam/${project}/site/configuration/configuration`;

  let inFrame = false;
  if (window.location !== window.parent.location) {
    inFrame = true;
  }

  const imageListArray = [
    `/content/dam/${project}/site/en/about-us/components/our-contributers`,
    `/content/dam/${project}/site/en/home/components/recent-articles`,
    `/content/dam/${project}/site/en/magazine/arctic-surfing/recent-articles`,
    `/content/dam/${project}/site/en/magazine/components/featured-articles`,
    `/content/dam/${project}/site/en/magazine/san-diego-surf/related-articles`,
    `/content/dam/${project}/site/en/magazine/ski-touring/related-articles`,
    `/content/dam/${project}/site/en/magazine/western-australia/recent-articles`,
  ];

  const screenListArray = [
    `/content/dam/${project}/site/en/magazine/arctic-surfing/arctic-surfing`,
    `/content/dam/${project}/site/en/magazine/san-diego-surf/san-diego-surf`,
    `/content/dam/${project}/site/en/magazine/ski-touring/ski-touring`,
    `/content/dam/${project}/site/en/magazine/western-australia/western-australia`,
    `/content/dam/${project}/site/en/new-adventure/new-adventure!!`,
  ];

  const getConfiguration = () => {

    syncLocalStorage('serviceURL', serviceURL);
    syncLocalStorage('project', project);
    syncLocalStorage('endpoint', context.endpoint);

    context.serviceURL = serviceURL;
    context.project = project;

    const sdk = prepareRequest(context);

    sdk.runPersistedQuery('aem-demo-assets/gql-demo-configuration', { path: configPath })
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

    const url = '/content/experience-fragments/wknd-site/language-masters/en/site/footer/master.content.html?wcmmode=disabled';


    const headers = new Headers({
      'Content-Type': 'text/html',
    });

    const req = new Request(serviceURL + url, {
      method: 'get',
      headers: headers,
      credentials: 'include',
    });


    fetch(req)
      .then((response) => {
        if (response) {
          setStatusCode(response.status);
        }
      })
      .catch(() => {
        setStatusCode(404);
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
              <label>DR#
                <input className='dr-number'
                  type='text'
                  placeholder=''
                  name='dr-number'
                  onSelect={(e) => setInstructions(instructionsData[e.target.name])}
                  value={drNumber}
                  onChange={(e) => setDRNumber(e.target.value)}></input>
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
                {statusCode === 404 && (
                  <React.Fragment>
                    <p>The out of the box configuration depends on a the wknd site Experience Fragments with the name wknd-site.
                      This can be overriden with the wknd path configuration path, but all content fragments with references to the
                      Experiense Fragments should be updated.
                    </p>
                    <strong>Screens</strong>
                    <ul className='pagerefs'>
                      {screenListArray.map(e => (
                        <li key={e}><a href={serviceURL + 'editor.html' + e} target='_blank' rel='noreferrer'>{e}</a></li>
                      ))}
                    </ul>

                    <strong>ImageLists</strong>
                    <ul className='pagerefs'>
                      {imageListArray.map(e => (
                        <li key={e}><a href={serviceURL + 'editor.html' + e} target='_blank' rel='noreferrer'>{e}</a></li>
                      ))}
                    </ul>

                    <p>In addition to these, you will need to update the configuration fragment linked <a href={serviceURL + 'editor.html' + configPath} target='_blank' rel='noreferrer'>here</a>.</p>
                  </React.Fragment>
                )}
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