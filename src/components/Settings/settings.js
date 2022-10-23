import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { NavigationGQL } from '../../components/navigation';

import './settings.css';
import endpoint from './endpoint.md';
import serviceURL from './serviceURL.md';
import auth from './auth.md';

import { AEMHeadless } from '@adobe/aem-headless-client-js';

const instructionsData = {
  'serviceURL': serviceURL,
  'auth': auth,
  'endpoint': endpoint,
  'authenticate': 'My error message'
};


const Settings = () => {
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    for (let [key, value] of Object.entries(instructionsData)) {
      fetch(value)
        .then((r) => r.text())
        .then(text => {
          instructionsData[key] = marked.parse(text);
        });
    }

    // useQuery();

  }, []);

  const clearStorage = e => {
    // console.log(`clearStorage ${e.name} ${localStorage.getItem(e.name)}`);
    if (localStorage.getItem(e.name) !== null) {
      e.value = '';
      localStorage.removeItem(e.name);
    }
  };

  const handleSubmit = e => {
    // e.preventDefault();
    // console.log(e);

    // let [errors, setErrors] = useState(null);
    // let [data, setData] = useState(null);

    localStorage.setItem('serviceURL', document.querySelector('.author-url').value);
    localStorage.setItem('endpoint', document.querySelector('.graphql-endpoint').value);
    localStorage.setItem('auth', document.querySelector('.developer-token').value);

    const sdk = new AEMHeadless({
      serviceURL: localStorage.getItem('serviceURL'),
      endpoint: localStorage.getItem('endpoint'),
      auth: localStorage.getItem('auth')
    });

    //const request = sdk.runQuery.bind(sdk);
    //console.log(request);
    sdk.runQuery(NavigationGQL)
      .then(({ data }) => {

        //if (errors) console.log(mapErrors(errors));
        if (data) console.log(data);
      })
      .catch((error) => {
        if (error.toJSON().message.includes('There was a problem parsing response data')) {
          instructionsData[e.target.name] = `<h5>Error</h5> 403 Error for ${document.querySelector('.author-url').value}`;
          setInstructions(e.target);
          console.log(instructions);
          console.log(instructionsData);

        }
        //console.log('here');
        console.log(JSON.stringify(error));
      });
  };

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
                value={localStorage.getItem('serviceURL')}
                onChange={(e) => clearStorage(e.target)}>

              </input>
            </label>
            <label>Developer Token
              <textarea className='developer-token'
                type='text'
                rows={28}
                placeholder='Paste your Bearer Token'
                name='auth'
                onSelect={(e) => setInstructions(e.target)}
                value={localStorage.getItem('auth')}
                onChange={(e) => clearStorage(e.target)}>
              </textarea>
            </label>
            <label>GraphQL Endpoint
              <input className='graphql-endpoint'
                type='text'
                placeholder='Paste your Bearer Token'
                name='endpoint'
                onSelect={(e) => setInstructions(e.target)}
                value={localStorage.getItem('endpoint')}
                onChange={(e) => clearStorage(e.target)}>
              </input>
            </label>
            <button className='button'
              type='button'
              name='authenticate'
              onClick={(e) => handleSubmit(e)}>Authenticate</button>
          </form>
          <div className='instructions' dangerouslySetInnerHTML={{ __html: instructionsData[instructions.name] }}>

          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export function mapErrors(errors) {
  return errors.map((error) => error.message ? error.message : error).join(',');
}

export default Settings;