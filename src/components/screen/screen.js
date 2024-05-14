import React, { useEffect, useState, useContext, useRef } from 'react';
import ModelManager from '../../utils/modelmanager';
import Footer from '../footer';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { prepareRequest } from '../../utils';
import Header from '../header';
import { useErrorHandler } from 'react-error-boundary';
import './screen.css';
import { AppContext } from '../../utils/context';
import { Helmet } from 'react-helmet-async';
import Delayed from '../../utils/delayed';
import Modal from '../modal';
import { editorProps } from '../../utils/ue-definitions';

let configPath = '';
const Screen = () => {
  const context = useContext(AppContext);
  const handleError = useErrorHandler();
  const navigate = useNavigate();

  const [config, setConfiguration] = useState('');
  const [data, setData] = useState('');
  const [title, setTitle] = useState('');
  const props = useParams();
  const path = useRef('');

  if (Object.values(props).length && Object.values(props)[0] !== '')
    path.current = (Object.values(props)[0].includes(context.rootPath)) ?
      `/${Object.values(props)[0]}` :
      `/${context.rootPath}/${context.project}/${Object.values(props)[0]}`;

  configPath = `/content/dam/${context.project}/site/configuration/configuration-v2`;

  useEffect(() => {
    const sdk = prepareRequest(context);
    sdk.runPersistedQuery(`aem-demo-assets/${context.pqs.config}`, { path: configPath })
      .then(({ data }) => {
        if (data) {
          setConfiguration(data);
          context.config = data;
          
          path.current = path.current !== '' ? path.current : data.configurationByPath.item.homePage._path;
          const params = { path: path.current, variation: context.audience?.value,  };

          if (context.serviceURL.includes('author')) params['ts'] = new Date().getTime();
          sdk.runPersistedQuery(`aem-demo-assets/${context.pqs.screen}`, params)
            .then(({ data }) => {
              if (data) {
                if (Array.isArray(data.screen.body)) {
                  data.screen.body = data.screen.body[0];
                }
                setTitle(data.screen.body.screenTitle);
                setData(data);
                context.screenResponse = data;
              }
            })
            .catch((error) => {
              error.message = `Error with gql-demo-screen-v2 request:\n ${error.message}`;
              handleError(error);
            });
        }
      })
      .catch((error) => {
        error.message = `Error with gql-demo-configuration request:\n ${error.message}`;
        handleError(error);
      });


  }, [handleError, navigate, path, context]);

  updateCss();

  return (
    <React.Fragment>
      <Helmet>
        <title>WKND: {title}</title>
      </Helmet>
      {data && data.screen &&
        <div className='screen' {...editorProps(data.screen.body, `${title} Screen`, '', 'reference')} >
          {data.screen.body.header && config.configurationByPath &&
            <Header data={data} content={data.screen.body.header} config={config} className='screen' />
          }
          <div className='main-body' {...editorProps(data.screen.body, 'Screen Components', 'block', 'container', 'container')}>
            {data.screen.body.block.map((item, i) => {
              if (item && item?._model?.title) {
                return (
                  <div key={i} className='block'>
                    <Delayed waitBeforeShow={200}>
                      <ModelManager
                        key={`${item.__typename}-entity-${i}`}
                        content={item}
                        config={config.configurationByPath.item}
                        references={data.screen._references}
                      ></ModelManager>
                    </Delayed>
                  </div>
                );
              }
            })}
            {config && config.configurationByPath && config.configurationByPath.item && (
              <Modal config={config.configurationByPath.item} />
            )}
          </div>
        </div>}
      <footer>
        {config && config.configurationByPath && config.configurationByPath.item.footerExperienceFragment &&
          <Delayed waitBeforeShow={1200}><Footer config={config.configurationByPath.item.footerExperienceFragment} /></Delayed>
        }
      </footer>
    </React.Fragment>
  );
};

export const updateCss = () => {
  const cssVal = sessionStorage.getItem('css');
  if (cssVal) {
    cssVal.split(',').forEach((val) => {
      const [variable, value] = val.split(':');
      const root = document.querySelector(':root');
      root.style.setProperty(variable, value);
    });
  }
};

Screen.propTypes = {
  pos1: PropTypes.string,
  pos2: PropTypes.string,
  pos3: PropTypes.string,
  location: PropTypes.object,
  context: PropTypes.object
};

export const ScreenGQL = `query ScreenByPath($path: String!) {
  screen: screenByPath(_path: $path, _assetTransform: {format: PNG, preferWebp: true}) {
    body: item {
      __typename
      _metadata {
        stringMetadata {
          name
          value
        }
      }
      header {
        ... on HeaderModel {
          __typename
          _path
          _metadata {
            stringMetadata {
              name
              value
            }
          }
          banner {
            __typename
            ... on ImageRef {
              mimeType
              _authorUrl
              _dynamicUrl
              width
              height
            }
          }
          navigationColor
          teaser {
            __typename
            title
            style
            preTitle
            callToAction
            callToActionLink: link {
              __typename
              ... on AdventureModel {
                _path
              }
              ... on PageRef {
                _path
                _authorUrl
                _publishUrl
              }
            }
            asset {
              ... on MultimediaRef {
                _authorUrl
                format
                _publishUrl
              }
              ... on ImageRef {
                _authorUrl
                _dynamicUrl
                mimeType
                width
                height
              }
            }
            description {
              html
              plaintext
            }
            callToAction
          }
        }
      }
      block {
        ... on PageRef {
          _path
          _authorUrl
          _publishUrl
          __typename
        }
        ... on ImageListModel {
          _path
          style
          __typename
          _metadata {
            stringMetadata {
              value
              name
            }
          }
          imageListItems {
            ... on PageRef {
              __typename
              _path
              _authorUrl
              _publishUrl
              type
            }
            ... on AdventureModel {
              __typename
              _path
              title
              adventureType
              price
              activity
              tripLength
              primaryImage {
                ... on ImageRef {
                  _dynamicUrl
                  mimeType
                  _authorUrl
                  width
                  height
                }
              }
            }
          }
        }
        ... on TeaserModel {
          __typename
          _path
          _metadata {
            stringMetadata {
              name
              value
            }
          }
          title
          preTitle
          style
          asset {
            ... on MultimediaRef {
              _authorUrl
              format
              _publishUrl
            }
            ... on ImageRef {
              _authorUrl
              _dynamicUrl
              mimeType
              width
              height
            }
          }
          description {
            html
            plaintext
          }
          callToAction
          callToActionLink: link {
            __typename
            ... on AdventureModel {
              __typename
              _path
            }
            ... on PageRef {
              __typename
              _path
              _publishUrl
              _authorUrl
            }
          }
        }
      }
    }
  }
}
`;

export const ConfigurationGQL = `query ConfigurationByPath($path: String!) {
  configurationByPath(
    _path: $path
    _assetTransform: {format: PNG, preferWebp: true}
  ) {
    item {
      adventuresHome
      homePage {
        ... on ScreenModel {
          _path
        }
      }
      footerExperienceFragment {
        ... on PageRef {
          __typename
          _authorUrl
          _publishUrl
        }
      }
      siteLogo {
        ... on ImageRef {
          _authorUrl
          _dynamicUrl
        }
      }
      renditionsConfiguration
      overview {
        ... on ImageRef {
          _dynamicUrl
          _authorUrl
        }
      }
      itinerary {
        ... on ImageRef {
          _dynamicUrl
          _authorUrl
        }
      }
      whatToBring {
        ... on ImageRef {
          _dynamicUrl
          _authorUrl
        }
      }
    }
  }
}

{
  "path":"${configPath}"
}`;

export default Screen;