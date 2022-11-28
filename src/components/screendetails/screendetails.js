import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useErrorHandler } from 'react-error-boundary';
import AEMHeadless from '@adobe/aem-headless-client-js';
import Header from '../header/header';
import Footer from '../footer/footer';
import { expiry } from '../../utils/settings';
import './screendetails.css';

const Screendetails = () => {
  const handleError = useErrorHandler();

  const [config, setConfiguration] = useState('');
  const [data, setData] = useState({});
  const [title, setTitle] = useState('');

  const props = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let loggedin = JSON.parse(localStorage.getItem('loggedin'));
    if(!expiry() && !loggedin) navigate('/settings');

    let path = Object.values(props).pop();

    const findOverlap = (a, b) => {
      if (b.length === 0) return '';
      if (a.endsWith(b)) return b;
      if (a.indexOf(b) > 0) return b;
      return findOverlap(a, b.substring(0, b.length - 1));
    };

    const sdk = new AEMHeadless({
      serviceURL: localStorage.getItem('serviceURL'),
      endpoint: localStorage.getItem('endpoint'),
      auth: localStorage.getItem('auth')
    });

    sdk.runPersistedQuery('aem-demo-assets/gql-demo-configuration')
      .then(({ data }) => {
        if (data) {
          setConfiguration(data);

          if (data && data.configurationByPath) {
            let ovlp = findOverlap(data.configurationByPath.item.adventuresHome, path);
            path = data.configurationByPath.item.adventuresHome + path.replace(ovlp, '');
          }

          sdk.runPersistedQuery('aem-demo-assets/gql-demo-adventure', { path: path !== '' ? path : data.configurationByPath.item.homePage._path })
            .then(({ data }) => {
              if (data) {
                console.log(data);
                let content = {teaser: {
                  __typename:'TeaserModel',
                  asset: data.adventureByPath.item.primaryImage,
                  title: data.adventureByPath.item.title,
                  description: data.adventureByPath.item.description,
                  style: 'hero'
                }};
                setTitle(data.adventureByPath.item.title);

                setData(content);
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


  }, [props, handleError, navigate]);

  document.title = title;

  return (
    <React.Fragment>

      {config.configurationByPath &&
        <Header content={data} config={config.configurationByPath.item} />
      }

      <div className='main-body'>
        {/* <Flyout />
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
      ))} */}
      </div>
      <footer>
        {config.configurationByPath && config.configurationByPath.item.footerExperienceFragment &&
          <Footer config={config.configurationByPath.item.footerExperienceFragment._authorUrl} />
        }
      </footer>
    </React.Fragment>
  );
};

export default Screendetails;