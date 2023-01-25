import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import './settings.css';
import endpointmd from './endpoint.md';
import serviceURLmd from './serviceURL.md';
import projectmd from './project.md';
import authmd from './auth.md';
import proxymd from './proxymd.md';
import intromd from './intro.md';
import { AEMHeadless } from '@adobe/aem-headless-client-js';
import { useErrorHandler } from 'react-error-boundary';
import PropTypes from 'prop-types';
import { proxyURL } from '../index';

const instructionsData = {
  'serviceURL': serviceURLmd,
  'intro': intromd,
  'auth': authmd,
  'endpoint': endpointmd,
  'authenticate': 'My error message',
  'project': projectmd,
  'publish': projectmd,
  'proxy': proxymd
};

document.title = 'Settings';

const Settings = ({ context }) => {
  const handleError = useErrorHandler();
  const [instructions, setInstructions] = useState('');
  const [intro, setIntro] = useState('');
  const [endpoint, setEndpoint] = useState(context.endpoint);
  const [project, setProject] = useState(context.project);
  const [loggedin, setLoggedin] = useState(JSON.parse(context.loggedin));
  const [auth, setAuth] = useState(context.auth);
  const [serviceURL, setServiceURL] = useState(context.serviceURL);
  const [config, setConfig] = useState({});
  const [useProxy, setUseProxy] = useState(JSON.parse(context.useProxy));
  const [publish, setPublish] = useState(context.publish);
  const [statusCode, setStatusCode] = useState('');
  const configPath = `/content/dam/${project}/site/configuration/configuration`;

  const imageListArray = [
    `/content/dam/${project}/site/en/about-us/components/our-contributers`,
    `/content/dam/${project}/site/en/home/components/recent-articles`,
    `/content/dam/${project}/site/en/magazine/arctic-surfing/recent-articles`,
    `/content/dam/${project}/site/en/magazine/components/featured-articles`,
    `/content/dam/${project}/site/en/magazine/san-diego-surf/related-articles`,
    `/content/dam/${project}/site/en/magazine/ski-touring/related-articles`,
    `/content/dam/${project}/site/en/magazine/western-australia/recent-articles`,
  ];

  const screenListArray = [`/content/dam/${project}/site/en/magazine/arctic-surfing/arctic-surfing`,
    `/content/dam/${project}/site/en/magazine/san-diego-surf/san-diego-surf`,
    `/content/dam/${project}/site/en/magazine/ski-touring/ski-touring`,
    `/content/dam/${project}/site/en/magazine/western-australia/western-australia`,
    `/content/dam/${project}/site/en/new-adventure/new-adventure!!`,
  ];

  const getConfiguration = () => {

    const now = new Date();

    syncLocalStorage('serviceURL', serviceURL);
    syncLocalStorage('endpoint', endpoint);
    syncLocalStorage('auth', auth);
    syncLocalStorage('project', project);
    syncLocalStorage('publish', publish);
    syncLocalStorage('loggedin', loggedin);
    syncLocalStorage('useProxy', useProxy);


    if (localStorage.getItem('expiry') === null)
      localStorage.setItem('expiry', now.getTime() + 82800000);

    const sdk = JSON.parse(useProxy) ? new AEMHeadless({
      serviceURL: proxyURL,
      endpoint: endpoint,
      auth: auth,
      headers: { 'aem-url': serviceURL }
    }) : new AEMHeadless({
      serviceURL: serviceURL,
      endpoint: endpoint,
      auth: auth
    });


    sdk.runPersistedQuery('aem-demo-assets/gql-demo-configuration', { path: configPath })
      .then(({ data }) => {

        if (data) {
          setConfig(data);
          localStorage.setItem('loggedin', true);
          setLoggedin(true);
        }
      })
      .catch((error) => {
        localStorage.setItem('loggedin', false);
        setAuth('');
        handleError(error);
      });

    const url = '/content/experience-fragments/wknd-site/language-masters/en/site/footer/master.content.html?wcmmode=disabled';


    const headers = useProxy ?
      new Headers({
        'Authorization': `Bearer ${auth}`,
        'Content-Type': 'text/html',
        'aem-url': serviceURL
      }) :
      new Headers({
        'Authorization': `Bearer ${auth}`,
        'Content-Type': 'text/html',
      });

    const req = useProxy ?
      new Request(proxyURL + url, {
        method: 'get',
        headers: headers,
        mode: 'cors',
        referrerPolicy: 'origin-when-cross-origin'
      }) :
      new Request(serviceURL + url, {
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
    setPublish(false);

    // syncState('endpoint', setEndpoint);
    // syncState('auth', setAuth);
    // syncState('project', setProject);
    // syncState('loggedin', setLoggedin);
    // syncState('serviceURL', setServiceURL);
    // syncState('publish', setPublish);
    // syncState('useProxy', setUseProxy);
  }, [handleError, instructions]);

  // const syncState = (value, func) => {
  //   if (localStorage.getItem(value)) {
  //     if (value === 'publish')
  //       func(JSON.parse(localStorage.getItem(value)));
  //     else
  //       func(localStorage.getItem(value));
  //   }
  // };

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
                onSelect={(e) => setInstructions(instructionsData[e.target.name])}
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
                onSelect={(e) => setInstructions(instructionsData[e.target.name])}
                value={auth}
                onChange={(e) => { setAuth(e.target.value); }}>
              </textarea>
            </label>
            <label>GraphQL Endpoint
              <input className='graphql-endpoint'
                type='text'
                placeholder='/content/_cq_graphql/aem-demo-assets/endpoint.json'
                name='endpoint'
                onSelect={(e) => setInstructions(instructionsData[e.target.name])}
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}>
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

            <fieldset>
              <legend>It is highly recommended you use this proxy to avoid CORS errors. By unselecting, you will need to update CORS setting in your AEM instance.</legend>
              <label>Use Proxy
                <input className='proxy'
                  type='checkbox'
                  name='useProxy'
                  value='checked'
                  onSelect={() => setInstructions(instructionsData['proxy'])}
                  onChange={(e) => { setUseProxy(JSON.parse(e.target.checked)); }}
                ></input>
              </label>
            </fieldset>

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
      <div>{intro}</div>
    </React.Fragment>
  );
};

Settings.propTypes = {
  context: PropTypes.object
};

export default Settings;