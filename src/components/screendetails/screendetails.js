import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useErrorHandler } from 'react-error-boundary';
import Header from '../header';
import Footer from '../footer';
import './screendetails.css';
import { prepareRequest } from '../../utils';
import PropTypes from 'prop-types';

const Screendetails = ({context}) => {
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
  let loggedin = JSON.parse(context.loggedin);
 
  useEffect(() => {
    if (!loggedin) navigate('/settings');

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
          setOverview({ backgroundImage: 'url("' + `${data.configurationByPath.item.overview._publishUrl}/jcr:content/renditions/${data.configurationByPath.item.renditionsConfiguration[900]}` + '")' });
          setItinerary({ backgroundImage: 'url("' + `${data.configurationByPath.item.itinerary._publishUrl}/jcr:content/renditions/${data.configurationByPath.item.renditionsConfiguration[900]}` + '")' });
          setWhatToBring({ backgroundImage: 'url("' + `${data.configurationByPath.item.whatToBring._publishUrl}/jcr:content/renditions/${data.configurationByPath.item.renditionsConfiguration[900]}` + '")' });

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


  }, [handleError, navigate, loggedin, configPath, props, version, context]);

  document.title = title;
  return (
    <React.Fragment>
      {content && content.screen && config.configurationByPath &&
        <Header data={content} config={config} className='screendetail' context={context} />
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
                  <span>Overview</span>
                  <div className="inner-text" dangerouslySetInnerHTML={{ __html: adventure && adventure.adventureByPath && adventure.adventureByPath.item.description.html }} />
                </div>
                <div className="item item-2" style={itinerary}>
                  <span>Itinerary</span>
                  <div className="inner-text" dangerouslySetInnerHTML={{ __html: adventure && adventure.adventureByPath && adventure.adventureByPath.item.itinerary.html }} />
                </div>
                <div className="item item-3" style={whatToBring}>
                  <span>What to Bring</span>
                  <div className="inner-text" dangerouslySetInnerHTML={{ __html: adventure && adventure.adventureByPath && adventure.adventureByPath.item.gearList.html }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      <footer>
        {config.configurationByPath && config.configurationByPath.item.footerExperienceFragment &&
          <Footer config={config.configurationByPath.item.footerExperienceFragment} context={context} />
        }
      </footer>
    </React.Fragment >
  );
};

Screendetails.propTypes = {
  context: PropTypes.object
};

export default Screendetails;