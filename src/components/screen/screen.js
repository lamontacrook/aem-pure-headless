import React, { useEffect, useState } from 'react';
import ModelManager from '../../utils/modelmanager';
import Footer from '../footer';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { prepareRequest, rootPath } from '../../utils';
import Header from '../header';
import { useErrorHandler } from 'react-error-boundary';
import { expiry } from '../../utils/settings';
import './screen.css';

let configPath = '';
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

  configPath = `/content/dam/${localStorage.getItem('project')}/site/configuration/configuration`;
  let loggedin = JSON.parse(localStorage.getItem('loggedin'));

  console.log(loggedin);
  useEffect(() => {

    if (!expiry() && !loggedin) navigate('/settings');
    // let loggedin = JSON.parse(localStorage.getItem('loggedin'));
    if (!expiry() && !loggedin) navigate('/settings');

    const version = localStorage.getItem('rda') === 'v1' ? 'v1' : 'v2';

    const sdk = prepareRequest();

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
        error.message = `Error with gql-demo-configuration request:\n ${error.message}`;
        handleError(error);
      });


  }, [handleError, navigate, path, loggedin]);

  let i = 0;

  document.title = title;

  return (
    <React.Fragment>

      {data && data.screen && data.screen.body.header && config.configurationByPath &&
        <Header data={data} content={data.screen.body.header} config={config} />
      }

      <div className='main-body'>
        {data && data.screen && data.screen.body.block.map((item) => (
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
        {config && config.configurationByPath && config.configurationByPath.item.footerExperienceFragment &&
          <Footer config={config.configurationByPath.item.footerExperienceFragment} />
        }
      </footer>
    </React.Fragment>
  );
};

Screen.propTypes = {
  pos1: PropTypes.string,
  pos2: PropTypes.string,
  pos3: PropTypes.string,
  location: PropTypes.object,
};

export const ConfigurationGQL = `query ConfigurationByPath($path: String!)
{
	configurationByPath(_path: $path) {
    item {
      adventuresHome
      homePage {
        ...on ScreenModel {
          _path
        }
      }
      footerExperienceFragment {
        ...on PageRef {
          __typename
          _authorUrl
          _publishUrl
        }
      }
      siteLogo {
        ...on ImageRef {
          _authorUrl
          _publishUrl
        }
      }
      renditionsConfiguration
    }
  }
}

{
  "path":"${configPath}"
}`;

export default Screen;
