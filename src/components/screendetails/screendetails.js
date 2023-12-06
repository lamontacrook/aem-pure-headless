import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useErrorHandler } from 'react-error-boundary';
import Header from '../header';
import Footer from '../footer';
import Products from '../products';
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
  const [adventure, setAdventure] = useState('');
  const [productItems, setProductItems] = useState([]);
  const props = useParams();
  const navigate = useNavigate();

  const version = localStorage.getItem('rda') === 'v1' ? 'v1' : 'v2';
  const configPath = `/content/dam/${context.project}/site/configuration/configuration`;
  const products = 'https://main--cif--jihuang-adobe.hlx.page/products.json?sheet=wknd';

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
                
                fetch(products, {
                  headers: {
                    'Content-Type': 'text/html',
                  },
                  method: 'get'
                }).then((p) => p.json()).then(json => {
                  sdk.runPersistedQuery('aem-demo-assets/gql-demo-products', { slug: data.adventureByPath.item.slug })
                    .then(({ data }) => {
                      if (data) {
                        data.productsList.items.forEach((item) => {
                          if (data.productsList.items.length > 1 && item.adventure === 'default') return;
                          json.data.forEach((p) => {
                            item.products.find((elem) => {
                              if (p.product_sku === elem) {
                                setProductItems((e) => [...e, p]);
                              }
                            });

                          });

                        });
                      }
                    });
                }).catch((error) => { throw new Error(error); });
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

      {adventure && adventure.adventureByPath && (
        <div className='main-body screendetail'>
          <div className='inner-content'>
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

            <div className='adventure-content'>
              <div className="tab">
                <div className="item item-1">
                  <div>
                    <span>Overview</span>
                    <div className="inner-text" dangerouslySetInnerHTML={{ __html: adventure && adventure.adventureByPath && adventure.adventureByPath.item.description.html }} />
                  </div>
                </div>
                <div className="item item-2">
                  <div>
                    <span>Itinerary</span>
                    <div className="inner-text" dangerouslySetInnerHTML={{ __html: adventure && adventure.adventureByPath && adventure.adventureByPath.item.itinerary.html }} />
                  </div>
                </div>
                <div className="item item-3">
                  <div>
                    <span>What to Bring</span>
                    <div className="inner-text" dangerouslySetInnerHTML={{ __html: adventure && adventure.adventureByPath && adventure.adventureByPath.item.gearList.html }} />
                  </div>
                </div>
              </div>
            </div>

            <div className='adventure-products'>
              <Products productItems={productItems} />
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