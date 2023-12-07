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
import { mapJsonRichText } from '../../utils/renderRichText';

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

    sdk.runPersistedQuery('aem-demo-assets/gql-demo-configuration', { path: configPath, cache: 'break' })
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
                          style: 'hero adventure',
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

  const editorProps = {
    itemID: `urn:aemconnection:${adventure.adventureByPath?.item?._path}/jcr:content/data/master`,
    itemType: 'reference',
    itemfilter: 'cf'
  };

  const adventureDetails = {
    activity: 'Activity',
    adventureType: 'Adventure Type',
    tripLength: 'Trip Length',
    groupSize: 'Group Size',
    difficulty: 'Difficulty',
    price: 'Price'
  };

  const adventureContent = {
    description: 'Overview',
    itinerary: 'Itinerary',
    gearList: 'What to Bring'
  };

  return (
    <div {...editorProps} data-editor-itemlabel='Adventure Details' itemScope>
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
                {Object.entries(adventureDetails).map(([key, val]) => (
                  <li key={key}>
                    <h6>{val}</h6>
                    <hr />
                    <p itemProp={key} itemType='text' data-editor-itemlabel={val} className={key}>{key === 'price' ? Number(adventure.adventureByPath.item[key]).toLocaleString('en') : adventure.adventureByPath.item[key]}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className='adventure-content'>
              <div className="tab">
                {Object.entries(adventureContent).map(([key, val]) => (
                  <div className="item" key={key}>
                    <div>
                      <span>{val}</span>
                      <div itemProp={key} itemType='text' data-editor-itemlabel={val} className='inner-text'>
                        {mapJsonRichText(adventure.adventureByPath.item[key].json, customRenderOptions(adventure.adventureByPath._references))}
                      </div>
                    </div>
                  </div>
                ))}
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
    </div>
  );
};

function customRenderOptions(references) {

  const renderReference = {
    // node contains merged properties of the in-line reference and _references object
    'ImageRef': (node) => {
      // when __typename === ImageRef
      return <img src={node._path} alt={'in-line reference'} />;
    }
  };

  return {
    nodeMap: {
      'reference': (node) => {

        // variable for reference in _references object
        let reference;

        // asset reference
        if (node.data.path) {
          // find reference based on path
          reference = references.find(ref => ref._path === node.data.path);
        }
        // Fragment Reference
        if (node.data.href) {
          // find in-line reference within _references array based on href and _path properties
          reference = references.find(ref => ref._path === node.data.href);
        }

        // if reference found return render method of it
        return reference ? renderReference[reference.__typename]({ ...reference, ...node }) : null;
      }
    },
  };
}

Screendetails.propTypes = {
  context: PropTypes.object
};

export default Screendetails;