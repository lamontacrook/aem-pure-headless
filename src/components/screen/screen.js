import React, { useEffect, useState } from 'react';
import ModelManager from '../../utils/modelmanager';
import { ScreenQry } from '../../api/query';
import AEMHeadless from '@adobe/aem-headless-client-js';
import './screen.css';
import Footer from '../footer';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { rootPath } from '../../utils';
import Header from '../header';
import gql from '../../api/gql.json';
import { useErrorHandler } from 'react-error-boundary';
import { expiry } from '../../utils/settings';


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
    if(!expiry() && !loggedin) navigate('/settings');

    const sdk = new AEMHeadless({
      serviceURL: localStorage.getItem('serviceURL'),
      endpoint: localStorage.getItem('endpoint'),
      auth: localStorage.getItem('auth')
    });

    sdk.runPersistedQuery('aem-demo-assets/gql-demo-configuration')
      .then(({ data }) => {
        if (data) {
          setConfiguration(data);
          sdk.runPersistedQuery('aem-demo-assets/gql-demo-screen', { path: path !== '' ? path : data.configurationByPath.item.homePage._path })
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

      <div className='main-body'>
        <Flyout />
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

const Flyout = () => {
  function hideGQL() {
    document.querySelector('.fly-out-gql').style.display = 'none';
  }

  function showPayload(e) {
    e.target.classList.toggle('selected');
    document.querySelector('.fly-out-gql > section.content').innerHTML = `<pre>${ScreenQry()}</pre>`;
  }

  function showResponse(e) {
    e.target.classList.toggle('selected');
    document.querySelector('.fly-out-gql > section.content').innerHTML = `<pre>${JSON.stringify(gql, null, 2)}</pre>`;
  }

  function getSections(e) {
    e.target.classList.toggle('selected');
    let items = [];
    document.querySelectorAll('section, header').forEach(item => {
      console.log(item);
      if(item.getAttribute('data-fragment'))
        items.push(`<a href='${localStorage.getItem('serviceURL')}editor.html${item.getAttribute('data-fragment')}' target='_blank'>${item.getAttribute('data-model')}</a>`);
    });
    document.querySelector('.fly-out-gql > section.content').innerHTML = `<ul><li>${items.join('</li><li>')}</li></ul>`;
  }

  return (
    <div className='fly-out-gql payload'>
      <div className='button-group'>
        <a onClick={(e) => showResponse(e)} className='button tab'>Show Response</a>
        <a onClick={showPayload} className='button tab'>Show Request</a>
        <a onClick={getSections} className='button tab'>Edit Content Fragments</a>
        <a onClick={hideGQL} className='button tab'>Hide GQL</a>
      </div>
      <section className='content'><pre>{JSON.stringify(gql, null, 2)}</pre></section>
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
