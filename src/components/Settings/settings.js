import React, { useState, useEffect } from 'react';
import { marked } from 'marked';


import './settings.css';
import md from '../../media/instructions.md';

const instructionsData = {
  'author-url': 'Author URL - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'developer-token': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'graphql-endpoint': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
};

const Settings = () => {
  const [instructions, setInstructions] = useState('');
  const [fetchedData, setFetchedData] = useState('');

  async function fetchData() {

    setFetchedData('null');
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    fetchData();
  };

  console.log(fetchedData);
  fetch(md)
    .then((r) => r.text())
    .then(text  => {
      instructionsData['author-url'] = marked.parse(text);
    }) ;
  console.log(md);
  console.log(marked.parse(md));

  return (
    <React.Fragment>
      <div className='main-body settings'>
        <div className='settings-form'>
          <form>
            <label>Author URL
              <input className='author-url' type='text' placeholder='Enter the URL of your author environment' name='author-url' onSelect={(e) => setInstructions(e.target)}></input>
            </label>
            <label>Developer Token
              <textarea className='developer-token' type='text' rows={6} placeholder='Paste your Bearer Token' name='developer-token' onSelect={(e) => setInstructions(e.target)}>
              </textarea>
            </label>
            <label>GraphQL Endpoint
              <input className='graphql-endpoint' type='text' placeholder='Paste your Bearer Token' name='graphql-endpoint' onSelect={(e) => setInstructions(e.target)}>
              </input>
            </label>
            <button className='button' type='button' name='Authenticate' onClick={handleSubmit}>Authenticate</button>
          </form>
          <div className='instructions'>
            {instructionsData[instructions.name]}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Settings;