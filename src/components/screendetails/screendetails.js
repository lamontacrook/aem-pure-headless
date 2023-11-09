import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useErrorHandler } from 'react-error-boundary';
import Header from '../header';
import Footer from '../footer';
import './screendetails.css';
import { prepareRequest } from '../../utils';
import PropTypes from 'prop-types';
import { AppContext } from '../../utils/context';
import { Helmet } from 'react-helmet-async';
import Delayed from '../../utils/delayed';

const Screendetails = () => {
  const context = useContext(AppContext);
  const handleError = useErrorHandler();

  const [config, setConfiguration] = useState('');
  const [content, setContent] = useState({});
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState({});
  const [itinerary, setItinerary] = useState({});
  const [whatToBring, setWhatToBring] = useState({});
  const [adventure, setAdventure] = useState('');

  const props = useParams();
  const navigate = useNavigate();

  const version = localStorage.getItem('rda') === 'v1' ? 'v1' : 'v2';
  const configPath = `/content/dam/${context.project}/site/configuration/configuration`;

  useEffect(() => {
    let path = Object.values(props).pop();

    const findOverlap = (a, b) => {
      if (b.length === 0) return '';
      if (a.endsWith(b)) return b;
      if (a.indexOf(b) > 0) return b;
      return findOverlap(a, b.substring(0, b.length - 1));
    };

    const sdk = prepareRequest(context);

    sdk.runPersistedQuery('aem-demo-assets/gql-demo-configuration', { path: configPath })
      .then(({ data }) => {
        if (data) {
          setConfiguration(data);

          const items = { 'overview': setOverview, 'itinerary': setItinerary, 'whatToBring': setWhatToBring };

          Object.keys(items).forEach((key) => {
            if (Object.keys(data.configurationByPath.item[key]).includes('_dynamicUrl'))
              items[key]({ backgroundImage: 'url("' + `${context.serviceURL.replace(/\/$/, '')}${data.configurationByPath.item[key]._dynamicUrl}` + '")' });
            else
              items[key]({ backgroundImage: 'url("' + `${data.configurationByPath.item[key]._authorUrl}/jcr:content/renditions/${data.configurationByPath.item.renditionsConfiguration[900]}` + '")' });
          });

          if (data && data.configurationByPath) {
            let ovlp = findOverlap(data.configurationByPath.item.adventuresHome, path);
            path = data.configurationByPath.item.adventuresHome + path.replace(ovlp, '');
          }

          sdk.runPersistedQuery(`aem-demo-assets/gql-demo-adventure-${version}`, { path: path !== '' ? path : data.configurationByPath.item.homePage._path })
            .then(({ data }) => {
              if (data) {
                let pretitle = data.adventureByPath.item.description.plaintext;
                pretitle = pretitle && pretitle.substring(0, pretitle.indexOf('.'));

                let content = {
                  screen: {
                    body: {
                      header: {
                        navigationColor: 'light-nav',
                        teaser: {
                          __typename: 'TeaserModel',
                          asset: data.adventureByPath.item.primaryImage,
                          title: data.adventureByPath.item.title,
                          preTitle: pretitle,
                          _metadata: data.adventureByPath.item._metadata,
                          style: 'hero',
                          _path: data.adventureByPath.item._path
                        }
                      }
                    }
                  }
                };
                setTitle(data.adventureByPath.item.title);
                setAdventure(data);
                setContent(content);
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


  }, [handleError, navigate, configPath, props, version, context]);

  return (
    <React.Fragment>
      <Helmet>
        <title>WKND: {title}</title>
      </Helmet>
      {content && content.screen && config.configurationByPath &&
        <Header content={content.screen.body.header} config={config} className='screendetail' />
      }

      {overview && itinerary && whatToBring && adventure && adventure.adventureByPath && (
        <div className='main-body screendetail'>
          <div className='inner-content'>
            <h2>{title}</h2>

            <div className='adventure-details'>
              <ul>
                <li>
                  <h6>Activity</h6>
                  <hr />
                  <p>{adventure.adventureByPath.item.activity}</p>
                </li>
                <li>
                  <h6>Adventure Type</h6>
                  <hr />
                  <p>{adventure.adventureByPath.item.adventureType}</p>
                </li>
                <li>
                  <h6>Trip Length</h6>
                  <hr />
                  <p>{adventure.adventureByPath.item.tripLength}</p>
                </li>
                <li>
                  <h6>Group Size</h6>
                  <hr />
                  <p>{adventure.adventureByPath.item.groupSize}</p>
                </li>
                <li>
                  <h6>Difficulty</h6>
                  <hr />
                  <p>{adventure.adventureByPath.item.difficulty}</p>
                </li>
                <li>
                  <h6>Price</h6>
                  <hr />
                  <p>{adventure.adventureByPath.item.price}</p>
                </li>
              </ul>
            </div>

            <div>
              <div className="tab">
                <div className="item item-1" style={overview}>
                  <div>
                    <span>Overview</span>
                    <div className="inner-text" dangerouslySetInnerHTML={{ __html: adventure && adventure.adventureByPath && adventure.adventureByPath.item.description.html }} />
                  </div>
                </div>
                <div className="item item-2" style={itinerary}>
                  <div>
                    <span>Itinerary</span>
                    <div className="inner-text" dangerouslySetInnerHTML={{ __html: adventure && adventure.adventureByPath && adventure.adventureByPath.item.itinerary.html }} />
                  </div>
                </div>
                <div className="item item-3" style={whatToBring}>
                  <div>
                    <span>What to Bring</span>
                    <div className="inner-text" dangerouslySetInnerHTML={{ __html: adventure && adventure.adventureByPath && adventure.adventureByPath.item.gearList.html }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer>
        {config.configurationByPath && config.configurationByPath.item.footerExperienceFragment &&
          <Delayed waitBeforeShow={700}><Footer config={config.configurationByPath.item.footerExperienceFragment} /></Delayed>
        }
      </footer>
    </React.Fragment >
  );
};

Screendetails.propTypes = {
  context: PropTypes.object
};

export default Screendetails;