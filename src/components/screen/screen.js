import React, { useEffect, useState } from 'react';
import ModelManager from '../../utils/modelmanager';
import AEMHeadless from '@adobe/aem-headless-client-js';
import Footer from '../footer';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { rootPath } from '../../utils';
import Header from '../header';
import { useErrorHandler } from 'react-error-boundary';
import { expiry } from '../../utils/settings';
import Flyout from '../../utils/flyout/flyout';
import './screen.css';


const Screen = () => {
  const handleError = useErrorHandler();
  const navigate = useNavigate();

  const [config, setConfiguration] = useState('');
  const [data, setData] = useState('');
  const [title, setTitle] = useState('');

  const props = useParams();
  let path = '';

  if (Object.values(props)[0] !== '')
    path = `${rootPath}/${Object.values(props)[0]}`;


  useEffect(() => {
    let loggedin = JSON.parse(localStorage.getItem('loggedin'));
    if (!expiry() && !loggedin) navigate('/settings');

    const sdk = new AEMHeadless({
      serviceURL: localStorage.getItem('serviceURL'),
      endpoint: localStorage.getItem('endpoint'),
      auth: localStorage.getItem('auth')
    });

    const version = localStorage.getItem('rda') === 'v1' ? 'v1' : 'v2';
    const configPath = `/content/dam/${localStorage.getItem('project')}/site/configuration/configuration`;

    sdk.runPersistedQuery('aem-demo-assets/gql-demo-configuration', { path: configPath })
      .then(({ data }) => {
        if (data) {
          setConfiguration(data);
          sdk.runPersistedQuery(`aem-demo-assets/gql-demo-screen-${version}`, { path: path !== '' ? path : data.configurationByPath.item.homePage._path })
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


  }, [path, handleError, navigate]);

  let i = 0;

  document.title = title;

  return (
    <React.Fragment>

      {data.screen && data.screen.body.header && config.configurationByPath &&
        <Header content={data.screen.body.header} config={config.configurationByPath.item} />
      }
      <Flyout show={false} />
      <div className='main-body'>
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
              config={config.configurationByPath.item}
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

Screen.propTypes = {
  pos1: PropTypes.string,
  pos2: PropTypes.string,
  pos3: PropTypes.string,
  location: PropTypes.object
};

export default Screen;
