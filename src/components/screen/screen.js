import React, { useEffect, useState } from 'react';
import ModelManager from '../../utils/modelmanager';
import { ScreenQry } from '../../api/query';
import AEMHeadless from '@adobe/aem-headless-client-js';
import './screen.css';
import Navigation from '../navigation';
import Footer from '../footer';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const Screen = () => {
  const props = useParams();
  const re = new RegExp('{([^}]*)}');

  const filters = re.exec(props.screen);

  if (filters && filters.length === 2) {
    props.screen = props.screen.replace(filters[0], '');
    props.filter = filters[1];
  }

  console.log(`${localStorage.getItem('project')}/site/${props.folder}/${props.screen}/${props.screen}`);

  const [config, setConfiguration] = useState('');
  const [data, setData] = useState('');

  useEffect(() => {

    const sdk = new AEMHeadless({
      serviceURL: localStorage.getItem('serviceURL'),
      endpoint: localStorage.getItem('endpoint'),
      auth: localStorage.getItem('auth')
    });

    sdk.runPersistedQuery('gql-demo/configuration')
      .then(({ data }) => {
        if (data)
          setConfiguration(data);
      })
      .catch((error) => {
        console.log(error);
      });

    //'gql-demo/screen', { path: '/content/dam/gql-demo/site/home/home'}) //
    sdk.runPersistedQuery('gql-demo/screen', { path: '/content/dam/gql-demo/site/home/home'})
      .then(({ data }) => {
        if (data) {
          if (Array.isArray(data.screen.body)) {
            data.screen.body = data.screen.body[0];
          }
          setData(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);


  // const data = gql['data'];
  // console.log(data.screen);
  let i = 0;

  // if (Array.isArray(data.screen.body)) data.screen.body = data.screen.body[0];

  function hideGQL() {
    document.querySelector('.fly-out-gql').style.display = 'none';
  }

  function showPayload() {
    document.querySelector('.fly-out-gql > pre').innerHTML = `<pre>${ScreenQry()}</pre>`;
  }

  function showResponse() {
    document.querySelector('.fly-out-gql > pre').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }
  // console.log(screen);
  return (
    <React.Fragment>
      <nav>
        {config.configurationByPath &&
          <Navigation logo={config.configurationByPath.item.siteLogo} />
        }
      </nav>

      <div className='main-body'>
        <div className='fly-out-gql payload'>
          <button onClick={showResponse} className='button'>Show Response</button>
          <button onClick={showPayload} className='button'>Show Request</button>
          <button onClick={hideGQL} className='button'>Hide GQL</button>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
        {data && data.screen.body.block.map((item) => (
          <div
            key={`${item._model.title
              .toLowerCase()
              .replace(' ', '-')}-block-${item._model._path}-${i}`}
            className='block'
          >

            <ModelManager
              key={`${item._model.title
                .toLowerCase()
                .replace(' ', '-')}-entity-${item._model._path}-${i++}`}
              type={item._model.title}
              content={item}
              references={data.screen._references}
            >

            </ModelManager>
          </div>
          // <div key='1'>{item._model && JSON.stringify(item._model['title'])}</div>
        ))}
        {/* <div>{data.screen}</div> */}
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
  screen: PropTypes.string,
  folder: PropTypes.string
};

export default Screen;
