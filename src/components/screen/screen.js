import React, { useEffect, useState } from 'react';
import ModelManager from '../../utils/modelmanager';
import { ScreenQry } from '../../api/query';
import AEMHeadless from '@adobe/aem-headless-client-js';
import './screen.css';
import Footer from '../footer';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { rootPath } from '../../utils';
import Header from '../header';
import gql from '../../api/gql.json';
import { useErrorHandler } from 'react-error-boundary';


const Screen = () => {
  const handleError = useErrorHandler();

  const [config, setConfiguration] = useState('');
  const [data, setData] = useState('');
  const [title, setTitle] = useState('');

  const props = useParams();
  let path = '';

  if (Object.values(props)[0] !== '')
    path = `${rootPath}/${Object.values(props)[0]}`;


  useEffect(() => {

    const sdk = new AEMHeadless({
      serviceURL: localStorage.getItem('serviceURL'),
      endpoint: localStorage.getItem('endpoint'),
      auth: localStorage.getItem('auth')
    });

    sdk.runPersistedQuery('aem-demo-assets/gql-demo-configuration')
      .then(({ data }) => {
        if (data) {
          setConfiguration(data);
          sdk.runPersistedQuery('aem-demo-assets/gql-demo-screen', { path: path !== '' ? path : data.configurationByPath.item.homePage._path })
            .then(({ data }) => {
              if (data) {
                data.screen.body._metadata.stringMetadata.map((metadata) => {
                  if (metadata.name === 'title')
                    setTitle(metadata.value);
                });

                if (Array.isArray(data.screen.body)) {
                  data.screen.body = data.screen.body[0];
                }
                setData(data);
              }
            })
            .catch((error) => {
              handleError(error);
            });
        }
      })
      .catch((error) => {
        handleError(error);
      });


  }, [path, handleError]);

  let i = 0;

  document.title = title;

  return (
    <React.Fragment>

      {data.screen && data.screen.body.header && config.configurationByPath &&
        <Header content={data.screen.body.header} config={config.configurationByPath.item} />
      }

      <div className='main-body'>
        <Flyout />
        {data && data.screen.body.block.map((item) => (
          <div
            key={`${item.__typename
              .toLowerCase()
              .replace(' ', '-')}-block-${i}`}
            className='block'
          >

            <ModelManager
              key={`${item.__typename}-entity-${i++}`}
              type={item.__typename}
              content={item}
              references={data.screen._references}
              config={config}
            >

            </ModelManager>
          </div>
        ))}
      </div>
      <footer>
        {config.configurationByPath && config.configurationByPath.item.footerExperienceFragment &&
          <Footer config={config.configurationByPath.item.footerExperienceFragment._authorUrl} />
        }
      </footer>
    </React.Fragment>
  );
};

const Flyout = () => {
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
    <div className='fly-out-gql payload'>
      <div className='button-group'>
        <button onClick={showResponse} className='button'>Show Response</button>
        <button onClick={showPayload} className='button'>Show Request</button>
        <button onClick={hideGQL} className='button'>Hide GQL</button>
      </div>
      <pre>{JSON.stringify(gql, null, 2)}</pre>
    </div>
  );
};

Screen.propTypes = {
  pos1: PropTypes.string,
  pos2: PropTypes.string,
  pos3: PropTypes.string,
  location: PropTypes.object
};

export default Screen;
