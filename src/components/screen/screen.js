import React, { useEffect, useState, useContext } from 'react';
import ModelManager from '../../utils/modelmanager';
import Footer from '../footer';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { prepareRequest, rootPath } from '../../utils';
import Header from '../header';
import { useErrorHandler } from 'react-error-boundary';
import './screen.css';
import { AppContext } from '../../utils/context';
import { Helmet } from 'react-helmet-async';

let configPath = '';
const Screen = () => {
  const context = useContext(AppContext);
  const handleError = useErrorHandler();
  const navigate = useNavigate();

  const [config, setConfiguration] = useState('');
  const [data, setData] = useState('');
  const [title, setTitle] = useState('');

  const props = useParams();
  let path = '';
  
  if (Object.values(props).length && Object.values(props)[0] !== '')
    path = (Object.values(props)[0].includes(rootPath)) ? 
      `/${Object.values(props)[0]}` :
      `/${rootPath}/${context.project}/${Object.values(props)[0]}`;

  configPath = `/content/dam/${context.project}/site/configuration/configuration`;
  
  const version = 'v2';

  useEffect(() => {
    const sdk = prepareRequest(context);
    sdk.runPersistedQuery('aem-demo-assets/gql-demo-configuration-v2', { path: configPath })
      .then(({ data }) => {
        if (data) {
          const css = data.configurationByPath.item.cssVariables;
          
          /* add fonts */
          Object.keys(css.fontFace).forEach(async (f) => {
            const font = new FontFace(f, `${context.serviceURL}${rootPath}/${context.project}/assets/fonts/${css.fontFace[f]}`);
            await font.load();
            document.fonts.add(font);
          });

          /* add sytles */
          Object.keys(css.cssVariables).forEach((c) => {
            document.documentElement.style.setProperty(c, css.cssVariables[c]);
          });
          
          setConfiguration(data);
          sdk.runPersistedQuery('aem-demo-assets/gql-demo-screen-v3', { path: path !== '' ? path : data.configurationByPath.item.homePage._path })
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
              error.message = `Error with gql-demo-screen-v2 request:\n ${error.message}`;
              handleError(error);
            });
        }
      })
      .catch((error) => {
        error.message = `Error with gql-demo-configuration request:\n ${error.message}`;
        handleError(error);
      });

   

  }, [handleError, navigate, path, version, context]);

  let i = 0;
  
  return (
    <React.Fragment>
      <Helmet>
        <title>{config && config.configurationByPath.item.siteTitle.replace('${screenTitle}', title)}</title>
      </Helmet>
      {data && data.screen && data.screen.body.header && config.configurationByPath &&
        <Header data={data} content={data.screen.body.header} config={config} className='screen' />
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
              content={item}
              config={config.configurationByPath.item}
            ></ModelManager>
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
  context: PropTypes.object
};

export const ScreenGQL = `query ScreenByPath($path: String!) {
  screen: screenByPath(
    _path: $path
    _assetTransform: {format: PNG, preferWebp: true}
  ) {
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
            ... on GridteaserModel {
              imagePosition1 {
                ... on ImageRef {
                  _authorUrl
                  _dynamicUrl
                  width
                  height
                }
              }
              imagePosition3 {
                ... on ImageRef {
                  _authorUrl
                  _dynamicUrl
                  width
                  height
                }
              }
            }
            ... on TeaserModel {
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
