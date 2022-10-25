import React, { useEffect, useState } from 'react';
import ModelManager from '../../utils/modelmanager';
import gql from '../../api/gql.json';
import { ScreenQry } from '../../api/query';
import AEMHeadless from '@adobe/aem-headless-client-js';
import './screen.css';
import Header from '../header';

const Screen = () => {
  const [header, setHeader] = useState({});

  useEffect(() => {
    if (!Object.keys(header).length) {
      const sdk = new AEMHeadless({
        serviceURL: localStorage.getItem('serviceURL'),
        endpoint: localStorage.getItem('endpoint'),
        auth: localStorage.getItem('auth')
      });

      sdk.runPersistedQuery('/gql-demo/configuration')
        .then(({ data }) => {
          if (data)
            setHeader(data.configurationByPath.item.headerExperienceFragment);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }), [header];


  const data = gql['data'];
  let i = 0;

  if (Array.isArray(data.screen.body)) data.screen.body = data.screen.body[0];

  function hideGQL() {
    document.querySelector('.fly-out-gql').style.display = 'none';
  }

  function showPayload() {
    document.querySelector('.fly-out-gql > pre').innerHTML = `<pre>${ScreenQry()}</pre>`;
  }

  function showResponse() {
    document.querySelector('.fly-out-gql > pre').innerHTML = `<pre>${JSON.stringify(gql, null, 2)}</pre>`;
  }

  return (
    <React.Fragment>
      <nav>
        <Header content={header} />
      </nav>

      <div className='main-body'>
        <div className='fly-out-gql payload'>
          <button onClick={showResponse} className='button'>Show Response</button>
          <button onClick={showPayload} className='button'>Show Request</button>
          <button onClick={hideGQL} className='button'>Hide GQL</button>
          <pre>{JSON.stringify(gql, null, 2)}</pre>
        </div>
        {data.screen.body.block.map((item) => (
          <div
            key={`${item._model.title
              .toLowerCase()
              .replace(' ', '-')}-block-${item._model._path}-${i}`}
            className='block'
          >

            <ModelManager
              key={`${item._model.title
                .toLowerCase()
                .replace(' ', '-')}-entity-${item._model._path}-${i++}`}
              type={item._model.title}
              content={item}
              references={data.screen._references}
            >

            </ModelManager>
          </div>
        ))}

      </div>
    </React.Fragment>
  );
};

export default Screen;
