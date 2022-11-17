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

const Screen = () => {
  const [config, setConfiguration] = useState('');
  const [data, setData] = useState('');
  const [title, setTitle] = useState('');

  const props = useParams();
  let path = '';
  
  if(Object.values(props)[0] !== '')
    path = `${rootPath}/${Object.values(props)[0]}`;

  useEffect(() => {

    const sdk = new AEMHeadless({
      serviceURL: localStorage.getItem('serviceURL'),
      endpoint: localStorage.getItem('endpoint'),
      auth: localStorage.getItem('auth')
    });

    sdk.runPersistedQuery('gql-demo/configuration')
      .then(({ data }) => {
        if (data) {
          setConfiguration(data);
          sdk.runPersistedQuery('gql-demo/screen', { path: path !== '' ? path : data.configurationByPath.item.homePage._path })
            .then(({ data }) => {
              if (data) {
                data.screen.body._metadata.stringMetadata.map((metadata) => {
                  if(metadata.name === 'title')
                    setTitle(metadata.value);
                });

                if (Array.isArray(data.screen.body)) {
                  data.screen.body = data.screen.body[0];
                }
                setData(data);
              }
            })
            .catch((error) => {
              console.log(error);
            });

        }
      })
      .catch((error) => {
        console.log(error);
      });


  }, [path]);

  let i = 0;

  document.title = title;

  return (
    <React.Fragment>
      {/* 
      {config.configurationByPath &&
        <Navigation logo={config.configurationByPath.item.siteLogo} />
      } */}

      {data.screen && data.screen.body.screenHeader && config.configurationByPath &&
        <Header content={data.screen.body.screenHeader} config={config.configurationByPath.item} />
      }

      <div className='main-body'>
        <Flyout />
        {data && data.screen.body.block.map((item) => (
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
          // <div key='1'>{item._model && JSON.stringify(item._model['title'])}</div>
        ))}
        {/* <div>{data.screen}</div> */}
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
