import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import './settings.css';
import endpoint from './endpoint.md';
import serviceURL from './serviceURL.md';
import auth from './auth.md';
import PropTypes from 'prop-types';

import { AEMHeadless } from '@adobe/aem-headless-client-js';

const instructionsData = {
  'serviceURL': serviceURL,
  'auth': auth,
  'endpoint': endpoint,
  'authenticate': 'My error message'
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
  const [success, setSuccess] = useState(0);

  const navigate = useNavigate();
  return success ? navigate('/', { state: 'pass-data' } ) : <SettingComp success={setSuccess} />;

};

const SettingComp = (success) => {
  const [instructions, setInstructions] = useState('');
  const [serviceURL, setServiceURL] = useState('');
  const [auth, setAuth] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [payload, setPayload] = useState('');


  const validateAssets = e => {
    const now = new Date();
    localStorage.setItem('serviceURL', document.querySelector('.author-url').value);
    localStorage.setItem('endpoint', document.querySelector('.graphql-endpoint').value);
    localStorage.setItem('auth', document.querySelector('.developer-token').value);


    if (localStorage.getItem('expiry') === null)
      localStorage.setItem('expiry', now.getTime() + 82800000);

    const sdk = new AEMHeadless({
      serviceURL: localStorage.getItem('serviceURL'),
      endpoint: localStorage.getItem('endpoint'),
      auth: localStorage.getItem('auth')
    });

    sdk.runPersistedQuery('gql-demo/teaser-assets')
      .then(({ data }) => {

        if (data) {
          instructionsData[e.target.name] = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
          setPayload(data);
          localStorage.setItem('loggedin', 1);
          success.success(1);
        }
      })
      .catch((error) => {
        // if (error && error.toJSON().message.includes('There was a problem parsing response data')) {
        //   instructionsData[e.target.name] = `<h5>Error</h5> 403 Error for ${document.querySelector('.author-url').value}`;
        //   setInstructions(e.target);
        //   localStorage.setItem('loggedin', 0);
        // }
        // //console.log('here');
        // console.log(JSON.stringify(error));
        console.log(error);
      });
  };

  useEffect(() => {
    for (let [key, value] of Object.entries(instructionsData)) {
      fetch(value)
        .then((r) => r.text())
        .then(text => {
          instructionsData[key] = marked.parse(text);
        });
    }


    localStorage.getItem('serviceURL') && setServiceURL(localStorage.getItem('serviceURL'));
    localStorage.getItem('endpoint') && setEndpoint(localStorage.getItem('endpoint'));
    localStorage.getItem('auth') && setAuth(localStorage.getItem('auth'));
    !expiry() && setAuth('');
  }, []);

  return (
    <React.Fragment>
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
                placeholder='Paste your Bearer Token'
                name='endpoint'
                onSelect={(e) => setInstructions(e.target)}
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}>
              </input>
            </label>
            {/* <label>Shared Project
              <input className='shared-project'
                type='text'
                placeholder='Possible Project'
                name='project'></input>
            </label> */}
            <button className='button'
              type='button'
              name='authenticate'
              onClick={(e) => validateAssets(e)}>Validate Assets</button>
          </form>
          <div className='instructions' dangerouslySetInnerHTML={{ __html: instructionsData[instructions.name] || payload }}>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

SettingComp.propTypes = {
  success: PropTypes.func
};

export default Settings;